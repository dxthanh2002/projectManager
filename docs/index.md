# Project Documentation Index

**Generated:** 2025-12-05  
**Project:** Task Management Application  
**Type:** Multi-part Application (Client-Server)

---

## 📋 Project Overview

- **Type:** Multi-part with 2 parts (Backend + Frontend)
- **Primary Language:** JavaScript/TypeScript
- **Architecture:** RESTful API + Single Page Application
- **Package Manager:** pnpm

---

## 🚀 Quick Reference

### Backend (Express REST API)
- **Type:** RESTful API Server
- **Tech Stack:** Node.js, Express 5, MySQL, Drizzle ORM, better-auth
- **Root:** `backend/`
- **Port:** 5001 (default)
- **Entry Point:** `backend/src/server.js`

### Frontend (Vue 3 SPA)
- **Type:** Single Page Application
- **Tech Stack:** Vue 3, TypeScript, Vite, TailwindCSS, Pinia
- **Root:** `frontend/`
- **Port:** 5173 (development)
- **Entry Point:** `frontend/src/main.ts`

---

## 📚 Generated Documentation

### Core Documentation
- **[Project Overview](./project-overview.md)** - Executive summary, tech stack, getting started
- **[Source Tree Analysis](./source-tree-analysis.md)** - Annotated directory structure with integration points
- **[Integration Architecture](./integration-architecture.md)** - How frontend and backend communicate

### Architecture Documentation
- **[Backend Architecture](./architecture-backend.md)** - Express API, MVC pattern, Drizzle ORM
- **[Frontend Architecture](./architecture-frontend.md)** - Vue 3 SPA, component structure, routing

### Data & Development
- **[Data Models](./data-models.md)** - MySQL schema, tables, relationships
- **[Development Guide](./development-guide.md)** - Setup, commands, workflows, troubleshooting

---

## 🎯 Getting Started

### Prerequisites
- Node.js (latest LTS)
- pnpm 10.22.0+
- MySQL database

### Quick Start

#### 1. Backend Setup
```bash
cd backend
pnpm install
# Configure .env file
pnpm drizzle-kit migrate
pnpm dev
```

#### 2. Frontend Setup
```bash
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
    ↓ REST API (HTTP/JSON)
Backend (Express)
    ↓ SQL Queries
MySQL Database
```

**Authentication:** better-auth (session-based)  
**State Management:** Pinia (frontend)  
**ORM:** Drizzle (backend)  
**Styling:** TailwindCSS + Flowbite

---

## 📖 Key Features

- **User Authentication:** Sign up, sign in, session management
- **Task Management:** Create, update, delete tasks
- **Task Status Tracking:** todo, in_progress, done, blocked
- **Priority Levels:** low, medium, high
- **User Assignment:** Assign tasks to users
- **Responsive UI:** TailwindCSS-based modern interface

---

## 🔗 Integration Points

### Frontend → Backend
- **Protocol:** REST API over HTTP
- **Auth:** `/api/auth/*` (better-auth)
- **Session Check:** `/api/me`
- **CORS:** Configured for localhost development

### Shared Libraries
- **better-auth:** v1.3.34 (backend) + v1.4.4 (frontend)

---

## 📁 Repository Structure

```
managercheck/
├── backend/           # Express REST API
│   ├── src/
│   │   ├── server.js  # Entry point
│   │   ├── lib/       # Core (auth, db)
│   │   ├── schema/    # Database schemas
│   │   └── ...
│   └── package.json
│
├── frontend/          # Vue 3 SPA
│   ├── src/
│   │   ├── main.ts    # Entry point
│   │   ├── App.vue    # Root component
│   │   ├── views/     # 7 page components
│   │   ├── components/# 33+ reusable components
│   │   └── ...
│   └── package.json
│
└── docs/              # This documentation
    └── index.md       # You are here
```

---

## 🛠️ Development Commands

### Backend
```bash
pnpm dev              # Start dev server (nodemon)
pnpm start            # Start production server
pnpm drizzle-kit studio  # Open database GUI
```

### Frontend
```bash
pnpm dev              # Start dev server (Vite HMR)
pnpm build            # Build for production
pnpm preview          # Preview production build
```

---

## 🔍 Documentation Navigation

### For Developers
1. Start with [Development Guide](./development-guide.md) for setup
2. Review [Architecture - Backend](./architecture-backend.md) for API structure
3. Review [Architecture - Frontend](./architecture-frontend.md) for UI structure
4. Check [Data Models](./data-models.md) for database schema

### For Planning/PRD
1. Read [Project Overview](./project-overview.md) for high-level understanding
2. Review [Integration Architecture](./integration-architecture.md) for system design
3. Check [Source Tree Analysis](./source-tree-analysis.md) for codebase layout

---

## 📊 Tech Stack Summary

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Vue 3, TypeScript, Vite, TailwindCSS, Pinia, Vue Router |
| **Backend** | Node.js, Express 5, MySQL, Drizzle ORM |
| **Authentication** | better-auth |
| **Build Tools** | Vite, pnpm |
| **Validation** | vee-validate, Zod |
| **HTTP Client** | axios |
| **UI Components** | Flowbite Vue, lucide-vue-next |

---

## 🎨 Project Highlights

### Backend
- ✅ Express 5 with ESM modules
- ✅ Type-safe queries with Drizzle ORM
- ✅ Integrated authentication (better-auth)
- ✅ MySQL database with migrations
- ✅ CORS configured for frontend

### Frontend
- ✅ Vue 3 Composition API (`<script setup>`)
- ✅ TypeScript for type safety
- ✅ 7 routes with lazy loading
- ✅ 33+ reusable components
- ✅ Form validation (vee-validate + Zod)
- ✅ Modern UI (TailwindCSS + Flowbite)
- ✅ State management (Pinia)

---

## 🚧 Current State

### Implemented
- Backend server setup with Express
- Database connection with Drizzle ORM
- Authentication system (better-auth)
- Frontend SPA with routing
- UI components and layouts
- Form validation infrastructure

### In Progress / To Be Completed
- Task CRUD API endpoints
- Frontend-backend task integration
- Complete Pinia stores
- API service layer
- Testing infrastructure

---

## 📝 Notes

- **Development Mode:** Both backend and frontend run on separate ports
- **Production Deployment:** Frontend builds to static files, backend runs as Node.js server
- **Database:** MySQL required - configure connection in backend `.env`
- **Authentication:** better-auth manages sessions automatically
- **Code Formatting:** Prettier configured for both parts

---

## 🔐 Environment Configuration

### Backend `.env`
```env
PORT=5001
CORS_ORIGIN=http://localhost:5173
DATABASE_URL=mysql://user:password@localhost:3306/dbname
BETTER_AUTH_SECRET=your-secret-key
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5001
```

---

## 📚 Additional Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [better-auth Documentation](https://www.better-auth.com/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Flowbite Vue Components](https://flowbite-vue.com/)

---

**Last Updated:** 2025-12-05  
**Documentation Version:** 1.0.0  
**Generated by:** BMAD document-project workflow (Deep Scan)
