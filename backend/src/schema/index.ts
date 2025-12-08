/**
 * Database Schema Index
 * Exports all tables and relations for Drizzle ORM
 * 
 * Import order matters to avoid circular dependencies:
 * 1. Base tables (user, team)
 * 2. Junction tables (user_team)
 * 3. Dependent tables (task, comment)
 * 4. Relations (imported after all tables are defined)
 */

// Auth tables (base)
export * from "./auth.js";

// Team tables
export * from "./teams.js";
export * from "./user-teams.js";

// Task and comment tables
export * from "./tasks.js";
export * from "./comments.js";

// Relations (must be imported after all tables)
export * from "./relations.js";

// Re-export for convenience
export { user, session, account, verification } from "./auth.js";
export { team } from "./teams.js";
export { userTeam } from "./user-teams.js";
export { task } from "./tasks.js";
export { comment } from "./comments.js";
export {
    teamRelations,
    userTeamRelations,
    taskRelations,
    commentRelations
} from "./relations.js";
