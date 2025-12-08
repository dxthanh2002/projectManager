# Backend Architecture

**Last Updated:** 2025-12-08  
**Part:** Backend API Server  
**Type:** RESTful API with Team-Scoped Multi-Tenancy

## Executive Summary

The backend is a **Node.js REST API server** built with Express 5, using MySQL as the database with Drizzle ORM for type-safe queries. Authentication is handled by the better-auth library for session management. The architecture implements a **team-scoped multi-tenancy model** where all resources (tasks, comments) belong to teams with role-based access control (manager/member).

## Technology Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Runtime | Node.js | v22.18.0 | JavaScript server runtime |
| Framework | Express | 5.1.0 | Web application framework |
| Database | MySQL | - | Relational database |
| ORM | Drizzle ORM | 0.44.7 | Type-safe database queries |
| Auth | better-auth | 1.3.34 | Authentication & sessions |
| DB Driver | mysql2 | 3.15.3 | MySQL driver |
| Language | JavaScript/TypeScript | ESM | Mixed JS/TS with ES modules |
| TS Runtime | tsx | 4.20.6 | TypeScript execution |

**Development Tools:**
- `nodemon` - Auto-restart on file changes
- `drizzle-kit` - Database migration management
- `tsx` - TypeScript execution without build step
- `prettier` - Code formatting

## Architecture Pattern

**Pattern:** Layered Architecture with Team-Scoped Authorization

```
┌──────────────────────┐
│   HTTP Requests      │
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│   Express Router     │  ← Routes (teams, tasks, comments)
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│  Auth Middleware     │  ← requireAuth, requireTeamMembership, requireManagerRole
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│  Route Handlers      │  ← Request validation & business logic
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│   Drizzle ORM        │  ← Type-safe queries with team filtering
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│   MySQL Database     │  ← Team-scoped data storage
└──────────────────────┘
```

## Directory Structure

```
backend/
├── src/
│   ├── server.js          # Application entry point (Express 5 + tsx)
│   ├── lib/               # Core libraries
│   │   ├── auth.ts        # better-auth configuration
│   │   └── db.js          # Drizzle database connection
│   ├── schema/            # Database schemas (Drizzle)
│   │   ├── auth.ts        # Auth tables (better-auth)
│   │   ├── teams.ts       # Teams table
│   │   ├── user-teams.ts  # User-team junction (with roles)
│   │   ├── tasks.ts       # Tasks table (team-scoped)
│   │   ├── comments.ts    # Comments table
│   │   ├── relations.ts   # Drizzle relations
│   │   └── index.ts       # Schema exports
│   ├── routes/            # API routes ✅ IMPLEMENTED
│   │   ├── teams.js       # Team CRUD + middleware
│   │   ├── team-members.js # Member management
│   │   ├── tasks.js       # Task CRUD (team-scoped)
│   │   └── comments.js    # Comment CRUD
│   ├── migrations/        # Database migrations
│   ├── controllers/       # (Empty - logic in routes)
│   ├── services/          # (Empty - logic in routes)
│   ├── models/            # (Empty - using Drizzle schema)
│   └── utils/             # Utility functions
├── drizzle.config.ts      # Drizzle configuration
└── package.json           # Dependencies
```

## Core Components

### 1. Application Entry Point

**File:** `src/server.js`

**Responsibilities:**
- Initialize Express application
- Configure CORS middleware
- Mount better-auth handler at `/api/auth/*splat` (Express 5 syntax)
- Mount RESTful API routes
- Start HTTP server on port 5001

**Key Configuration:**
```javascript
// CORS - allows frontend to communicate
cors({
  origin: process.env.CORS_ORIGIN || "",
  methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  credentials: true
})

// better-auth mounted at /api/auth/*splat (Express 5)
app.all("/api/auth/*splat", toNodeHandler(auth))

// API routes
app.use("/api", teamsRouter);
app.use("/api", teamMembersRouter);
app.use("/api", tasksRouter);
app.use("/api", commentsRouter);
```

**Execution:** Uses `tsx` to run TypeScript files directly without compilation

### 2. Authentication (`lib/auth.ts`)

**Library:** better-auth v1.3.34

**Features:**
- User registration and login
- Session management (database-backed)
- Email verification (if configured)
- Password reset
- Session validation middleware

**Configuration:**
- Automatic table creation in MySQL
- Session stored in database
- Integrates with Drizzle ORM

### 3. Database Connection (`lib/db.js`)

**ORM:** Drizzle ORM v0.44.7  
**Driver:** mysql2 v3.15.3

