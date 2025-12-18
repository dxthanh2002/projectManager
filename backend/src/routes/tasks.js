import { Router } from 'express';
import { db } from '../lib/db.js';
import { task, userTeam, user } from '../schema/index.ts';
import { eq, and, inArray, sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { requireAuth, requireTeamMembership, requireManagerRole } from './teams.js';

const router = Router();

/**
 * GET /api/teams/:teamId/tasks
 * List all tasks for a team with optional filters
 * Query params: status, assigneeId, priority
 */
router.get('/teams/:teamId/tasks', requireAuth, requireTeamMembership, async (req, res) => {
    try {
        const { teamId } = req.params;
        const { status, assigneeId, priority } = req.query;

        let query = db
            .select({
                id: task.id,
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate,
                teamId: task.teamId,
                assigneeId: task.assigneeId,
                createdById: task.createdById,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
                assignee: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
            })
            .from(task)
            .leftJoin(user, eq(task.assigneeId, user.id))
            .where(eq(task.teamId, teamId));

        // Apply filters
        if (status) {
            query = query.where(eq(task.status, status));
        }
        if (assigneeId) {
            query = query.where(eq(task.assigneeId, assigneeId));
        }
        if (priority) {
            query = query.where(eq(task.priority, priority));
        }

        const tasks = await query.orderBy(task.createdAt);

        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to fetch tasks' });
    }
});

/**
 * POST /api/teams/:teamId/tasks
 * Create a new task (manager only)
 */
router.post('/teams/:teamId/tasks', requireAuth, requireTeamMembership, requireManagerRole, async (req, res) => {
    try {
        const { teamId } = req.params;
        const { title, description, priority, dueDate, assigneeId } = req.body;
        const userId = req.user.id;

        // Validation
        if (!title || title.trim().length === 0) {
            return res.status(400).json({
                error: 'VALIDATION_ERROR',
                message: 'Task title is required'
            });
        }

        // Validate assignee is team member (if provided)
        if (assigneeId) {
            const isMember = await db
                .select()
                .from(userTeam)
                .where(and(
                    eq(userTeam.teamId, teamId),
                    eq(userTeam.userId, assigneeId)
                ))
                .limit(1);

            if (!isMember[0]) {
                return res.status(400).json({
                    error: 'VALIDATION_ERROR',
                    message: 'Assignee must be a team member'
                });
            }
        }

        // Create task
        const taskId = randomUUID();
        await db.insert(task).values({
            id: taskId,
            teamId: teamId,
            title: title.trim(),
            description: description?.trim() || null,
            priority: priority || 'medium',
            dueDate: dueDate || null,
            assigneeId: assigneeId || null,
            createdById: userId,
            status: 'todo',
        });

        // Fetch created task with assignee
        const createdTask = await db
            .select({
                id: task.id,
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate,
                teamId: task.teamId,
                assigneeId: task.assigneeId,
                createdById: task.createdById,
                createdAt: task.createdAt,
                assignee: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
            })
            .from(task)
            .leftJoin(user, eq(task.assigneeId, user.id))
            .where(eq(task.id, taskId))
            .limit(1);

        res.status(201).json(createdTask[0]);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to create task' });
    }
});

/**
 * GET /api/tasks/:id
 * Get task details (requires team membership)
 */
router.get('/tasks/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Get task with team membership check
        const taskData = await db
            .select({
                id: task.id,
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate,
                teamId: task.teamId,
                assigneeId: task.assigneeId,
                createdById: task.createdById,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
                assignee: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
            })
            .from(task)
            .leftJoin(user, eq(task.assigneeId, user.id))
            .innerJoin(userTeam, eq(task.teamId, userTeam.teamId))
            .where(and(
                eq(task.id, id),
                eq(userTeam.userId, userId)
            ))
            .limit(1);

        if (!taskData[0]) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'Task not found or access denied'
            });
        }

        res.json(taskData[0]);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to fetch task' });
    }
});

/**
 * PATCH /api/tasks/:id
 * Update task details (manager only)
 */
