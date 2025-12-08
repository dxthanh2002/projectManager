  - 'docs/data-models.md'
  - 'docs/development-guide.md'
  - 'docs/integration-architecture.md'
  - 'docs/source-tree-analysis.md'
workflowType: 'prd'
lastStep: 0
project_name: 'managercheck'
user_name: 'ThanhThanhThanh'
date: '2025-12-05'
---

# Product Requirements Document - managercheck

**Author:** ThanhThanhThanh  
**Date:** 2025-12-05

## Executive Summary

ManagerCheck is a focused task management web application designed to streamline the delegation workflow between managers and employees. It bridges the communication gap by allowing managers to assign tasks with clear context and requirements, while providing employees with a dedicated interface to track responsibilities and report status. The system prioritizes **accountability and clarity**, ensuring that work progress and blockers are communicated efficiently without the need for constant micromanagement.

### What Makes This Special

Unlike generic project management tools, ManagerCheck is built specifically around the **Leader-Member delegation loop**:
*   **Context-Rich Assignment:** Empowers leaders to send tasks with all necessary information to ensure "member can know what need to do."
*   **Explicit Status Feedback:** Enforces a closed-loop workflow where members must actively notify status (Done or Problem/Blocked), ensuring nothing gets lost in silence.
*   **Role-Centric Design:** Optimized specifically for the two core roles: the Assigner (Leader) and the Executor (Member).

## User Roles & Team Model

### Role Definitions

ManagerCheck implements a **Self-Service Team Model** where users dynamically assume roles based on their relationship to teams:

#### Member (Default Role)
- **How to Become:** Any user who signs up automatically becomes a Member.
- **Capabilities:**
  - View and manage tasks assigned to them
  - Update task status (Todo → In Progress → Done/Blocked)
  - Add comments to tasks
  - Receive notifications for assigned tasks
- **Limitations:**
  - Cannot create tasks
  - Cannot assign tasks to others
  - Cannot manage teams (unless they create one)

#### Manager (Team Creator Role)
- **How to Become:** A Member becomes a Manager by **creating a team/group**.
- **Capabilities:**
  - All Member capabilities
  - Create, edit, and delete tasks
  - Assign tasks to team members
  - Add/remove members from their team(s)
  - View team dashboard and workload overview
  - Receive blocker notifications from team members
- **Scope:** Manager permissions apply **only to teams they created or manage**.

### Team Model

#### Team Structure
- **Team Creation:** Any Member can create a new team at any time.
- **Team Ownership:** The user who creates a team automatically becomes its Manager.
- **Multi-Role Support:** A user can be:
  - A **Manager** of Team A (teams they created)
  - A **Member** of Team B (teams they were invited to)
  - Roles are **team-scoped**, not global.

#### Team Lifecycle
1. **Creation:** Member clicks "Create Team" → enters team name → becomes Manager of that team.
2. **Growth:** Manager invites Members via email or username.
3. **Collaboration:** Manager assigns tasks; Members execute and report status.

### Permission Matrix

| Action | Member (No Team) | Member (In Team) | Manager (Of Team) |
|--------|------------------|------------------|-------------------|
| Sign up / Login | ✅ | ✅ | ✅ |
| Create Team | ✅ | ✅ | ✅ |
| View "My Tasks" | ✅ | ✅ | ✅ |
| Update own task status | ✅ | ✅ | ✅ |
| Create/Assign tasks | ❌ | ❌ | ✅ (team only) |
| Add/Remove team members | ❌ | ❌ | ✅ (team only) |
| View Team Dashboard | ❌ | ❌ | ✅ (team only) |

## Project Classification

**Technical Type:** web_app
**Domain:** general
**Complexity:** low-medium

The project is a standard web application (Vue 3 SPA + Express REST API + MySQL) operating in the general productivity domain. It leverages an existing codebase to solve a clear business problem. Complexity is managed through established patterns, focusing on refining the user workflow rather than implementing novel technical frameworks.

## Success Criteria

### User Success
*   **Manager Efficiency:** A manager can define and assign a detailed task in **under 2 minutes**.
*   **Member Clarity:** 100% of assigned tasks have clear requirements; zero questions needed about "what do I do?" for standard tasks.
*   **Closed Loop:** 100% of tasks receive a definitive status update (Done or Blocked) without manager follow-up.

