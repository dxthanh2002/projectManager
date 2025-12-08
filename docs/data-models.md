# Data Models

**Generated:** 2025-12-08 (Updated for Self-Service Team Model)  
**Database:** MySQL  
**ORM:** Drizzle ORM v0.44.7

## Overview

The application uses **Drizzle ORM** with MySQL as the database. Data models are defined in `backend/src/schema/` directory using Drizzle's TypeScript schema definitions.

**Architecture:** Team-scoped multi-tenancy model where all resources belong to teams.

## Database Schema

### Authentication Tables

**Schema File:** `backend/src/schema/auth.ts`

Authentication is handled by **better-auth** library, which manages its own tables:
- `user` - User accounts
- `session` - Active sessions
- `account` - OAuth provider accounts
- `verification` - Email verification tokens

> **Note:** better-auth automatically creates and manages these tables. See better-auth documentation for complete schema.

---

### Team Tables (NEW)

#### `team` Table

**Schema File:** `backend/src/schema/teams.ts`

Stores team information for the Self-Service Team Model.

```typescript
{
  id: VARCHAR(36) PRIMARY KEY,
  name: VARCHAR(255) NOT NULL,
  description: TEXT,
  created_by_id: VARCHAR(36) FK → user.id,
  created_at: TIMESTAMP(3),
  updated_at: TIMESTAMP(3)
}
```

**Field Details:**

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | VARCHAR(36) | PRIMARY KEY | UUID identifier |
| `name` | VARCHAR(255) | NOT NULL | Team name |
| `description` | TEXT | nullable | Team description |
| `created_by_id` | VARCHAR(36) | NOT NULL, FK → user.id | Team creator (auto-manager) |
| `created_at` | TIMESTAMP(3) | DEFAULT NOW | Creation timestamp |
| `updated_at` | TIMESTAMP(3) | AUTO UPDATE | Last modification |

**Indexes:**
- `idx_created_by` on `created_by_id`
- `idx_name` on `name`

**Relationships:**
- `created_by_id` → Many-to-One → `user.id`
- Has many `user_team` (members)
- Has many `task`

---

#### `user_team` Junction Table

**Schema File:** `backend/src/schema/user-teams.ts`

Manages many-to-many relationship between users and teams with role tracking.

```typescript
{
  id: VARCHAR(36) PRIMARY KEY,
  user_id: VARCHAR(36) FK → user.id,
  team_id: VARCHAR(36) FK → team.id,
  role: ENUM('manager', 'member') DEFAULT 'member',
  joined_at: TIMESTAMP(3),
  created_at: TIMESTAMP(3),
  updated_at: TIMESTAMP(3),
  UNIQUE(user_id, team_id)
}
```

**Field Details:**

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | VARCHAR(36) | PRIMARY KEY | UUID identifier |
| `user_id` | VARCHAR(36) | NOT NULL, FK → user.id | User reference |
| `team_id` | VARCHAR(36) | NOT NULL, FK → team.id | Team reference |
| `role` | ENUM | NOT NULL, DEFAULT 'member' | User role in team |
| `joined_at` | TIMESTAMP(3) | DEFAULT NOW | When user joined |
| `created_at` | TIMESTAMP(3) | DEFAULT NOW | Record creation |
| `updated_at` | TIMESTAMP(3) | AUTO UPDATE | Last modification |

**Indexes:**
- `idx_user` on `user_id`
- `idx_team` on `team_id`
- `unique_user_team` on `(user_id, team_id)` - Prevents duplicate memberships

**Relationships:**
- `user_id` → Many-to-One → `user.id`
- `team_id` → Many-to-One → `team.id`

**Business Rules:**
- Team creator automatically gets `role='manager'`
- Invited users get `role='member'`
- A user can only be in a team once (enforced by unique constraint)
- User can be manager of Team A and member of Team B

---

### Task Table (UPDATED)

