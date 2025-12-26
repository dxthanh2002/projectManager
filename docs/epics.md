# managercheck - Epic Breakdown

**Author:** ThanhThanhThanh
**Date:** 2025-12-25
**Project Level:** MVP
**Target Scale:** Small Team (Self-Service)

---

## Overview

This document provides the complete epic and story breakdown for **managercheck**, decomposing the requirements from the [PRD](./prd.md) into implementable stories. It integrates technical decisions from [Architecture](./architecture.md) and [Mobile Architecture](./architecture-mobile.md) to ensure stories are ready for implementation.

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
| **MFR1** | Mobile | Users can log in and persist session securely on mobile. |
| **MFR2** | Mobile | Managers can view and filter team tasks in a scrollable list. |
| **MFR3** | Mobile | Members can view their assigned tasks in a dedicated list. |
| **MFR4** | Mobile | Users can update task status with blocker validation on mobile. |
| **MFR5** | Mobile | Users can view and add task comments in a real-time mobile interface. |
| **MFR6** | Mobile | Managers can manage team members (invite/remove) on mobile. |
| **MFR7** | Mobile | Users receive in-app real-time notifications for task assignments and status changes. |
| **FR26** | UX | Users can filter tasks by priority level (Low, Medium, High). |
| **FR27** | UX | Multiple filters can be combined (e.g., Status: Blocked + Priority: High). |
| **FR28** | UX | Comment add/edit/delete actions reflect immediately in UI (optimistic). |
| **FR29** | UX | On server error, UI rolls back to previous state with error toast. |
| **FR30** | UX | Dashboard shows welcoming empty state with CTA when no teams. |
| **FR31** | UX | Task list shows empty state with "Create Task" CTA when no tasks. |
| **FR32** | UX | Member list shows empty state with "Invite Member" CTA. |
| **FR33** | UX | All data-fetching operations display loading indicator. |
| **FR34** | UX | Buttons disabled with spinner during async operations. |
| **FR35** | UX | Pull-to-refresh available on mobile list screens. |
| **FR36** | UX | User-friendly toast notifications for all error types. |
| **FR37** | UX | Specific error messages for common failures. |

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

### Story 1.2: User Signup & Login (Better-Auth Integration)
**As a** Guest,
**I want** to sign up and log in,
**So that** I can access the system and maintain my session.

**Acceptance Criteria:**
- **Given** I am on the Signup page, **When** I submit valid email/password, **Then** a new user is created via `better-auth`.
- **Given** I am logged in, **When** I refresh the page, **Then** my session persists (cookies).
- **Given** I am logged in, **When** I click Logout, **Then** my session is destroyed and I am redirected to Login.

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
- **And** the backend validates `name` is required (Zod).

### Story 2.2: Member Invitation & Management
**As a** Manager,
**I want** to add and remove members,
**So that** I can build my team.

---

## Epic 3: Task Management Core

**Goal:** Enable the core "Fire and Forget" delegation loop with full CRUD capabilities.

### Story 3.1: Task Creation (Manager)
**As a** Manager,
**I want** to create and assign tasks,
**So that** I can delegate work.

### Story 3.2: My Tasks View & Details (Member)
**As a** Member,
**I want** to see tasks assigned to me,
**So that** I know what to work on.

### Story 3.3: Task Updates & Deletion
**As a** Manager,
**I want** to edit or delete tasks,
**So that** I can correct mistakes or remove stale work.

---

## Epic 4: Workflow & Real-Time Collaboration

**Goal:** Close the accountability loop with status updates, blocker reporting, and instant notifications.

### Story 4.1: Status Transitions & Blocker Validation
**As a** Member,
**I want** to update task status,
**So that** I can communicate progress.

### Story 4.2: Comments System
**As a** User,
**I want** to comment on tasks,
**So that** I can explain blockers or provide context.

### Story 4.3: Real-Time Notifications (Socket.io)
**As a** User,
**I want** to see updates instantly without refreshing,
**So that** I can react quickly.

---

## Epic 5: Smart Dashboards

**Goal:** Provide high-level visibility for Managers to track team throughput.

### Story 5.1: Manager Dashboard & Filtering
**As a** Manager,
**I want** to view and filter all team tasks,
**So that** I can manage workload.

---

## Epic 6: Mobile Client Foundation & Auth

**Goal:** Establish the React Native/Expo foundation and implement secure cross-platform authentication.
**User Value:** Users can access the platform securely via a dedicated mobile app on Android and iOS.

### Story 6.1: Mobile Project Initialization (Done)
*   **User Story:** As a Developer, I want to initialize the Expo 54 project with the New Architecture, So that I can leverage modern mobile performance.
*   **Acceptance Criteria:**
    *   Expo 54 project created with `newArchEnabled: true`.
    *   `expo-router v6` configured for file-based navigation.
    *   Metro config updated for `better-auth` package exports.

### Story 6.2: Secure Mobile Authentication (Done)
*   **User Story:** As a User, I want to log in and sign up securely on mobile, So that I can access my teams and tasks.
*   **Acceptance Criteria:**
    *   Login/Signup screens implemented in `(auth)` group.
    *   `better-auth/expo` integrated with `expo-secure-store`.
    *   Auth guard implemented in `_layout.tsx` using `<Redirect>`.
    *   Sessions persist across app restarts.

### Story 6.3: API & State Infrastructure (Done)
*   **User Story:** As a User, I want the app to handle data fetching and state consistently, So that the app feels responsive and reliable.
*   **Acceptance Criteria:**
    *   `TanStack Query` provider configured with default retry/stale logic.
    *   `apiFetch` wrapper handles 401 Unauthorized globally by calling `signOut()`.
    *   `useAppStore` (Zustand) manages `currentTeamId` and UI preferences with persistence.