### Business Success
*   **Adoption:** 80% daily active usage by the core team.
*   **Responsiveness:** 90% of tasks are acknowledged or updated within 24 hours of assignment.
*   **Throughput:** Increase in completed tasks per week after 1 month of adoption.

### Technical Success
*   **Availability:** 99.9% uptime (critical for daily operations).
*   **Performance:** Dashboard loads in < 500ms to ensure fluid workflow.

## Product Scope

### MVP - Minimum Viable Product
**Focus:** The Core Leader-Member Delegation Loop
*   **Roles:** Manager (Assigner) and Member (Executor).
*   **Dashboard:** Team workload overview for Managers; My Tasks view for Members.
*   **Task Management:** Create, Edit, Delete, Assign.
*   **Task Details:** Title, Rich Description, Priority (Low/Med/High), Due Date.
*   **Status Workflow:** Todo -> In Progress -> Done (or Blocked).
*   **Communication:** Task-level comments and blocker flagging.

### Growth Features (Post-MVP / V2)
*   **Visual Management:** Kanban Board view.
*   **Efficiency:** Task Templates for recurring work.
*   **Enhancements:** Rich media attachments, Activity Logs.

### Vision (Future)
*   **Advanced Intelligence:** AI-driven priority suggestions.
*   **Marketplace:** Pull-based task assignment system.
*   **Ecosystem:** Mobile App, Third-party integrations (Slack/Email).

## User Flows

### Flow 0: Member Creates Team (The "Bootstrap" Flow)
**Goal:** New user creates their first team and unlocks Manager capabilities.
1. **Sign Up:** User registers with email/password → automatically becomes a **Member**.
2. **Landing:** After login, user sees a welcome screen: "You don't have any teams yet. Create one to get started!"
3. **Create Team:** User clicks **"Create Team"** button.
4. **Team Details:** Modal appears. User enters:
    - **Team Name:** "Engineering Team" (Required)
    - **Description:** "Frontend and Backend developers" (Optional)
5. **Submission:** User clicks **"Create Team"**.
6. **Role Upgrade:** System automatically grants **Manager** role for this team.
7. **Feedback:** Modal closes. User sees:
    - Toast: "Team 'Engineering Team' created! You can now assign tasks."
    - Dashboard switches to **Manager Dashboard** view for this team.
8. **Next Steps:** User can now:
    - Add team members (Flow continues to FR18)
    - Create and assign tasks (Flow 1)

### Flow 1: Manager Assigns a Task (The "Fire and Forget" Loop)
**Goal:** Manager assigns work quickly so they can return to their own tasks.
1.  **Dashboard Access:** Manager logs in and lands on the **Manager Dashboard**.
2.  **Initiate:** Manager clicks the floating "New Task" button (+).
3.  **Task Details:** A modal appears. Manager enters:
    *   **Title:** "Fix Login API Bug" (Required)
    *   **Assignee:** Selects "Dave" from dropdown (Required)
    *   **Priority:** Selects "High" (Default: Medium)
    *   **Due Date:** Selects "Tomorrow" (Optional)
    *   **Description:** "Customer unable to login, check sentry logs." (Optional but recommended)
4.  **Submission:** Manager clicks "Assign Task".
5.  **Feedback:** Modal closes, a "Task Assigned" toast appears, and the new task is immediately visible in the Dashboard list.
6.  **System Action:** Database stores task; Notification sent to Dave via WebSocket.

### Flow 2: Member Updates Status (The Accountability Loop)
**Goal:** Member communicates progress or issues without scheduling a meeting.
1.  **Notification:** Dave receives a real-time notification: "Sarah assigned you: Fix Login API Bug".
2.  **My Tasks:** Dave clicks the notification or navigates to "My Tasks".
3.  **View Context:** Dave expands the task card to read the description ("check sentry logs").
4.  **Start Work:** Dave changes Status dropdown from **Todo** -> **In Progress**.
    *   *System:* Updates status for Sarah's dashboard instantly.
