import {
    mysqlTable,
    varchar,
    text,
    timestamp,
    index,
} from "drizzle-orm/mysql-core";
import { user } from "./auth.js";
import { task } from "./tasks.js";

/**
 * Comments Table
 * Stores task comments for communication
 * - Required when task status changes to 'blocked' (blocker reason)
 * - Used for general task communication
 * - Triggers notifications to task participants
 */
export const comment = mysqlTable(
    "comment",
    {
        id: varchar("id", { length: 36 }).primaryKey(),
        content: text("content").notNull(),

        // Relationships
        taskId: varchar("task_id", { length: 36 })
            .notNull()
            .references(() => task.id, { onDelete: "cascade" }),
        userId: varchar("user_id", { length: 36 })
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),

        createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { fsp: 3 })
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("comment_taskId_idx").on(table.taskId),
        index("comment_userId_idx").on(table.userId),
        index("comment_createdAt_idx").on(table.createdAt),
    ]
);
