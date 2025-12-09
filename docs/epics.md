# managercheck - Epic Breakdown

**Author:** ThanhThanhThanh
**Date:** 2025-12-09
**Project Level:** MVP
**Target Scale:** Small Team (Self-Service)

---

## Overview

This document provides the complete epic and story breakdown for **managercheck**, decomposing the requirements from the [PRD](./prd.md) into implementable stories. It integrates technical decisions from [Architecture](./architecture.md) to ensure stories are ready for implementation.

**Success Philosophy:** Focus on the "Leader-Member Delegation Loop" first.

---

## Functional Requirements Inventory

| ID | Category | Description |
| :--- | :--- | :--- |
| **FR1** | Auth | Users can sign up with email and password. |
| **FR2** | Auth | Users can log in to access the system. |
| **FR3** | Auth | Users can log out of the system. |
| **FR4** | Auth | System persists user session across browser refreshes. |
| **FR5** | Tasks | Managers can create a new task with title, description, priority, and due date. |
| **FR6** | Tasks | Managers can assign a task to a team member. |
| **FR7** | Tasks | Managers can edit an existing task's details. |
| **FR8** | Tasks | Managers can delete a task. |
| **FR9** | Tasks | Members can view the full details of a task assigned to them. |
| **FR10** | Tasks | Members can change the status of their assigned task (Todo, In Progress, Done, Blocked). |
| **FR11** | Tasks | Users can add comments to a task. |
| **FR12** | Tasks | Users can view all comments on a task. |
| **FR13** | Dashboard | Managers can view a dashboard showing all tasks assigned to their team. |
| **FR14** | Dashboard | Managers can filter tasks by status (Todo, In Progress, Done, Blocked). |
| **FR15** | Dashboard | Managers can filter tasks by assigned member. |
| **FR16** | Dashboard | Members can view a "My Tasks" list showing only tasks assigned to them. |
| **FR17** | Dashboard | Members can filter their tasks by status. |
| **FR18** | Team | Any Member can create a new team by providing a team name and optional description. |
| **FR18a** | Team | User who creates a team automatically becomes the Manager of that team. |
| **FR19** | Team | Managers can add a new team member to their team by email or username. |
| **FR20** | Team | Managers can view a list of all members in their team(s). |
| **FR21** | Team | Managers can remove a team member from their team(s). |
| **FR22** | Real-Time | Members receive real-time notification when a new task is assigned to them. |
| **FR23** | Real-Time | Managers receive real-time notification when a task status changes to Blocked. |
| **FR24** | Real-Time | Managers receive real-time notification when a task status changes to Done. |
| **FR25** | Real-Time | Users receive real-time notification when a comment is added to a task they are involved with. |

---

## Epic 1: Foundation & Authentication

**Goal:** Establish the technical groundwork (middleware, error handling) and implement secure user access to enable multi-tenancy.

### Story 1.1: Backend Middleware & Error Handling Strategy
**As a** Developer,
**I want** to standardize validation, authentication middleware, and error handling,
**So that** the API is secure, consistent, and easy to debug.

**Acceptance Criteria:**
- **Given** the existing codebase, **When** I refactor `src/middleware`, **Then** I should have:
  - `auth.js`: Exports `requireAuth`, `requireTeamMembership`, `requireManagerRole` (refactored from routes).
  - `validate.js`: Generic Zod validation middleware (existing).
  - `error.js`: New global error handler that catches 400 (Zod), 401/403 (Auth), 500 (Unknown).
- **And** all existing routes in `src/routes/*.js` use these centralized middlewares.
- **And** API responses for errors follow `{ error: "CODE", message: "Desc", details?: [] }`.

**Technical Notes:**
- Move inline middleware from `teams.js` into `src/middleware/auth.js`.
- Implement `app.use(errorHandler)` in `server.js` after all routes.

