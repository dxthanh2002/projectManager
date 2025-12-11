---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - docs/prd.md
  - docs/index.md
  - docs/data-models.md
  - docs/integration-architecture.md
  - docs/analysis/brainstorming-session-2025-12-05.md
workflowType: 'architecture'
lastStep: 5
project_name: 'managercheck'
user_name: 'ThanhThanhThanh'
date: '2025-12-05'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (23 FRs organized into 5 categories):**
- **Authentication (4):** User signup, login, logout, session persistence
- **Task Management (8):** CRUD operations, assignment, status workflow (Todo→In Progress→Done/Blocked), commenting
- **Dashboards (5):** Manager team overview, Member task view, filtering by status/assignee
- **Team Management (3):** Add/view/remove team members
- **Real-Time (3):** Notifications for assignments, blockers, and comments

**Non-Functional Requirements (14 NFRs):**
- **Performance:** Dashboard <1.5s FCP, actions <200ms, real-time <500ms latency, 50 concurrent users
- **Security:** HTTPS (TLS 1.2+), bcrypt passwords, 24h session expiry, role-based access
- **Scalability:** Schema designed for multi-team expansion (500 users)
- **Accessibility:** WCAG 2.1 Level AA compliance
- **Reliability:** 99.5% uptime target, graceful degradation for WebSocket failures

### Scale & Complexity

- **Primary domain:** Full-Stack Web Application (SPA + REST API)
- **Complexity level:** Medium
- **Estimated architectural components:** 8-10 (Auth, Tasks, Users, Teams, Comments, Notifications, Dashboard, Real-time)
- **Real-time requirement:** Yes - WebSocket for instant updates

### Technical Constraints & Dependencies

**Existing Stack (Brownfield - Must Preserve):**
- **Frontend:** Vue 3, TypeScript, Vite, TailwindCSS, Pinia, Vue Router
- **Backend:** Node.js, Express 5, MySQL, Drizzle ORM
- **Authentication:** better-auth (session-based, v1.3.34 backend / v1.4.4 frontend)
- **Validation:** vee-validate + Zod
- **HTTP Client:** axios

**Database Schema (Existing):**
- Tasks table with status enum (todo, in_progress, done, blocked)
- Priority enum (low, medium, high)
- Foreign keys to users (assignee_id, created_by)

**Browser Support:**
- Modern browsers only (last 2 versions of Chrome, Edge, Firefox, Safari)
- No IE11 support required

### Cross-Cutting Concerns Identified

1. **Real-Time Communication** - WebSocket/Socket.io for instant updates across all task changes
2. **Role-Based Access Control** - Manager vs Member permissions affecting all API endpoints and UI views
3. **Session Management** - better-auth integration requiring consistent auth checks
4. **Error Handling Strategy** - Unified error responses and frontend error states
5. **Optimistic UI Updates** - Immediate feedback for status changes with rollback on failure
6. **Notification System** - Cross-feature alerts for assignments, blockers, comments



## Architecture Decision: Self-Service Team Model

**Decision Date:** 2025-12-08  
**Status:** Approved

### Context

The PRD defines a Self-Service Team Model where:
- Any user can create a team and automatically become its manager
- Users can be managers of multiple teams and members of others simultaneously
- All resources (tasks, comments) are team-scoped for access control

### Decision

Implement a **team-scoped multi-tenancy architecture** with the following key components:

#### 1. Database Schema Design

**Core Tables:**
- `team` - Team metadata with creator tracking
- `user_team` - Many-to-many junction table with role field ('manager' | 'member')
- `task` - Updated with `team_id` foreign key for team-scoped access
- `comment` - Task comments with cascade deletes

**Key Design Decisions:**
- Use UUID (VARCHAR 36) for all primary keys for distributed scalability
- Team-scoped foreign keys on all resources (tasks MUST belong to a team)
- Role stored in junction table (not user table) for multi-role support
- Composite indexes on `(team_id, status)` for dashboard queries


## Architecture Decision: Middleware & Validation Strategy

**Decision Date:** 2025-12-09
**Status:** Approved

### Context

The codebase currently has decentralized authentication logic (defined within route files) and needs a robust strategy for input validation and error handling to ensure data integrity and security.

### Decision

Implement a **centralized middleware layer** to handle cross-cutting concerns uniformly across all API endpoints.

