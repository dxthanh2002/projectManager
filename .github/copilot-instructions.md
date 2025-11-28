# Copilot Instructions for ManagerCheck

## Architecture Overview

**ManagerCheck** is a full-stack **Todo/Task Manager** application with a monorepo structure:

- **Backend**: Express.js + Better-Auth + Drizzle ORM + MySQL
- **Frontend**: Vue 3 + TypeScript + Vite + Tailwind CSS

### Data Flow

1. Frontend (Vue components) → REST API calls to Express backend
2. Backend validates sessions via Better-Auth, queries MySQL via Drizzle ORM
3. Authentication state managed via Better-Auth cookies (sameSite="none", secure, httpOnly)

## Key Technologies & Patterns

### Backend (`/backend`)

**Stack**: Node.js/Express, Better-Auth, Drizzle ORM, MySQL 2/Promise

- **Authentication**: Better-Auth handles session management with email/password auth

  - Schema: `user`, `session`, `account`, `verification` tables (see `src/schema/auth.ts`)
  - All auth endpoints mounted at `/api/auth/*` via `toNodeHandler(auth)`
  - Session retrieval: `auth.api.getSession()` with `fromNodeHeaders(req.headers)`

- **Database**:

  - MySQL connection via `mysql2/promise` pool
  - Drizzle ORM provides type-safe queries
  - Schema defined in `src/schema/` (auth.ts, todo.ts)
  - Migrations in `src/migrations/` (use `drizzle-kit` for schema changes)
  - Config: `drizzle.config.ts` (strict mode enabled)

- **Entry Point**: `src/server.js`
  - CORS configured for cookies (`credentials: true`)
  - Middleware: `express.json()`, Better-Auth handler
  - Key routes: `GET /` (health check), `GET /api/me` (session check)

**Dev Workflow**:

- `pnpm dev` → Runs with nodemon (auto-restart on changes)
- Database credential format: MySQL pool at `127.0.0.1:3306` (see `src/lib/db.js`)
- Environment: Load via `dotenv` (config file hardcoded, not `.env` path)

### Frontend (`/frontend`)

**Stack**: Vue 3 + TypeScript, Vite, Tailwind CSS + Flowbite + Reka UI

- **Architecture**:

  - Entry: `src/main.ts` → `App.vue` (layout wrapper with Navbar/Footer)
  - Routes: `src/router/index.ts` (lazy-loaded pages)
  - Component structure: Reusable UI in `src/components/ui/` (button, card, field, input, label, separator)
  - Pages: `src/views/` (Main, About, Detail, NotFound, Auth/SignInPage)

- **Styling**:

  - Tailwind CSS with `@tailwindcss/vite` plugin
  - No scoped styles recommended (uses global Tailwind utilities)
  - Custom components use class-variance-authority for variants

- **Build & Preview**:
  - `pnpm dev` → Vite dev server
  - `pnpm build` → TypeScript check + Vite production build
  - `pnpm preview` → Preview built output

**Path Aliases**:

- `@/*` → `src/*` (configured in `vite.config.ts` and `tsconfig.json`)

## Conventions & Patterns

1. **File Naming**: PascalCase for Vue components (`.vue`), camelCase for utilities, kebab-case for CSS classes
2. **Schema Definition**: Drizzle tables defined once in `schema/`, relations defined separately (see `userRelations`, `sessionRelations`)
3. **Lazy Component Loading**: Router uses dynamic imports (`() => import()`) for code splitting
4. **Auth Flow**: Better-Auth manages cookies automatically; frontend reads session via `GET /api/me` with credentials
5. **Error Handling**: NotFound.vue shows 404 with fallback to home or history.back()

## Critical Files & Their Roles

| File                           | Purpose                                     |
| ------------------------------ | ------------------------------------------- |
| `backend/src/server.js`        | Express setup, route mounting, CORS config  |
| `backend/src/lib/auth.ts`      | Better-Auth instance with Drizzle adapter   |
| `backend/src/lib/db.js`        | MySQL pool + Drizzle ORM initialization     |
| `backend/src/schema/auth.ts`   | User, session, account, verification tables |
| `backend/drizzle.config.ts`    | ORM migrations config                       |
| `frontend/src/router/index.ts` | Route definitions and lazy imports          |
| `frontend/src/App.vue`         | Root layout (Navbar, RouterView, Footer)    |
| `frontend/src/components/ui/`  | Reusable component library                  |

## Development Workflow

### To run the full stack locally:

**Backend**:

```bash
cd backend
pnpm install
# Ensure MySQL is running at 127.0.0.1:3306 with credentials from src/lib/db.js
pnpm dev  # Starts on port 5001
```

**Frontend** (in parallel):

```bash
cd frontend
pnpm install
pnpm dev  # Starts on http://localhost:5173 (or configured Vite port)
```

### Database Schema Updates:

1. Modify schema in `backend/src/schema/`
2. Run: `npx drizzle-kit generate` (generates migrations)
3. Review `backend/src/migrations/` changes
4. Drizzle ORM auto-applies migrations on query

### Common Issues & Solutions

- **CORS errors**: Check `origin` setting in `server.js` (should match frontend URL)
- **Auth failures**: Verify MySQL connection, session table exists, cookie attributes match (`sameSite="none"`)
- **Database connection**: Hardcoded credentials in `src/lib/db.js` — update to match your MySQL instance
- **Vite build fails**: Run `pnpm build` with TypeScript check via `vue-tsc -b`

## AI Agent Guidance

When implementing features:

- **New API endpoints**: Add routes in `server.js` before `app.listen()`; use `auth.api.getSession()` for protected routes
- **New database tables**: Define in `src/schema/`, use Drizzle relations for type safety
- **Frontend pages**: Create in `src/views/`, add route in `router/index.ts` with lazy import
- **UI components**: Reuse components from `src/components/ui/` before creating new ones
- **Authentication**: Always check session via `/api/me` in frontend; trust Better-Auth for backend validation
