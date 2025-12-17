import { z } from "zod";

export const createTeamSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Team name is required").max(60, "Team name must be less than 60 characters"),
        description: z.string().optional().nullable(),
    }),
});

export const updateTeamSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Team name is required").max(60).optional(),
        description: z.string().optional().nullable(),
    }),
    params: z.object({
        teamId: z.string().uuid("Invalid team ID"),
    }),
});

export const teamIdParamSchema = z.object({
    params: z.object({
        teamId: z.string().uuid("Invalid team ID"),
    }),
});

export const addMemberSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format"),
    }),
    params: z.object({
        teamId: z.string().uuid("Invalid team ID"),
    }),
});
