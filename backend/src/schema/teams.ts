import {
    mysqlTable,
    varchar,
    text,
    timestamp,
    index,
} from "drizzle-orm/mysql-core";
import { user } from "./auth.js";

/**
 * Teams Table
 * Stores team information for the Self-Service Team Model
 * - Any member can create a team
 * - Team creator automatically becomes the manager
 */
export const team = mysqlTable(
    "team",
    {
        id: varchar("id", { length: 36 }).primaryKey(),
        name: varchar("name", { length: 255 }).notNull(),
        description: text("description"),
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
        index("team_createdById_idx").on(table.createdById),
        index("team_name_idx").on(table.name),
    ]
);