---

## Epic 7: Mobile Dashboard & Team Awareness

**Goal:** Provide visibility into workload and enable multi-team context switching on mobile.
**User Value:** Users can see what needs doing and switch between different team responsibilities.

### Story 7.1: Team Switching (Drawer Navigation)
*   **User Story:** As a User, I want to switch between my teams via a drawer menu, So that I can manage different projects on-the-go.
*   **Acceptance Criteria:**
    *   Left-side Drawer implementation showing a list of all user's teams.
    *   Tapping a team updates `currentTeamId` in Zustand and refreshes the Dashboard.
    *   Current team title displayed in the app header.

### Story 7.2: Task Dashboard (Manager/Member)
*   **User Story:** As a User, I want to see a filtered list of tasks for the current team, So that I can track progress or my responsibilities.
*   **Acceptance Criteria:**
    *   Managers see all team tasks.
    *   Members see only their assigned tasks.
    *   Supports status filtering (Todo, In Progress, Done, Blocked) via segmented control or tabs.
    *   Pull-to-refresh implemented for manual sync.

---

## Epic 8: Mobile Task Execution & Communication

**Goal:** Enable real-time accountability and status reporting for members.
**User Value:** Members can report progress or blockers instantly from their phones.

### Story 8.1: Task Detail & Status Transitions
*   **User Story:** As a Member, I want to view task details and update status, So that I can communicate my progress.
*   **Acceptance Criteria:**
    *   Task detail screen shows rich description, priority, and deadline.
    *   Status picker (Action Sheet style) for state transitions.
    *   If "Blocked" is selected, a comment modal is enforced.

### Story 8.2: Real-Time Mobile Comments
*   **User Story:** As a User, I want to view and add comments in real-time, So that I can resolve blockers or provide context.
*   **Acceptance Criteria:**
    *   Comment feed implemented in the task detail view.
    *   `Socket.io` integration for instant comment delivery.
    *   Keyboard-aware input for smooth mobile typing.

### Story 8.3: In-App Notifications
*   **User Story:** As a User, I want to receive alerts for important events, So that I don't miss task assignments or resolved blockers.
*   **Acceptance Criteria:**
    *   `react-native-toast-message` integration for in-app toasts.
    *   Notification list screen showing history of recent alerts.
    *   Tapping a notification navigates directly to the task.

---

## Epic 9: Mobile Management & Invites (Optional/V2)

**Goal:** Enable managers to perform administrative duties on mobile.
**User Value:** Managers can add team members or create tasks without needing a computer.

### Story 9.1: Mobile Task Creation
*   **User Story:** As a Manager, I want to create tasks on mobile, So that I can delegate work immediately when it arises.
*   **Acceptance Criteria:**
    *   Floating Action Button (FAB) on Dashboard opens "New Task" modal.
    *   Selection of assignee from team member list.
    *   `React Hook Form` + `Zod` validation for the task form.

### Story 9.2: Mobile Member Management
*   **User Story:** As a Manager, I want to invite or remove team members on mobile, So that I can manage my team composition.
*   **Acceptance Criteria:**
    *   "Team Members" screen showing list with avatars.
    *   Invite by email/username functionality.
    *   Swipe-to-remove member (Soft Delete) with confirmation.

---

## FR Coverage Matrix (Updated)

| FR ID | Description | Web Epic.Story | Mobile Epic.Story | Done? |
| :--- | :--- | :--- | :--- | :--- |
| **FR1-4** | Auth / Account Persistence | Epic 1.2 | Epic 6.2 | [x] |
| **FR5-8** | Task CRUD (Manager) | Epic 3.1, 3.3 | Epic 9.1 | [ ] |
| **FR9** | Task Details (Member) | Epic 3.2 | Epic 8.1 | [ ] |
| **FR10** | Status Transitions | Epic 4.1 | Epic 8.1 | [ ] |
| **FR11-12** | Comments System | Epic 4.2 | Epic 8.2 | [ ] |
| **FR13-17** | Dashboard & Filtering | Epic 5.1 | Epic 7.2 | [ ] |
| **FR18-21** | Team Management | Epic 2.1, 2.2 | Epic 9.2 | [ ] |
| **FR22-25** | Real-Time Notifications | Epic 4.3 | Epic 8.3 | [ ] |
| **MFR1** | Secure Mobile Auth | N/A | Epic 6.2 | [x] |
| **MFR2-3** | Mobile Dashboard | N/A | Epic 7.2 | [/] |
| **MFR4** | Mobile Status Update | N/A | Epic 8.1 | [ ] |
| **MFR5** | Mobile Comments | N/A | Epic 8.2 | [ ] |
| **MFR6** | Mobile Member Mgmt | N/A | Epic 9.2 | [ ] |
| **MFR7** | Mobile In-App Toast | N/A | Epic 8.3 | [ ] |
| **FR26-27** | Priority Filtering + Combined | Epic 5.1 | Epic 7.2 | [ ] |
| **FR28-29** | Optimistic UI + Rollback | Epic 4.2 | Epic 8.2 | [ ] |
| **FR30-32** | Empty States (Dashboard, Task, Member) | Epic 5.1, 2.2 | Epic 7.1, 7.2, 9.2 | [ ] |
| **FR33-35** | Loading States + Pull-to-refresh | Cross-cutting | Cross-cutting | [ ] |
| **FR36-37** | Error Handling + Toast | Epic 1.1 | Epic 6.1 | [ ] |

**Analysis:** 100% of functional requirements (FR1-FR37 + MFR1-MFR7 = 44 total) are now covered by actionable User Stories across both platforms.

**UX Requirements Note:** FR26-FR37 are cross-cutting UX requirements that apply as acceptance criteria to multiple stories. Implementation should be done as part of normal story development.