**Responsibilities:**
- Establish MySQL connection
- Export `db` instance for queries
- Handle connection pooling

**Connection Check:**
- Server only starts if `db` connection succeeds
- Error logged if connection fails

### 4. Database Schema (`schema/*.ts`)

**Approach:** SQL-first with Drizzle, TypeScript definitions

**Schemas:**
- `auth.ts` - better-auth managed tables (user, session, account, verification)
- `teams.ts` - Team table with creator tracking
- `user-teams.ts` - Junction table with role field (manager/member)
- `tasks.ts` - Task table with team_id FK (team-scoped)
- `comments.ts` - Comment table with task_id FK
- `relations.ts` - All Drizzle relations (consolidated)
- `index.ts` - Schema exports with proper ES module extensions

**Migration Strategy:**
- Forward-only migrations
- Generated via `drizzle-kit generate`
- Applied via `drizzle-kit migrate`

**Important:** All imports use `.js` extensions for ES module compatibility with tsx

## Data Architecture

### Database: MySQL

**Tables:**
1. **better-auth tables** - users, sessions, accounts, verification
2. **team** - Team metadata (id, name, description, created_by_id)
3. **user_team** - Junction table (user_id, team_id, role)
4. **task** - Tasks with team_id FK (team-scoped access)
5. **comment** - Task comments with task_id FK

**Relationships:**
- team → user (created_by_id)
- user_team → user, team (many-to-many with role)
- task → team (team_id FK, CASCADE DELETE)
- task → user (assignee_id, created_by_id)
- comment → task (task_id FK, CASCADE DELETE)
- comment → user (user_id FK)

**See:** [Data Models Documentation](./data-models.md) for complete schema

## API Design

### Implemented Endpoints ✅

**Base URL:** `/api`

#### Authentication (better-auth)
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/signup` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/session` | Get current session |

#### Teams
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/teams` | ✅ | Create team (auto-assign manager) |
| GET | `/api/teams` | ✅ | List user's teams |
| GET | `/api/teams/:teamId` | ✅ Member | Get team details |
| PATCH | `/api/teams/:teamId` | ✅ Manager | Update team |
| DELETE | `/api/teams/:teamId` | ✅ Manager | Delete team |

#### Team Members
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/teams/:teamId/members` | ✅ Member | List members |
| POST | `/api/teams/:teamId/members` | ✅ Manager | Add member |
| DELETE | `/api/teams/:teamId/members/:userId` | ✅ Manager | Remove member |
| PATCH | `/api/teams/:teamId/members/:userId/role` | ✅ Manager | Update role |

#### Tasks (Team-Scoped)
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/teams/:teamId/tasks` | ✅ Member | List team tasks (with filters) |
| POST | `/api/teams/:teamId/tasks` | ✅ Manager | Create task |
| GET | `/api/tasks/:id` | ✅ Member | Get task details |
| PATCH | `/api/tasks/:id` | ✅ Manager | Update task |
| PATCH | `/api/tasks/:id/status` | ✅ Assignee/Manager | Update status |
| DELETE | `/api/tasks/:id` | ✅ Manager | Delete task |

#### Comments
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/tasks/:taskId/comments` | ✅ Member | List comments |
| POST | `/api/tasks/:taskId/comments` | ✅ Member | Add comment |
| PATCH | `/api/comments/:id` | ✅ Author | Update comment |
| DELETE | `/api/comments/:id` | ✅ Author/Manager | Delete comment |

**See:** [API Documentation](../brain/.../api-documentation.md) for request/response examples

## Authorization Middleware

### Middleware Chain

**1. `requireAuth`**
- Validates better-auth session
- Attaches `req.user` with user info
- Returns 401 if not authenticated

**2. `requireTeamMembership`**
- Checks user is member of team (via `teamId` param)
- Attaches `req.teamRole` (manager/member)
- Returns 403 if not a team member

**3. `requireManagerRole`**
- Checks `req.teamRole === 'manager'`
- Returns 403 if not a manager

### Permission Matrix

| Action | Middleware Chain |
|--------|------------------|
| Create Team | `requireAuth` |
| View Team Tasks | `requireAuth` → `requireTeamMembership` |
| Create Task | `requireAuth` → `requireTeamMembership` → `requireManagerRole` |
| Update Task Status | `requireAuth` + custom validation (assignee OR manager) |
| Add Team Member | `requireAuth` → `requireTeamMembership` → `requireManagerRole` |

## Development Workflow

### Local Development