### Story 1.2: User Signup & Login (Better-Auth Integration)
**As a** Guest,
**I want** to sign up and log in,
**So that** I can access the system and maintain my session.

**Acceptance Criteria:**
- **Given** I am on the Signup page, **When** I submit valid email/password, **Then** a new user is created via `better-auth`.
- **Given** I am logged in, **When** I refresh the page, **Then** my session persists (cookies).
- **Given** I am logged in, **When** I click Logout, **Then** my session is destroyed and I am redirected to Login.
- **Frontend:** Use `useAuthStore` (Pinia) to manage user state.

**Technical Notes:**
- Reuse existing `better-auth` setup.
- Ensure `useAuthStore` fetches `/api/auth/session` on app init.
- Covered FRs: FR1, FR2, FR3, FR4.

---

## Epic 2: Team Management (Multi-Tenancy)

**Goal:** Allow users to create self-service teams and manage membership, establishing the boundaries for task delegation.

### Story 2.1: Team Creation & Manager Promotion
**As a** Member,
**I want** to create a new team,
**So that** I can become a Manager and start assigning tasks.

**Acceptance Criteria:**
- **Given** I am a logged-in user, **When** I create a team "Engineering", **Then**:
  - A new `team` record is created.
  - I am added to `user_team` with role `'manager'`.
  - The UI updates to show the new team context.
- **And** the backend validates `name` is required (Zod).

**Technical Notes:**
- API: POST `/api/teams` (Existing, verify Zod validation integration).
- DB: Insert into `team` then `user_team`. Transaction recommended.
- Covered FRs: FR18, FR18a.

### Story 2.2: Member Invitation & Management
**As a** Manager,
**I want** to add and remove members,
**So that** I can build my team.

**Acceptance Criteria:**
- **Given** I am a Manager of Team A, **When** I add user "dave@example.com", **Then**:
  - If user exists, they are added to `user_team` (role: 'member').
  - The list refreshes showing the new member.
- **Given** I am a Manager, **When** I remove a member, **Then** they lose access to Team A's tasks.
- **Security:** Check `requireManagerRole` middleware on these endpoints.

**Technical Notes:**
- API: POST `/api/teams/:teamId/members`, DELETE `/api/teams/:teamId/members/:userId`.
- Validation: Ensure user cannot be added twice.
- Covered FRs: FR19, FR20, FR21.

---

## Epic 3: Task Management Core

**Goal:** Enable the core "Fire and Forget" delegation loop with full CRUD capabilities.

### Story 3.1: Task Creation (Manager)
**As a** Manager,
**I want** to create and assign tasks,
**So that** I can delegate work.

**Acceptance Criteria:**
- **Given** I am in Team A context, **When** I create a task with Title, Assignee, Priority, **Then**:
  - Task is saved with `team_id`, `created_by`, `assignee_id`.
  - API returns 201 Created.
- **Validation:** Title required, Assignee must be in Team A.

**Technical Notes:**
- API: POST `/api/teams/:teamId/tasks`.
- Schema: Validation via `src/validators/task.validators.js`.
- Covered FRs: FR5, FR6.

### Story 3.2: My Tasks View & Details (Member)
**As a** Member,
**I want** to see tasks assigned to me,
**So that** I know what to work on.

**Acceptance Criteria:**
- **Given** I am logged in, **When** I view "My Tasks", **Then** I see a list of tasks where `assignee_id = me`.
- **When** I click a task, **Then** I see full details (Description, Due Date, Priority).

**Technical Notes:**
- API: GET `/api/teams/:teamId/tasks?assigneeId=me`.
- Frontend: `useTaskStore` filters tasks by assignee.
- Covered FRs: FR9, FR16.

### Story 3.3: Task Updates & Deletion
**As a** Manager,
**I want** to edit or delete tasks,
**So that** I can correct mistakes or remove stale work.

