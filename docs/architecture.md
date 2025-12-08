---
stepsCompleted: [1, 2]
inputDocuments:
  - docs/prd.md
  - docs/index.md
  - docs/data-models.md
  - docs/integration-architecture.md
  - docs/analysis/brainstorming-session-2025-12-05.md
workflowType: 'architecture'
lastStep: 2
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

