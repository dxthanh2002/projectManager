import { z } from 'zod';

/**
 * Validation Schemas for Team Endpoints
 */

// Create Team
export const createTeamSchema = z.object({
    body: z.object({
        name: z.string()
            .min(1, 'Team name is required')
            .max(255, 'Team name must be less than 255 characters')
            .trim(),
        description: z.string()
            .max(1000, 'Description must be less than 1000 characters')
            .trim()
            .optional()
            .nullable(),
    }),
});

// Update Team
export const updateTeamSchema = z.object({
    params: z.object({
        teamId: z.string().uuid('Invalid team ID'),
    }),
    body: z.object({
        name: z.string()
            .min(1, 'Team name is required')
            .max(255, 'Team name must be less than 255 characters')
            .trim()
            .optional(),
        description: z.string()
            .max(1000, 'Description must be less than 1000 characters')
            .trim()
            .optional()
            .nullable(),
    }).refine(data => data.name || data.description !== undefined, {
        message: 'At least one field must be provided',
    }),
});

// Team ID param
export const teamIdSchema = z.object({
    params: z.object({
        teamId: z.string().uuid('Invalid team ID'),
    }),
});

// Add Team Member
export const addTeamMemberSchema = z.object({
    params: z.object({
        teamId: z.string().uuid('Invalid team ID'),
    }),
    body: z.object({
        email: z.string().email('Invalid email address').optional(),
        userId: z.string().uuid('Invalid user ID').optional(),
    }).refine(data => data.email || data.userId, {
        message: 'Either email or userId must be provided',
    }),
});

// Remove Team Member
export const removeTeamMemberSchema = z.object({
    params: z.object({
        teamId: z.string().uuid('Invalid team ID'),
        userId: z.string().uuid('Invalid user ID'),
    }),
});

// Update Member Role
export const updateMemberRoleSchema = z.object({
    params: z.object({
        teamId: z.string().uuid('Invalid team ID'),
        userId: z.string().uuid('Invalid user ID'),
    }),
    body: z.object({
        role: z.enum(['manager', 'member'], {
            errorMap: () => ({ message: 'Role must be either "manager" or "member"' }),
        }),
    }),
});
