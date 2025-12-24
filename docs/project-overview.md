# Project Overview - ManagerCheck

**Generated:** 2025-12-24
**Project:** Task Management Application
**Type:** Multi-part Application (Backend + Frontend)

---

## Executive Summary

ManagerCheck is a **team-based task management application** that enables teams to collaborate on tasks with role-based permissions. Managers can create teams, invite members, assign tasks, and track progress in real-time through WebSocket notifications.

### Key Capabilities
- 🔐 **Authentication** - Session-based auth with better-auth
- 👥 **Team Management** - Create teams, invite/manage members
- ✅ **Task Tracking** - Full task lifecycle with status, priority, due dates
- 💬 **Comments** - Task discussions and collaboration
- ⚡ **Real-time Updates** - Socket.io for instant notifications

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                     FRONTEND                                  │
│   Vue 3 SPA + TypeScript + Vite + TailwindCSS 4              │
│   ├── 10 Routes (lazy-loaded)                                 │
│   ├── 5 Pinia Stores (auth, team, task, comment, notification)│
│   └── 114 Components (9 app + 102 shadcn-vue UI)             │
└──────────────────────┬───────────────────────────────────────┘
                       │ REST API (HTTP/JSON) + WebSocket
┌──────────────────────▼───────────────────────────────────────┐
│                     BACKEND                                   │
│   Express 5 + Node.js + Drizzle ORM + Socket.io              │
│   ├── 4 Route Modules (15+ endpoints)                        │
│   ├── 3 Middleware (auth, validation, error)                 │
│   └── better-auth integration                                 │
└──────────────────────┬───────────────────────────────────────┘
                       │ SQL Queries (Drizzle ORM)
┌──────────────────────▼───────────────────────────────────────┐
│                     DATABASE                                  │
│   MySQL with 5 main tables                                    │
│   user, team, user_team, task, comment                       │
└──────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Backend
| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Runtime | Node.js | LTS | JavaScript runtime |
| Framework | Express | 5.1.0 | HTTP server |
| ORM | Drizzle ORM | 0.44.7 | Type-safe SQL queries |
| Database | MySQL | 8.x | Relational database |
| Auth | better-auth | 1.3.34 | Session management |
| Real-time | Socket.io | 4.8.1 | WebSocket server |
| Validation | Zod | 4.1.13 | Schema validation |

### Frontend
| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Framework | Vue 3 | 3.5.24 | Reactive UI framework |
| Language | TypeScript | 5.9.3 | Type safety |
| Build | Vite (rolldown) | 7.2.2 | Dev server & bundler |
| Styling | TailwindCSS | 4.1.17 | Utility-first CSS |
| State | Pinia | 3.0.4 | State management |
| Routing | Vue Router | 4.6.3 | Client-side routing |
| Forms | vee-validate + Zod | 4.15.1 | Form validation |
| UI Components | shadcn-vue + Flowbite | Latest | Pre-built components |
| HTTP | Axios | 1.13.2 | API client |
| Real-time | Socket.io-client | 4.8.1 | WebSocket client |

---

## Key Features

### Authentication
- **Sign up / Sign in** with email/password
- **Session-based authentication** via better-auth
- **Protected routes** with Vue Router guards
- **Guest-only pages** (signin, signup, welcome)

### Team Management
- **Create teams** (user becomes manager)
- **Invite members** by email
- **Role-based access**: Manager vs Member
- **Member management** (view, promote, remove)

### Task Management
- **CRUD operations** with team-scoped access
- **Status tracking**: todo → in_progress → done / blocked
- **Priority levels**: low, medium, high
- **Due dates** with date picker
- **Assignee selection** from team members
- **Filtering & search** capabilities

### Comments System
- **Task discussions** with threaded comments
- **Author-only editing**
- **Manager can delete** any comment

### Real-time Notifications
- **Socket.io integration** for live updates
- **Task assignment** notifications
- **Status change** notifications
- **New comment** alerts
- **Toast notifications** in UI

---

## Project Structure

```
managercheck/
├── backend/               # Express REST API
│   ├── src/
│   │   ├── server.js      # Entry point
│   │   ├── lib/           # Core utilities (auth, db, socket)
│   │   ├── routes/        # API endpoints (4 modules)
│   │   ├── schema/        # Drizzle table definitions
│   │   ├── middleware/    # Auth, validation, error handling
│   │   └── validators/    # Zod schemas
│   └── package.json
│
├── frontend/              # Vue 3 SPA
│   ├── src/
│   │   ├── main.ts        # Entry point
│   │   ├── App.vue        # Root component
│   │   ├── router/        # Vue Router config
│   │   ├── store/         # Pinia stores (5)
│   │   ├── views/         # Page components (11)
│   │   ├── components/    # UI components (114)
│   │   ├── lib/           # Utilities (auth, api, socket)
│   │   └── types/         # TypeScript definitions
│   └── package.json
│
└── docs/                  # Documentation
    ├── index.md           # Master index
    └── *.md               # Generated docs
```

---

## Getting Started

### Prerequisites
- Node.js 20+ (LTS recommended)
- pnpm 10.22.0+
- MySQL 8.x database

### Quick Start

```bash
# 1. Clone and install
git clone <repository-url>
cd managercheck

# 2. Backend setup
cd backend
pnpm install
cp .env.example .env  # Configure database
pnpm drizzle-kit migrate
pnpm dev

# 3. Frontend setup (new terminal)
cd frontend
pnpm install
pnpm dev
```

### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **Health check**: GET http://localhost:5001/

---

## API Overview

| Module | Endpoints | Auth | Description |
|--------|-----------|------|-------------|
| Auth | `/api/auth/*` | - | better-auth routes |
| Teams | 5 endpoints | ✅ | CRUD + list |
| Members | 4 endpoints | ✅ | Invite, list, role, remove |
| Tasks | 6 endpoints | ✅ | CRUD + status |
| Comments | 4 endpoints | ✅ | CRUD |

### Socket Events
- `task:assigned` - New task assignment
- `task:status_changed` - Status update
- `comment:added` - New comment

---

## Current State (as of 2025-12-24)

### ✅ Implemented
- Full authentication flow (better-auth)
- Team CRUD with member management
- Task CRUD with filtering
- Comments system
- Real-time notifications (Socket.io)
- Dashboard with stats
- Responsive UI with TailwindCSS 4

### 📊 Codebase Stats
- **Backend**: ~1,100 lines across 4 route modules
- **Frontend**: 114 components, 5 stores
- **Database**: 5 tables with proper relations
- **Sprint Artifacts**: 10+ implementation specs completed

---

**Last Updated:** 2025-12-24
**Documentation Version:** 2.0.0
**Generated by:** BMAD document-project (Deep Scan - Full Rescan)
