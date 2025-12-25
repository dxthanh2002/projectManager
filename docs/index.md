# Project Documentation Index

**Generated:** 2025-12-24  
**Project:** ManagerCheck - Task Management Application  
**Type:** Multi-part Application (Backend + Frontend)

---

## 📋 Project Overview

- **Type:** Multi-part with 3 components (Backend + Frontend + Mobile)
- **Primary Language:** JavaScript/TypeScript
- **Architecture:** RESTful API + Vue 3 SPA + React Native App + WebSocket
- **Package Manager:** pnpm (web), npm (mobile)

---

## 🚀 Quick Reference

### Backend (Express REST API)
| Property | Value |
|----------|-------|
| **Type** | RESTful API Server |
| **Tech Stack** | Node.js, Express 5, MySQL, Drizzle ORM, Socket.io, better-auth |
| **Root** | `backend/` |
| **Port** | 5001 (default) |
| **Entry Point** | `backend/src/server.js` |
| **Routes** | 4 modules, 15+ endpoints |

### Frontend (Vue 3 SPA)
| Property | Value |
|----------|-------|
| **Type** | Single Page Application |
| **Tech Stack** | Vue 3, TypeScript, Vite (rolldown), TailwindCSS 4, Pinia |
| **Root** | `frontend/` |
| **Port** | 5173 (development) |
| **Entry Point** | `frontend/src/main.ts` |
| **Components** | 114 total (9 app + 102 shadcn-vue) |
| **Stores** | 5 Pinia stores |

### Mobile (React Native / Expo)
| Property | Value |
|----------|-------|
| **Type** | Mobile App (iOS + Android) |
| **Tech Stack** | Expo 51, React Native 0.74, expo-router, Formik + Yup |
| **Root** | `mobile/` |
| **Entry Point** | `mobile/src/app/_layout.tsx` |
| **Components** | 32 reusable components |
| **Routes** | 5 route groups (auth, tabs, user, like, product) |

---

## 📚 Generated Documentation

### Core Documentation
| Document | Description |
|----------|-------------|
| **[Project Overview](./project-overview.md)** | Executive summary, tech stack, getting started |
| **[Source Tree Analysis](./source-tree-analysis.md)** | Annotated directory structure |
| **[Integration Architecture](./integration-architecture.md)** | REST + WebSocket communication flow |

### Architecture Documentation
| Document | Description |
|----------|-------------|
| **[Backend Architecture](./architecture-backend.md)** | Express API, middleware, Socket.io, endpoints |
| **[Frontend Architecture](./architecture-frontend.md)** | Vue 3 SPA, Pinia stores, routing, components |
| **[Mobile Architecture](./architecture-mobile.md)** | React Native/Expo, expo-router, components |

### Data & Development
| Document | Description |
|----------|-------------|
| **[Data Models](./data-models.md)** | MySQL schema, Drizzle ORM, relations |
| **[Development Guide](./development-guide.md)** | Setup, commands, workflows |

---

## 🎯 Getting Started

### Prerequisites
- Node.js 20+ (LTS recommended)
- pnpm 10.22.0+
- MySQL 8.x database

### Quick Start

```bash
# Backend
cd backend
pnpm install
pnpm drizzle-kit migrate
pnpm dev

# Frontend (new terminal)
cd frontend
pnpm install
pnpm dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

---

## 🏗️ Architecture at a Glance

```
Frontend (Vue 3 SPA)
    ↓ REST API (HTTP/JSON) + WebSocket (Socket.io)
Backend (Express 5)
    ↓ SQL Queries (Drizzle ORM)
MySQL Database
```

**Authentication:** better-auth (session-based)  
**State Management:** Pinia (5 stores)  
**Real-time:** Socket.io (3 events)  
**ORM:** Drizzle (type-safe queries)  
**Styling:** TailwindCSS 4 + shadcn-vue

---

## 📖 Key Features

- ✅ **User Authentication** - Sign up, sign in, sessions
- ✅ **Team Management** - Create, invite members, roles
- ✅ **Task Management** - CRUD, status, priority, due dates, assignees
- ✅ **Comments System** - Task discussions
- ✅ **Real-time Notifications** - Socket.io integration
- ✅ **Role-based Access** - Manager vs Member permissions

---

## 🔗 API Summary

| Module | Endpoints | Description |
|--------|-----------|-------------|
| Auth | `/api/auth/*` | better-auth managed |
| Teams | 5 | CRUD + list |
| Members | 4 | Invite, manage, roles |
| Tasks | 6 | CRUD + status |
| Comments | 4 | CRUD |

### Socket Events
| Event | Description |
|-------|-------------|
| `task:assigned` | New task assignment |
| `task:status_changed` | Status update |
| `comment:added` | New comment |

---

## 📁 Repository Structure

```
managercheck/
├── backend/           # Express REST API + Socket.io
│   ├── src/
│   │   ├── server.js  # Entry point
│   │   ├── lib/       # Core (auth, db, socket)
│   │   ├── routes/    # 4 route modules
│   │   ├── schema/    # Drizzle schemas
│   │   └── middleware/
│   └── package.json
│
├── frontend/          # Vue 3 SPA
│   ├── src/
│   │   ├── main.ts    # Entry point
│   │   ├── App.vue    # Root component
│   │   ├── router/    # Vue Router
│   │   ├── store/     # 5 Pinia stores
│   │   ├── views/     # 11 page components
│   │   └── components/# 114 components
│   └── package.json
│
└── docs/              # This documentation
    └── index.md       # You are here
```

---

## 🛠️ Development Commands

### Backend
```bash
pnpm dev                 # Start dev server (nodemon)
pnpm start               # Production server
pnpm drizzle-kit studio  # Database GUI
pnpm drizzle-kit migrate # Run migrations
```

### Frontend
```bash
pnpm dev      # Start dev server (Vite HMR)
pnpm build    # Production build
pnpm preview  # Preview build
```

---

## 📊 Current State (2025-12-24)

### Sprint Progress
| Epic | Stories | Status |
|------|---------|--------|
| 1. Foundation | 2 | ✅ Complete |
| 2. Team Management | 2 | ✅ Complete |
| 3. Task Management | 3 | ✅ Complete |
| 4. Comments & Notifications | 2 | ✅ Complete |
| 5. Dashboard & Analytics | In Progress | 🔄 Active |

### Codebase Stats
- **Backend:** ~1,100 lines across 4 route modules
- **Frontend:** 114 components, 5 Pinia stores
- **Database:** 5 tables with relations
- **Sprint Artifacts:** 10+ implementation specs

---

**Last Updated:** 2025-12-24  
**Documentation Version:** 2.0.0  
**Generated by:** BMAD document-project (Deep Scan - Full Rescan)