5.  **Encounter Blocker:** Dave realizes he needs access.
6.  **Report Blocker:** Dave changes Status to **Blocked**.
    *   *Validation:* System **requires** a comment. Modal prompts: "Reason for blocker?"
    *   *Input:* Dave types: "Need prod log access." and submits.
7.  **Notification:** Sarah gets an alert: "BLOCKER reported by Dave on 'Fix Login API Bug'".

### Flow 3: Resolving & Completing
**Goal:** Unblock work and close the loop.
1.  **Resolution:** Sarah sees the Blocker alert. She clicks it to open the task.
2.  **Comment:** She grants access and replies in comments: "Access granted. Try now."
3.  **Resume:** Dave sees the comment notification. He verifies access.
4.  **Unblock:** Dave changes Status from **Blocked** -> **In Progress**.
5.  **Finish:** After fixing the bug, Dave changes Status to **Done**.
6.  **Clean Up:** Task moves to "Completed" tab/filter; Sarah sees "Done" status on her board.

## Task Lifecycle & Rules

To ensure clarity, the system strictly enforces the following state transitions:

### Status Definitions
*   **Todo:** Task created, assigned, but not yet started. (Default state)
*   **In Progress:** Assignee is actively working on the task.
*   **Blocked:** Assignee cannot proceed due to external factors. **Requires Comment.**
*   **Done:** Task is complete.

### Valid Transitions
| From Status | To Status | Trigger/Rule |
| :--- | :--- | :--- |
| **Todo** | In Progress | Assignee starts work users. |
| **In Progress** | Blocked | **Rule:** Must enter a blocker reason comment. |
| **In Progress** | Done | Work completed. |
| **Blocked** | In Progress | Blocker resolved (by Assignee or Manager). |
| **blocked** | Done | (Rare) Resolved and finished simultaneously. |
| **Done** | In Progress | (Re-open) Implementation failed verification. |

## Notification Workflow
Notifications are the glue of the async workflow.

*   **Trigger Events:**
    *   Task Assigned (To Assignee)
    *   Status Changed to **Blocked** (To Manager)
    *   Status Changed to **Done** (To Manager)
    *   New Comment (To All Participants)
*   **Interaction:**
    *   **Toast:** Ephemeral popup (5s) for immediate awareness while online.
    *   **Badge:** Red dot on "Notifications" bell icon in navbar.
    *   **List:** Clicking bell shows history (unread top). Clicking an item navigates to the specific task.

## Web App Specific Requirements

### Project-Type Overview
ManagerCheck is a **Single Page Application (SPA)** built with Vue 3, communicating with an Express REST API. As a modern internal tool, it prioritizes interactivity and responsiveness over broad legacy support.

### Technical Architecture Considerations

**Browser Support Matrix**
*   **Target:** Modern Browsers Only (Last 2 major versions).
*   **Browsers:** Chrome, Edge, Firefox, Safari.
*   **Legacy:** No IE11 support required.

**Responsive Design Strategy**
*   **Approach:** Mobile-First Responsive Web Design.
*   **Breakpoints:** Mobile (Phone), Tablet, Desktop.
*   **Requirement:** Functional on mobile browsers for Managers to assign tasks on-the-go; no native app required for MVP.

**Performance Targets**
*   Initial Load: < 1.5s (First Contentful Paint).
*   Interaction: < 100ms response for local actions.
*   Real-Time: < 500ms latency for updates (Assignments/Blockers).

### Implementation Considerations

**Real-Time Architecture**
*   **Requirement:** Instant updates for assignments and blocker notifications.
*   **Technology:** WebSockets (Socket.io or similar) to push state changes to connected clients.
*   **Fallback:** Graceful degradation to polling if connection fails.

**SEO & Accessibility**
*   **SEO:** No public indexing required (Auth walled).
*   **Accessibility:** WCAG 2.1 AA target (Standard keyboard navigation and screen reader support).

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-Solving MVP
**Philosophy:** Solve the core delegation problem with minimum features that validate the Leader-Member loop.
**Resource Requirements:** 1-2 Developers (Small scope, well-defined features).

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
1. Member Onboarding (Sign Up → Create Team → Become Manager)
2. Manager Delegation (Fire and Forget)
3. Member Execution (Blocked Workflow)
4. Team Growth (Add Members)