**Schema File:** `backend/src/schema/tasks.ts`

```typescript
{
  id: VARCHAR(36) PRIMARY KEY,
  title: VARCHAR(255) NOT NULL,
  description: TEXT,
  status: ENUM('todo', 'in_progress', 'done', 'blocked') DEFAULT 'todo',
  priority: ENUM('low', 'medium', 'high') DEFAULT 'medium',
  due_date: DATE,
  team_id: VARCHAR(36) FK → team.id,  // NEW - CRITICAL
  assignee_id: VARCHAR(36) FK → user.id,
  created_by_id: VARCHAR(36) FK → user.id,
  created_at: TIMESTAMP(3),
  updated_at: TIMESTAMP(3)
}
```

**Field Details:**

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | VARCHAR(36) | PRIMARY KEY | UUID identifier |
| `title` | VARCHAR(255) | NOT NULL | Task title |
| `description` | TEXT | nullable | Task details |
| `status` | ENUM | DEFAULT 'todo' | Task status |
| `priority` | ENUM | DEFAULT 'medium' | Priority level |
| `due_date` | DATE | nullable | Task deadline |
| **`team_id`** | **VARCHAR(36)** | **NOT NULL, FK → team.id** | **Team ownership (NEW)** |
| `assignee_id` | VARCHAR(36) | FK → user.id, SET NULL | Assigned user |
| `created_by_id` | VARCHAR(36) | NOT NULL, FK → user.id | Task creator |
| `created_at` | TIMESTAMP(3) | DEFAULT NOW | Creation timestamp |
| `updated_at` | TIMESTAMP(3) | AUTO UPDATE | Last modification |

**Indexes:**
- `idx_team` on `team_id` (CRITICAL for access control)
- `idx_assignee` on `assignee_id`
- `idx_created_by` on `created_by_id`
- `idx_status` on `status`
- `idx_team_status` on `(team_id, status)` - Composite for dashboard queries

**Relationships:**
- `team_id` → Many-to-One → `team.id` (CASCADE DELETE)
- `assignee_id` → Many-to-One → `user.id` (SET NULL on delete)
- `created_by_id` → Many-to-One → `user.id` (CASCADE DELETE)
- Has many `comment`

**Breaking Change:** All tasks MUST belong to a team. Existing tasks need team assignment during migration.

---

### Comment Table (NEW)

**Schema File:** `backend/src/schema/comments.ts`

Stores task comments for communication and blocker reporting.

```typescript
{
  id: VARCHAR(36) PRIMARY KEY,
  content: TEXT NOT NULL,
  task_id: VARCHAR(36) FK → task.id,
  user_id: VARCHAR(36) FK → user.id,
  created_at: TIMESTAMP(3),
  updated_at: TIMESTAMP(3)
}
```

**Field Details:**

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | VARCHAR(36) | PRIMARY KEY | UUID identifier |
| `content` | TEXT | NOT NULL | Comment text |
| `task_id` | VARCHAR(36) | NOT NULL, FK → task.id | Parent task |
| `user_id` | VARCHAR(36) | NOT NULL, FK → user.id | Comment author |
| `created_at` | TIMESTAMP(3) | DEFAULT NOW | Creation timestamp |
| `updated_at` | TIMESTAMP(3) | AUTO UPDATE | Last modification |

**Indexes:**
- `idx_task` on `task_id`
- `idx_user` on `user_id`
- `idx_created` on `created_at`

**Relationships:**
- `task_id` → Many-to-One → `task.id` (CASCADE DELETE)
- `user_id` → Many-to-One → `user.id` (CASCADE DELETE)

**Business Rules:**
- Required when task status changes to 'blocked' (blocker reason)
- Triggers notifications to task participants

---

## Entity Relationships

