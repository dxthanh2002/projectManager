# Development Guide

**Generated:** 2025-12-05

## Prerequisites

### Required Software
- **Node.js:** Latest LTS version
- **pnpm:** 10.22.0 or higher
- **MySQL:** For database
- **Git:** For version control

### Development Tools (Recommended)
- **IDE:** VS Code (TypeScript support)
- **Extensions:** Vue Language Features (Volar), Prettier, ESLint

## Environment Setup

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure environment variables:**
   Create `.env` file in `backend/` directory:
   ```env
   PORT=5001
   CORS_ORIGIN=http://localhost:5173
   DATABASE_URL=mysql://user:password@localhost:3306/dbname
   BETTER_AUTH_SECRET=your-secret-key-here
   ```

4. **Run database migrations:**
   ```bash
   pnpm drizzle-kit migrate
   ```

5. **Start development server:**
   ```bash
   pnpm dev
   ```
   
   Server will run on http://localhost:5001

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure environment (if needed):**
   Create `.env` file in `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:5001
   ```

4. **Start development server:**
   ```bash
   pnpm dev
   ```
   
   App will run on http://localhost:5173

## Development Commands

### Backend Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start development server with nodemon (auto-reload) |
| `pnpm start` | Start production server |
| `pnpm drizzle-kit migrate` | Run database migrations |
| `pnpm drizzle-kit generate` | Generate new migration |
| `pnpm drizzle-kit studio` | Open Drizzle Studio (DB GUI) |

### Frontend Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start Vite development server (HMR enabled) |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build locally |

## Project Structure Conventions

### Backend Conventions
- **ESM Modules:** Use `import`/`export` syntax (`.js` extension)
- **File Structure:** MVC-like pattern with services layer
- **Database:** Drizzle ORM with SQL-first approach
- **Auth:** better-auth handles all authentication logic

### Frontend Conventions
- **Composition API:** Use `<script setup>` in Vue components
- **TypeScript:** Strongly typed throughout
- **Routing:** Vue Router with lazy-loaded routes
- **State:** Pinia for centralized state management
- **Styling:** TailwindCSS utility classes
- **Components:** Flowbite Vue for UI consistency

## Build Process

### Backend Build
The backend runs directly on Node.js without a build step:
- Uses ESM modules natively
- TypeScript files (`.ts`) are run via `tsx` in dev mode
- No transpilation needed for production

### Frontend Build

1. **Type Checking:**
   ```bash
   vue-tsc -b
   ```

2. **Build:**
   ```bash
   vite build
   ```

3. **Output:** `frontend/dist/` directory

## Testing

### Backend Testing
```bash
# No tests configured yet
pnpm test  # Currently outputs error message
```

### Frontend Testing
- No test framework configured yet
- **Recommended:** Vitest + Vue Test Utils

## Development Workflow

### Starting Both Services

**Option 1:** Two terminals
```bash
# Terminal 1 - Backend
cd backend && pnpm dev

# Terminal 2 - Frontend
cd frontend && pnpm dev
```

**Option 2:** Using a process manager (optional)
```bash
# Install concurrently globally
pnpm add -g concurrently

# Run from project root
concurrently "cd backend && pnpm dev" "cd frontend && pnpm dev"
```

### Hot Reload

- **Backend:** nodemon watches `src/` and auto-restarts on changes
- **Frontend:** Vite HMR updates instantly without full reload

## Common Development Tasks

### Adding a New API Endpoint

1. Define route in `backend/src/routes/`
2. Create controller in `backend/src/controllers/`
3. Add business logic in `backend/src/services/`
4. Test with REST client (Postman, Thunder Client, etc.)

### Adding a New Page

1. Create view in `frontend/src/views/`
2. Add route in `frontend/src/router/index.ts`
3. Create components in `frontend/src/components/` if needed
4. Add navigation links

### Database Schema Changes

1. Modify schema in `backend/src/schema/*.ts`
2. Generate migration:
   ```bash
   cd backend
   pnpm drizzle-kit generate
   ```
3. Review generated SQL in `src/migrations/`
4. Apply migration:
   ```bash
   pnpm drizzle-kit migrate
   ```

### Adding Form Validation

1. Create schema in `frontend/src/schemas/` using Zod
2. Use vee-validate in component with `@vee-validate/zod`
3. Apply validation rules to form fields

## Troubleshooting

### Backend Issues

**Problem:** "Cannot connect to database"
- **Solution:** Check MySQL is running and `.env` has correct credentials

**Problem:** "Port 5001 already in use"
- **Solution:** Change `PORT` in `.env` or stop conflicting process

### Frontend Issues

**Problem:** "API calls fail with CORS error"
- **Solution:** Verify `CORS_ORIGIN` in backend `.env` matches frontend URL

**Problem:** "Module not found errors"
- **Solution:** Run `pnpm install` again, clear `node_modules` if needed

## Code Quality

### Formatting
- **Tool:** Prettier 3.6.2
- **Config:** Default Prettier rules
- **Command:** `pnpm prettier --write .`

### Linting
- No linter configured yet
- **Recommended:** ESLint for both backend and frontend

## Database Management

### View Database
```bash
cd backend
pnpm drizzle-kit studio
```
Opens web UI at http://localhost:4983

### Reset Database
```bash
# Drop all tables
mysql -u user -p dbname < reset.sql

# Re-run migrations
pnpm drizzle-kit migrate
```

## Notes

- **pnpm Workspace:** Not configured as monorepo yet (separate package.json files)
- **Shared Types:** Could be extracted to shared package for type safety across frontend/backend
- **Environment Variables:** Keep `.env` files in `.gitignore` (never commit secrets)