**Must-Have Capabilities:**
| Feature | Justification |
|---------|---------------|
| Manager Dashboard | View team workload overview |
| My Tasks View | Member sees assigned tasks |
| Task CRUD | Create, Edit, Delete, Assign |
| Status Workflow | Todo -> In Progress -> Done / Blocked |
| Comments | Communication for blockers/context |
| User Management | Managers add team members |
| Real-Time Notifications | Immediate assignment/blocker alerts |

### Post-MVP Features

**Phase 2 (Growth):**
*   Kanban Board View (Visual task management)
*   Task Templates (Recurring work efficiency)
*   Activity Logs (Audit trail)

**Phase 3 (Expansion):**
*   AI Priority Suggestions (Smart prioritization)
*   Task Marketplace (Pull-based assignment)
*   Mobile App / Third-party Integrations

### Risk Mitigation Strategy

**Technical Risks:** WebSocket complexity mitigated by using Socket.io library with polling fallback.
**Market Risks:** Validated by focusing on core delegation loop first; gather feedback before V2 features.
**Resource Risks:** Small team can deliver MVP in ~4-6 weeks with focused scope.

## Functional Requirements

### 1. User Authentication & Access
- **FR1:** Users can sign up with email and password.
- **FR2:** Users can log in to access the system.
- **FR3:** Users can log out of the system.
- **FR4:** System persists user session across browser refreshes.

### 2. Task Management
- **FR5:** Managers can create a new task with title, description, priority, and due date.
- **FR6:** Managers can assign a task to a team member.
- **FR7:** Managers can edit an existing task's details.
- **FR8:** Managers can delete a task.
- **FR9:** Members can view the full details of a task assigned to them.
- **FR10:** Members can change the status of their assigned task (Todo, In Progress, Done, Blocked).
- **FR11:** Users can add comments to a task.
- **FR12:** Users can view all comments on a task.

### 3. Dashboards & Views
- **FR13:** Managers can view a dashboard showing all tasks assigned to their team.
- **FR14:** Managers can filter tasks by status (Todo, In Progress, Done, Blocked).
- **FR15:** Managers can filter tasks by assigned member.
- **FR16:** Members can view a "My Tasks" list showing only tasks assigned to them.
- **FR17:** Members can filter their tasks by status.

### 4. Team Management
- **FR18:** Any Member can create a new team by providing a team name and optional description.
- **FR18a:** User who creates a team automatically becomes the Manager of that team.
- **FR19:** Managers can add a new team member to their team by email or username.
- **FR20:** Managers can view a list of all members in their team(s).
- **FR21:** Managers can remove a team member from their team(s).

### 5. Real-Time Notifications
- **FR22:** Members receive real-time notification when a new task is assigned to them.
- **FR23:** Managers receive real-time notification when a task status changes to Blocked.
- **FR24:** Managers receive real-time notification when a task status changes to Done.
- **FR25:** Users receive real-time notification when a comment is added to a task they are involved with.

## Non-Functional Requirements

### Performance
*   **NFR1:** Dashboard and task list pages load within 1.5 seconds (First Contentful Paint).
*   **NFR2:** User actions (create task, change status) respond within 200ms.
*   **NFR3:** Real-time notifications delivered within 500ms of the triggering event.
*   **NFR4:** System supports 50 concurrent users without performance degradation.

### Security
*   **NFR5:** All data transmitted over HTTPS (TLS 1.2+).
*   **NFR6:** User passwords stored using secure hashing (bcrypt or Argon2).
*   **NFR7:** Session tokens expire after 24 hours of inactivity.
*   **NFR8:** Users can only access tasks within their assigned team (Role-Based Access).

### Scalability
*   **NFR9:** System architecture supports scaling to 500 users with minimal changes.
*   **NFR10:** Database schema designed for multi-team expansion.

### Accessibility
*   **NFR11:** Application meets WCAG 2.1 Level AA standards.
*   **NFR12:** All interactive elements are keyboard accessible.

### Reliability
*   **NFR13:** Target 99.5% uptime (allows ~3.5 hours downtime/month).
*   **NFR14:** Graceful degradation to polling if WebSocket connection fails.