```
user (from better-auth)
  ↓ 1:N (created_by_id)
team ←──────────────────┐
  ↓ 1:N                 │
user_team (junction)    │
  ↓ N:1                 │
user ───────────────────┘
  ↓ 1:N (created_by_id, assignee_id)
task
  ↓ N:1 (team_id)
team
  ↓ 1:N
comment
  ↓ N:1 (user_id)
user
```

## Enumerations

### Task Status
- `todo` - Not started (default)
- `in_progress` - Currently being worked on
- `done` - Completed
- `blocked` - Cannot proceed (requires comment)

### Task Priority
- `low` - Low priority
- `medium` - Medium priority (default)
- `high` - High priority

### User Team Role
- `manager` - Team creator, can assign tasks and manage members
- `member` - Team member, can execute tasks (default)

## Cascade Delete Rules

| Parent Deleted | Child Table | Action |
|----------------|-------------|--------|
| `user` | `team.created_by_id` | CASCADE |
| `user` | `user_team.user_id` | CASCADE |
| `user` | `task.created_by_id` | CASCADE |
| `user` | `task.assignee_id` | **SET NULL** |
| `user` | `comment.user_id` | CASCADE |
| `team` | `user_team.team_id` | CASCADE |
| `team` | `task.team_id` | CASCADE |
| `task` | `comment.task_id` | CASCADE |

## Migrations

**Location:** `backend/src/migrations/`

The project uses Drizzle Kit for database migrations:
- Migration files managed via `drizzle-kit` (v0.31.7)
- Run migrations with: `pnpm drizzle-kit migrate`

**New Migrations for Team Model:**
1. `0001_create_teams.sql` - Create team table
2. `0002_create_user_teams.sql` - Create user_team junction table
3. `0003_update_tasks_add_team.sql` - Add team_id to tasks
4. `0004_create_comments.sql` - Create comment table

## ORM Configuration

**File:** `backend/drizzle.config.ts`

Drizzle configuration for:
- Database connection
- Schema location: `backend/src/schema/`
- Migration paths
- TypeScript generation

**Schema Files:**
- `auth.ts` - Authentication tables (better-auth)
- `teams.ts` - Team table
- `user-teams.ts` - User-team junction table
- `tasks.ts` - Task table (updated)
- `comments.ts` - Comment table
- `relations.ts` - All Drizzle relations
- `index.ts` - Schema exports

## Database Connection

**File:** `backend/src/lib/db.js`

Establishes MySQL connection using:
- `mysql2` driver (v3.15.3)
- `drizzle-orm` for query building
- Environment variables for connection string

## Data Access Patterns

- **ORM:** Drizzle ORM (type-safe queries)
- **Driver:** mysql2 (native MySQL driver)
- **Migration Strategy:** Forward-only migrations with Drizzle Kit
- **Schema Versioning:** Timestamp-based migration files
- **Access Control:** Team-scoped queries (all queries MUST filter by team_id)

## Security Notes

1. **Team-Scoped Access:** ALL queries must filter by `team_id` to prevent data leaks
2. **Authorization:** Check team membership before any data access
3. **Role Validation:** Verify manager role for privileged operations
4. **Foreign Keys:** Enforced at database level for data integrity
5. **Cascade Deletes:** Automatic cleanup of related records

## Performance Considerations

**Critical Indexes:**
- `task(team_id, status)` - Dashboard queries
- `user_team(user_id, team_id)` - Membership checks
- `comment(task_id, created_at)` - Comment listing

**Query Optimization:**
- Use composite indexes for common filter combinations
- Cache user team memberships in session
- Use joins instead of N+1 queries

## Notes

1. **Auth Tables:** Managed entirely by better-auth - do not modify directly
2. **Team Model:** Self-service - any user can create teams
3. **Multi-Role Support:** User can be manager of Team A and member of Team B
4. **Timestamps:** Automatic tracking via `created_at` and `updated_at`
5. **Soft Delete:** Not implemented (hard deletes with cascade)
6. **UUID Primary Keys:** VARCHAR(36) for distributed scalability