**Acceptance Criteria:**
- **Given** I am a Manager, **When** I edit a task title/priority, **Then** the change is saved.
- **When** I delete a task, **Then** it is permanently removed (Cascade delete comments).

**Technical Notes:**
- API: PATCH `/api/tasks/:id`, DELETE `/api/tasks/:id`.
- Middleware: `requireManagerRole`.
- Covered FRs: FR7, FR8.

---

## Epic 4: Workflow & Real-Time Collaboration

**Goal:** Close the accountability loop with status updates, blocker reporting, and instant notifications.

### Story 4.1: Status Transitions & Blocker Validation
**As a** Member,
**I want** to update task status,
**So that** I can communicate progress.

**Acceptance Criteria:**
- **Given** a task is "In Progress", **When** I select "Blocked", **Then** the UI mandates a comment.
- **Given** I select "Done", **Then** status updates immediately.
- **API:** PATCH `/api/tasks/:id/status` validates transitions.

**Technical Notes:**
- Validation: If `status === 'blocked'`, body must include `comment`.
- Covered FRs: FR10.

### Story 4.2: Comments System
**As a** User,
**I want** to comment on tasks,
**So that** I can explain blockers or provide context.

**Acceptance Criteria:**
- **Given** a task, **When** I post a comment, **Then** it appears in the list with my name and timestamp.
- **Backend:** Store in `comment` table with `task_id`.

**Technical Notes:**
- API: POST `/api/tasks/:taskId/comments`, GET `/api/tasks/:taskId/comments`.
- Covered FRs: FR11, FR12.

### Story 4.3: Real-Time Notifications (Socket.io)
**As a** User,
**I want** to see updates instantly without refreshing,
**So that** I can react quickly.

**Acceptance Criteria:**
- **Given** Manager assigns me a task, **When** I am online, **Then** I see a "New Task" toast immediately.
- **Given** Member marks task "Blocked", **When** Manager is online, **Then** they see a "Task Blocked" alert.
- **Technical:** Implement `task:assigned`, `task:status_changed` events via Socket.io.

**Technical Notes:**
- Backend: Integrate `socket.io`. Join room `team:{teamId}` on connect.
- Frontend: `useUIStore` listens for events and triggers toasts.
- Ref: Architecture Decision 4 "Real-Time Communication".
- Covered FRs: FR22, FR23, FR24, FR25.

---

## Epic 5: Smart Dashboards

**Goal:** Provide high-level visibility for Managers to track team throughput.

### Story 5.1: Manager Dashboard & Filtering
**As a** Manager,
**I want** to view and filter all team tasks,
**So that** I can manage workload.

**Acceptance Criteria:**
- **Given** I am a Manager, **When** I view Dashboard, **Then** I see all tasks for my team.
- **When** I filter by "Blocked", **Then** only blocked tasks show.
- **When** I filter by "User: Dave", **Then** only Dave's tasks show.

**Technical Notes:**
- API: GET `/api/teams/:teamId/tasks` supports query params `?status=blocked&assigneeId=xyz`.
- DB: Ensure composite index `(team_id, status)` is used.
- Covered FRs: FR13, FR14, FR15, FR17.

---

## FR Coverage Matrix

| FR ID | Epic.Story | Done? |
| :--- | :--- | :--- |
| FR1-FR4 | Epic 1.2 | [ ] |
| FR5-FR6 | Epic 3.1 | [ ] |
| FR7-FR8 | Epic 3.3 | [ ] |
| FR9 | Epic 3.2 | [ ] |
| FR10 | Epic 4.1 | [ ] |
| FR11-FR12 | Epic 4.2 | [ ] |
| FR13-FR15 | Epic 5.1 | [ ] |
| FR16-FR17 | Epic 5.1, 3.2 | [ ] |
| FR18-FR21 | Epic 2.1, 2.2 | [ ] |
| FR22-FR25 | Epic 4.3 | [ ] |

**Analysis:** 100% of FRs are covered by actionable User Stories.
