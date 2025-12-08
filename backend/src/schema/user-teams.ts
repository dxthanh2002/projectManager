import {
    mysqlTable,
    varchar,
    mysqlEnum,
    timestamp,
    index,
} from "drizzle-orm/mysql-core";
import { user } from "./auth.js";
import { team } from "./teams.js";

/**
 * User-Team Junction Table
 * Manages many-to-many relationship between users and teams
 * - Tracks team membership
 * - Stores role: 'manager' (team creator) or 'member' (invited)
 * - A user can be manager of Team A and member of Team B
 */
export const userTeam = mysqlTable(
    "user_team",
    {
        id: varchar("id", { length: 36 }).primaryKey(),
        userId: varchar("user_id", { length: 36 })
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        teamId: varchar("team_id", { length: 36 })
            .notNull()
            .references(() => team.id, { onDelete: "cascade" }),
        role: mysqlEnum("role", ["manager", "member"]).notNull().default("member"),
        joinedAt: timestamp("joined_at", { fsp: 3 }).defaultNow().notNull(),
        createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { fsp: 3 })
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("userTeam_userId_idx").on(table.userId),
        index("userTeam_teamId_idx").on(table.teamId),
        // Unique constraint: a user can only be in a team once
        index("userTeam_userId_teamId_unique").on(table.userId, table.teamId),
    ]
);
