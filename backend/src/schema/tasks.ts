import {
    mysqlTable,
    varchar,
    text,
    mysqlEnum,
    date,
    timestamp,
    index,
} from "drizzle-orm/mysql-core";
import { user } from "./auth.js";
import { team } from "./teams.js";
import { comment } from "./comments.js";

/**
 * Tasks Table
 * Stores task information with team-scoped access
 * - Tasks belong to a team (team_id foreign key)
 * - Only team members can view/manage tasks
 * - Only team managers can create/assign tasks
 */
export const task = mysqlTable(
    "task",
    {
        id: varchar("id", { length: 36 }).primaryKey(),
        title: varchar("title", { length: 255 }).notNull(),
        description: text("description"),
        status: mysqlEnum("status", ["todo", "in_progress", "done", "blocked"])
            .notNull()
            .default("todo"),
        priority: mysqlEnum("priority", ["low", "medium", "high"])
            .notNull()
            .default("medium"),
        dueDate: date("due_date"),

        // Team relationship - CRITICAL for team-scoped access
        teamId: varchar("team_id", { length: 36 })
            .notNull()
            .references(() => team.id, { onDelete: "cascade" }),

        // User relationships
        assigneeId: varchar("assignee_id", { length: 36 }).references(
            () => user.id,
            { onDelete: "set null" }
        ),
        createdById: varchar("created_by_id", { length: 36 })
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),

        createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { fsp: 3 })
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("task_teamId_idx").on(table.teamId),
        index("task_assigneeId_idx").on(table.assigneeId),
        index("task_createdById_idx").on(table.createdById),
        index("task_status_idx").on(table.status),
        // Composite index for common query: get tasks by team and status
        index("task_teamId_status_idx").on(table.teamId, table.status),
    ]
);