1. **Start MySQL:** Ensure MySQL server is running
2. **Configure `.env`:** Set DATABASE_URL, CORS_ORIGIN, etc.
3. **Run Migrations:** `pnpm drizzle-kit migrate`
4. **Start Server:** `pnpm dev` (uses tsx with nodemon)

### Hot Reload

- `nodemon` watches `src/` directory
- Automatically restarts on `.js` and `.ts` file changes
- Uses `tsx` for TypeScript execution (no build step)

### Database Management

```bash
# Open Drizzle Studio (web UI)
pnpm drizzle-kit studio

# Generate new migration
pnpm drizzle-kit generate

# Apply migrations
pnpm drizzle-kit migrate
```

## Deployment Architecture

### Production Recommendations

**Server:**
- Node.js hosting (AWS, GCP, Heroku, Railway, etc.)
- PM2 for process management
- Environment variables via hosting platform
- Use `tsx` for production (or compile with tsc)

**Database:**
- Managed MySQL service (AWS RDS, PlanetScale, etc.)
- Connection pooling enabled
- SSL/TLS for connections

**Reverse Proxy:**
- Nginx or cloud load balancer
- HTTPS/SSL termination
- Rate limiting

## Security Considerations

1. **Authentication:** better-auth handles securely
2. **Sessions:** HttpOnly cookies, database-backed
3. **CORS:** Restricted to frontend origin only
4. **Team-Scoped Access:** ALL queries filter by team_id
5. **Environment Secrets:** Stored in `.env` (not committed)
6. **SQL Injection:** Protected by Drizzle ORM parameterization
7. **Input Validation:** Basic validation in routes (Zod recommended)
8. **Role-Based Access:** Manager/member permissions enforced

## Error Handling

**Current Implementation:**
- Standard error responses with error codes
- HTTP status codes: 400, 401, 403, 404, 409, 500
- Error format: `{ error: "CODE", message: "description" }`

**Recommended Enhancements:**
- Centralized error middleware
- Logging (Winston, Pino)
- Error tracking (Sentry)

## Performance Considerations

1. **Database Connection Pooling:** via mysql2 ✅
2. **Indexes:** Composite indexes on (team_id, status) ✅
3. **Query Optimization:** Drizzle generates efficient SQL ✅
4. **Caching:** Not yet implemented (Redis recommended)
5. **Rate Limiting:** Not yet implemented

## Environment Variables

Required `.env` configuration:

```env
# Server
PORT=5001

# CORS
CORS_ORIGIN=http://localhost:5173

# Database
DATABASE_URL=mysql://user:password@localhost:3306/dbname

# Authentication
BETTER_AUTH_SECRET=your-secure-secret-key-here
BETTER_AUTH_URL=http://localhost:5001
```

## Testing Strategy

**Current State:** No tests configured

**Recommended:**
- **Unit Tests:** Jest or Vitest for business logic
- **Integration Tests:** Supertest for API endpoints
- **E2E Tests:** Database integration tests
- **Test DB:** Separate test database

## Known Issues & Solutions

### 1. ES Module Imports ✅ SOLVED
**Issue:** TypeScript imports without `.js` extensions caused errors  
**Solution:** All imports use `.js` extensions (tsx resolves to `.ts`)

### 2. Express 5 Route Pattern ✅ SOLVED
**Issue:** better-auth route `/api/auth/*` failed  
**Solution:** Use Express 5 syntax `/api/auth/*splat`

### 3. TypeScript Execution ✅ SOLVED
**Issue:** Server ran with `node` instead of `tsx`  
**Solution:** Updated package.json to use `tsx src/server.js`

## Future Enhancements

1. ✅ ~~Implement Team API~~ - COMPLETED
2. ✅ ~~Implement Task API~~ - COMPLETED
3. ✅ ~~Add Authorization Middleware~~ - COMPLETED
4. ⏭️ **Add Validation:** Zod schema validation
5. ⏭️ **WebSocket Support:** Real-time task updates
6. ⏭️ **Logging:** Structured logging system
7. ⏭️ **Testing:** Comprehensive test suite
8. ⏭️ **API Documentation:** OpenAPI/Swagger spec
9. ⏭️ **Rate Limiting:** Protect against abuse
10. ⏭️ **Caching:** Redis for frequently accessed data

## References

- [Data Models Documentation](./data-models.md)
- [API Documentation](../brain/.../api-documentation.md)
- [Architecture Additions](../brain/.../architecture-additions.md)
- [Database Schema](../brain/.../database-schema.md)
