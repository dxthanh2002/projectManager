import { relations } from "drizzle-orm";
import { task } from "./tasks.js";
import { comment } from "./comments.js";
import { user } from "./auth.js";
import { team } from "./teams.js";
import { userTeam } from "./user-teams.js";

/**
 * Team Relations
 * Defines relationships for the team table
 */
export const teamRelations = relations(team, ({ one, many }) => ({
    creator: one(user, {
        fields: [team.createdById],
        references: [user.id],
    }),
    members: many(userTeam),
    tasks: many(task),
}));

/**
 * User-Team Relations
 * Defines relationships for the user_team junction table
 */
export const userTeamRelations = relations(userTeam, ({ one }) => ({
    user: one(user, {
        fields: [userTeam.userId],
        references: [user.id],
    }),
    team: one(team, {
        fields: [userTeam.teamId],
        references: [team.id],
    }),
}));

/**
 * Task Relations
 * Defines relationships for the task table
 */
export const taskRelations = relations(task, ({ one, many }) => ({
    team: one(team, {
        fields: [task.teamId],
        references: [team.id],
    }),
    assignee: one(user, {
        fields: [task.assigneeId],
        references: [user.id],
    }),
    creator: one(user, {
        fields: [task.createdById],
        references: [user.id],
    }),
    comments: many(comment),
}));

/**
 * Comment Relations
 * Defines relationships for the comment table
 */
export const commentRelations = relations(comment, ({ one }) => ({
    task: one(task, {
        fields: [comment.taskId],
        references: [task.id],
    }),
    user: one(user, {
        fields: [comment.userId],
        references: [user.id],
    }),
}));
