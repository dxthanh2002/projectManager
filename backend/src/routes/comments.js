import { Router } from 'express';
import { db } from '../lib/db.js';
import { comment, task, userTeam, user } from '../schema/index.ts';
import { eq, and, desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { requireAuth } from './teams.js';
import { emitToTeam } from '../lib/socket.js';

const router = Router();

/**
 * GET /api/tasks/:taskId/comments
 * List all comments for a task (requires team membership)
 */
router.get('/tasks/:taskId/comments', requireAuth, async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;

        // Verify user has access to this task (via team membership)
        const taskData = await db
            .select({ teamId: task.teamId })
            .from(task)
            .innerJoin(userTeam, eq(task.teamId, userTeam.teamId))
            .where(and(
                eq(task.id, taskId),
                eq(userTeam.userId, userId)
            ))
            .limit(1);

        if (!taskData[0]) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'Task not found or access denied'
            });
        }

        // Fetch comments with author info
        const comments = await db
            .select({
                id: comment.id,
                content: comment.content,
                taskId: comment.taskId,
                userId: comment.userId,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
                author: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
            })
            .from(comment)
            .innerJoin(user, eq(comment.userId, user.id))
            .where(eq(comment.taskId, taskId))
            .orderBy(comment.createdAt);

        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to fetch comments' });
    }
});

/**
 * POST /api/tasks/:taskId/comments
 * Add a comment to a task (requires team membership)
 */
router.post('/tasks/:taskId/comments', requireAuth, async (req, res) => {
    try {
        const { taskId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        // Validation
        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                error: 'VALIDATION_ERROR',
                message: 'Comment content is required'
            });
        }

        // Verify user has access to this task (via team membership)
        const taskData = await db
            .select({
                teamId: task.teamId,
                status: task.status
            })
            .from(task)
            .innerJoin(userTeam, eq(task.teamId, userTeam.teamId))
            .where(and(
                eq(task.id, taskId),
                eq(userTeam.userId, userId)
            ))
            .limit(1);

        if (!taskData[0]) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'Task not found or access denied'
            });
        }

        // Create comment
        const commentId = randomUUID();
        await db.insert(comment).values({
            id: commentId,
            taskId: taskId,
            userId: userId,
            content: content.trim(),
        });

        // Fetch created comment with author
        const createdComment = await db
            .select({
                id: comment.id,
                content: comment.content,
                taskId: comment.taskId,
                userId: comment.userId,
                createdAt: comment.createdAt,
                author: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
            })
            .from(comment)
            .innerJoin(user, eq(comment.userId, user.id))
            .where(eq(comment.id, commentId))
            .limit(1);

        // Emit WebSocket event for real-time updates
        emitToTeam(taskData[0].teamId, 'comment:added', {
            taskId: taskId,
            commentId: commentId,
            content: content.trim(),
            authorId: userId,
            authorName: req.user.name || req.user.email,
            teamId: taskData[0].teamId,
        });

        res.status(201).json(createdComment[0]);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to create comment' });
    }
});

/**
 * PATCH /api/comments/:id
 * Update a comment (author only)
 */
router.patch('/comments/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        // Validation
        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                error: 'VALIDATION_ERROR',
                message: 'Comment content is required'
            });
        }

        // Get comment and verify ownership
        const commentData = await db
            .select()
            .from(comment)
            .where(eq(comment.id, id))
            .limit(1);

        if (!commentData[0]) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'Comment not found'
            });
        }

        // Check if user is the author
        if (commentData[0].userId !== userId) {
            return res.status(403).json({
                error: 'FORBIDDEN',
                message: 'Only the comment author can edit it'
            });
        }

        // Update comment
        await db.update(comment)
            .set({ content: content.trim() })
            .where(eq(comment.id, id));

        res.json({ message: 'Comment updated successfully' });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to update comment' });
    }
});

/**
 * DELETE /api/comments/:id
 * Delete a comment (author or team manager)
 */
router.delete('/comments/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Get comment with task and team info
        const commentData = await db
            .select({
                comment: comment,
                teamId: task.teamId,
            })
            .from(comment)
            .innerJoin(task, eq(comment.taskId, task.id))
            .where(eq(comment.id, id))
            .limit(1);

        if (!commentData[0]) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'Comment not found'
            });
        }

        // Check if user is the author
        const isAuthor = commentData[0].comment.userId === userId;

        // Check if user is team manager
        const membership = await db
            .select()
            .from(userTeam)
            .where(and(
                eq(userTeam.teamId, commentData[0].teamId),
                eq(userTeam.userId, userId)
            ))
            .limit(1);

        const isManager = membership[0]?.role === 'manager';

        if (!isAuthor && !isManager) {
            return res.status(403).json({
                error: 'FORBIDDEN',
                message: 'Only the comment author or team manager can delete it'
            });
        }

        // Delete comment
        await db.delete(comment).where(eq(comment.id, id));

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to delete comment' });
    }
});

export default router;