router.patch('/tasks/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priority, status, dueDate, assigneeId } = req.body;
        const userId = req.user.id;

        // Get task with team membership and role check
        const taskData = await db
            .select({
                task: task,
                role: userTeam.role,
            })
            .from(task)
            .innerJoin(userTeam, eq(task.teamId, userTeam.teamId))
            .where(and(
                eq(task.id, id),
                eq(userTeam.userId, userId)
            ))
            .limit(1);

        if (!taskData[0]) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'Task not found or access denied'
            });
        }

        // Check manager role
        if (taskData[0].role !== 'manager') {
            return res.status(403).json({
                error: 'FORBIDDEN',
                message: 'Only managers can update task details'
            });
        }

        // Validate assignee is team member (if changing)
        if (assigneeId && assigneeId !== taskData[0].task.assigneeId) {
            const isMember = await db
                .select()
                .from(userTeam)
                .where(and(
                    eq(userTeam.teamId, taskData[0].task.teamId),
                    eq(userTeam.userId, assigneeId)
                ))
                .limit(1);

            if (!isMember[0]) {
                return res.status(400).json({
                    error: 'VALIDATION_ERROR',
                    message: 'Assignee must be a team member'
                });
            }
        }

        // Build updates
        const updates = {};
        if (title !== undefined) updates.title = title.trim();
        if (description !== undefined) updates.description = description?.trim() || null;
        if (priority !== undefined) updates.priority = priority;
        if (status !== undefined) updates.status = status;
        if (dueDate !== undefined) {
            // Convert ISO date string to MySQL DATE format (YYYY-MM-DD)
            updates.dueDate = dueDate ? dueDate.split('T')[0] : null;
        }
        if (assigneeId !== undefined) updates.assigneeId = assigneeId;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'No fields to update' });
        }

        await db.update(task).set(updates).where(eq(task.id, id));

        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to update task' });
    }
});

/**
 * PATCH /api/tasks/:id/status
 * Update task status (assignee or manager)
 * - Requires comment if status is 'blocked'
 */
router.patch('/tasks/:id/status', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, comment } = req.body;
        const userId = req.user.id;

        // Validation
        const validStatuses = ['todo', 'in_progress', 'done', 'blocked'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                error: 'VALIDATION_ERROR',
                message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
            });
        }

        // Require comment for blocked status
        if (status === 'blocked' && (!comment || comment.trim().length === 0)) {
            return res.status(400).json({
                error: 'VALIDATION_ERROR',
                message: 'Comment is required when marking task as blocked'
            });
        }

        // Get task with team membership check
        const taskData = await db
            .select({
                task: task,
                role: userTeam.role,
            })
            .from(task)
            .innerJoin(userTeam, eq(task.teamId, userTeam.teamId))
            .where(and(
                eq(task.id, id),
                eq(userTeam.userId, userId)
            ))
            .limit(1);

        if (!taskData[0]) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'Task not found or access denied'
            });
        }

        // Check permission (assignee or manager)
        const isAssignee = taskData[0].task.assigneeId === userId;
        const isManager = taskData[0].role === 'manager';

        if (!isAssignee && !isManager) {
            return res.status(403).json({
                error: 'FORBIDDEN',
                message: 'Only the assignee or team manager can update task status'
            });
        }

        // Update status
        await db.update(task).set({ status }).where(eq(task.id, id));

        // Add comment if provided (handled by comment routes)
        // This would trigger WebSocket events in production

        res.json({
            id,
            status,
            message: 'Task status updated successfully'
        });
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to update task status' });
    }
});

/**
 * DELETE /api/tasks/:id
 * Delete task (manager only)
 */
router.delete('/tasks/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Get task with team membership and role check
        const taskData = await db
            .select({
                task: task,
                role: userTeam.role,
            })
            .from(task)
            .innerJoin(userTeam, eq(task.teamId, userTeam.teamId))
            .where(and(
                eq(task.id, id),
                eq(userTeam.userId, userId)
            ))
            .limit(1);

        if (!taskData[0]) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'Task not found or access denied'
            });
        }

        // Check manager role
        if (taskData[0].role !== 'manager') {
            return res.status(403).json({
                error: 'FORBIDDEN',
                message: 'Only managers can delete tasks'
            });
        }

        await db.delete(task).where(eq(task.id, id));

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to delete task' });
    }
});

export default router;
