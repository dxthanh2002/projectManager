import { z } from 'zod';

/**
 * Validation Schemas for Task Endpoints
 */

// Task status enum
const taskStatusEnum = z.enum(['todo', 'in_progress', 'done', 'blocked'], {
    errorMap: () => ({ message: 'Status must be one of: todo, in_progress, done, blocked' }),
});

// Task priority enum
const taskPriorityEnum = z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Priority must be one of: low, medium, high' }),
});

// Create Task
export const createTaskSchema = z.object({
    params: z.object({
        teamId: z.string().uuid('Invalid team ID'),
    }),
    body: z.object({
        title: z.string()
            .min(1, 'Task title is required')
            .max(255, 'Task title must be less than 255 characters')
            .trim(),
        description: z.string()
            .max(5000, 'Description must be less than 5000 characters')
            .trim()
            .optional()
            .nullable(),
        priority: taskPriorityEnum.optional(),
        dueDate: z.string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format')
            .optional()
            .nullable(),
        assigneeId: z.string().uuid('Invalid assignee ID').optional().nullable(),
    }),
});

// Get Team Tasks (query params)
export const getTeamTasksSchema = z.object({
    params: z.object({
        teamId: z.string().uuid('Invalid team ID'),
    }),
    query: z.object({
        status: taskStatusEnum.optional(),
        assigneeId: z.string().uuid('Invalid assignee ID').optional(),
        priority: taskPriorityEnum.optional(),
    }).optional(),
});

// Get Task by ID
export const getTaskSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid task ID'),
    }),
});

// Update Task
export const updateTaskSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid task ID'),
    }),
    body: z.object({
        title: z.string()
            .min(1, 'Task title is required')
            .max(255, 'Task title must be less than 255 characters')
            .trim()
            .optional(),
        description: z.string()
            .max(5000, 'Description must be less than 5000 characters')
            .trim()
            .optional()
            .nullable(),
        priority: taskPriorityEnum.optional(),
        dueDate: z.string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format')
            .optional()
            .nullable(),
        assigneeId: z.string().uuid('Invalid assignee ID').optional().nullable(),
    }).refine(data => Object.keys(data).length > 0, {
        message: 'At least one field must be provided',
    }),
});

// Update Task Status
export const updateTaskStatusSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid task ID'),
    }),
    body: z.object({
        status: taskStatusEnum,
        comment: z.string()
            .min(1, 'Comment is required when marking task as blocked')
            .max(1000, 'Comment must be less than 1000 characters')
            .trim()
            .optional(),
    }).refine(data => {
        // If status is 'blocked', comment is required
        if (data.status === 'blocked' && !data.comment) {
            return false;
        }
        return true;
    }, {
        message: 'Comment is required when marking task as blocked',
        path: ['comment'],
    }),
});

// Delete Task
export const deleteTaskSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid task ID'),
    }),
});