#### 1. Standardization of Middleware
Move all inline middleware from route files to dedicated modules in `src/middleware/`:
- **`auth.js`**: Consolidate `requireAuth`, `requireTeamMembership`, `requireManagerRole`.
- **`validate.js`**: Use the existing Zod-based validation factory.
- **`error.js`**: Implement a global error handling middleware to standardize JSON error responses.

#### 2. Validation Pattern
- **Library:** `zod` (v3.x)
- **Implementation:**
  - Create Zod schemas in `src/validators/*.validators.js`.
  - Apply `validate(schema)` middleware to all POST/PATCH/PUT routes.
  - Strict typing: Validation must strip unknown keys (`strict()`).

#### 3. Global Error Handling
Replace ad-hoc `try/catch` blocks in controllers with a centralized error handler that captures:
- Zod validation errors (400)
- Authentication/Authorization errors (401/403)
- Database constraints (409)
- Unexpected runtime errors (500)


## Architecture Decision: Real-Time Communication

**Decision Date:** 2025-12-09
**Status:** Approved

### Context

The PRD requires immediate updates for task assignments and blocker notifications. HTTP polling is insufficient for the targeted user experience (<500ms latency).

### Decision

Integrate **Socket.io (v4.x)** for real-time bidirectional event-based communication.

#### 1. Connection Strategy
- **Transport:** WebSocket with polling fallback.
- **Authentication:** Reuse `better-auth` session cookies. The handshake must validate the session from the `cookie` header before allowing connection.

#### 2. Event Taxonomy
| Event Name | Direction | Payload | Trigger |
| :--- | :--- | :--- | :--- |
| `task:assigned` | Server → Client | `{ taskId, title, assignedBy }` | Manager creates/assigns task |
| `task:status_changed` | Server → Client | `{ taskId, newStatus, userId }` | Member updates status |
| `comment:added` | Server → Client | `{ taskId, commentId, text }` | User adds comment |
| `team:member_added` | Server → Client | `{ teamId, user }` | Manager adds member |

#### 3. Room Strategy (Team Scoping)
- Clients join rooms based on their Team IDs: `team:{teamId}`.
- Events are emitted to specific rooms to ensure data privacy and reduce noise.
- `socket.join('team:' + teamId)` upon successful connection/team selection.


## Architecture Decision: Frontend State Management

**Decision Date:** 2025-12-09
**Status:** Approved

### Context

The frontend handles complex relational data (Teams have Tasks, Tasks have Comments) and needs to sync this state with real-time events.

### Decision

Use **Pinia** with the "Setup Stores" pattern for reactive, modular state management.

#### 1. Store Modules
- **`useAuthStore`**: User session, profile, and global preferences.
- **`useTeamStore`**: List of teams, current active team context, and team members.
- **`useTaskStore`**:
  - Tasks data normalized by ID.
  - Computed properties for "My Tasks" vs "Team Tasks".
  - Actions for CRUD that optimistically update UI before API response.
- **`useUIStore`**: Toast notifications, active modals, and sidebars.

#### 2. Real-Time Integration
- Stores will subscribe to Socket.io events.
- **Action:** On `task:status_changed`, the `useTaskStore` updates the specific task object immediately without refetching the entire list.


## Architecture Decision: API Architectural Style

**Decision Date:** 2025-12-09
**Status:** Approved

### Context

To ensure consistency in communication between the Frontend and Backend, and to simplify integration with external tools or future mobile apps, a unified API style is required.

### Decision

Use **100% REST API** for all client-server communication (excluding real-time event pushes).

#### 1. Protocol Standards
- **Resource-Oriented URLs:** `/api/resources` naming convention (e.g., `/api/teams`, `/api/tasks`).
- **Standard HTTP Methods:**
  - `GET`: Retrieve data
  - `POST`: Create new resources or trigger complex actions
  - `PUT`/`PATCH`: Update resources
  - `DELETE`: Remove resources
- **Stateless:** The server does not maintain client state between requests (session state is handled via cookies/tokens but logic is stateless).

#### 2. Data Format
- **Request Body:** JSON (`application/json`)
- **Response Body:** JSON (`application/json`)

#### 3. Exclusion
- Real-time updates use **Socket.io** (WebSocket) as a complementary channel for push notifications only. All state-changing actions MUST still go through REST APIs.


