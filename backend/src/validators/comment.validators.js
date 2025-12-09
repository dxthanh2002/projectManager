import { z } from 'zod';

/**
 * Validation Schemas for Comment Endpoints
 */

// Get Task Comments
export const getTaskCommentsSchema = z.object({
    params: z.object({
        taskId: z.string().uuid('Invalid task ID'),
    }),
});

// Create Comment
export const createCommentSchema = z.object({
    params: z.object({
        taskId: z.string().uuid('Invalid task ID'),
    }),
    body: z.object({
        content: z.string()
            .min(1, 'Comment content is required')
            .max(2000, 'Comment must be less than 2000 characters')
            .trim(),
    }),
});

// Update Comment
export const updateCommentSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid comment ID'),
    }),
    body: z.object({
        content: z.string()
            .min(1, 'Comment content is required')
            .max(2000, 'Comment must be less than 2000 characters')
            .trim(),
    }),
});

// Delete Comment
export const deleteCommentSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid comment ID'),
    }),
});
