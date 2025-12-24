# Backend Architecture - ManagerCheck

**Generated:** 2025-12-24
**Type:** Express REST API Server
**Pattern:** MVC with Middleware Pipeline

---

## Executive Summary

The backend is built on **Express 5** with ESM modules, using **Drizzle ORM** for type-safe database queries and **Socket.io** for real-time notifications. Authentication is handled by **better-auth** with session-based management.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            HTTP Request                                  │
└────────────────────────────────┬────────────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           server.js (Entry)                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │    CORS     │→ │ better-auth │→ │ express.json│→ │   Routes    │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
└────────────────────────────────┬────────────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          Route Modules                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │   teams    │  │ team-      │  │   tasks    │  │  comments  │        │
│  │ (5 routes) │  │ members    │  │ (6 routes) │  │ (4 routes) │        │
│  └─────┬──────┘  │ (4 routes) │  └─────┬──────┘  └─────┬──────┘        │
│        │         └─────┬──────┘        │               │                │
└────────┼───────────────┼───────────────┼───────────────┼────────────────┘
         │               │               │               │
         ▼               ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          Middleware                                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────────────────┐    │
│  │ requireAuth│  │ requireTeam│  │ requireManager │  validate()  │    │
│  └────────────┘  │ Membership │  └────────────────────────────────┘    │
│                  └────────────┘                                         │
└────────────────────────────────┬────────────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Database Layer                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                        │
│  │ Drizzle ORM│→ │   Schema   │→ │   MySQL    │                        │
│  │   (db.js)  │  │ Definitions│  │ Database   │                        │
│  └────────────┘  └────────────┘  └────────────┘                        │
└─────────────────────────────────────────────────────────────────────────┘
         │
         ▼ (on actions)
┌─────────────────────────────────────────────────────────────────────────┐
│                        Socket.io Emissions                               │
│  emitToTeam(teamId, event, payload)                                     │
│  Events: task:assigned, task:status_changed, comment:added              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
backend/src/
├── server.js              # Entry point, middleware setup
├── lib/
│   ├── auth.ts           # better-auth configuration
│   ├── db.js             # Drizzle ORM connection
│   └── socket.js         # Socket.io initialization
├── routes/
│   ├── teams.js          # Team CRUD (5 endpoints)
│   ├── team-members.js   # Member management (4 endpoints)
│   ├── tasks.js          # Task operations (6 endpoints)
│   └── comments.js       # Comment operations (4 endpoints)
├── middleware/
│   ├── auth.js           # Auth guards (requireAuth, requireTeamMembership, requireManagerRole)
│   ├── validate.js       # Zod schema validation
│   └── error.js          # Global error handler
├── schema/
│   ├── index.ts          # Schema exports
│   ├── auth.ts           # User, session, account, verification
│   ├── teams.ts          # Team table
│   ├── user-teams.ts     # User-Team junction
│   ├── tasks.ts          # Task table
│   ├── comments.ts       # Comment table
│   └── relations.ts      # Drizzle relations
├── validators/
│   ├── team.validators.ts
│   ├── task.validators.ts
│   └── comment.validators.ts
└── migrations/           # Drizzle migration files
```

---

## API Endpoints

### Authentication (`/api/auth/*`)
Handled by better-auth. Key endpoints:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/me` - Get current session

### Teams (`/api/teams`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/teams` | ✅ | - | Create team (user becomes manager) |
| GET | `/api/teams` | ✅ | - | List user's teams |
| GET | `/api/teams/:teamId` | ✅ | Member | Get team details |
| PATCH | `/api/teams/:teamId` | ✅ | Manager | Update team |
| DELETE | `/api/teams/:teamId` | ✅ | Manager | Delete team |

### Team Members (`/api/teams/:teamId/members`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/teams/:teamId/members` | ✅ | Member | List team members |
| POST | `/api/teams/:teamId/members` | ✅ | Manager | Invite member by email |
| PATCH | `/api/teams/:teamId/members/:userId/role` | ✅ | Manager | Update member role |
| DELETE | `/api/teams/:teamId/members/:userId` | ✅ | Manager | Remove member |

### Tasks (`/api/teams/:teamId/tasks`, `/api/tasks/:id`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/teams/:teamId/tasks` | ✅ | Member | List tasks (w/ filters) |
| POST | `/api/teams/:teamId/tasks` | ✅ | Manager | Create task |
| GET | `/api/tasks/:id` | ✅ | Member | Get task details |
| PATCH | `/api/tasks/:id` | ✅ | Manager | Update task |
| PATCH | `/api/tasks/:id/status` | ✅ | Assignee/Manager | Update status |
| DELETE | `/api/tasks/:id` | ✅ | Manager | Delete task |

### Comments (`/api/tasks/:taskId/comments`, `/api/comments/:id`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/tasks/:taskId/comments` | ✅ | Member | List comments |
| POST | `/api/tasks/:taskId/comments` | ✅ | Member | Add comment |
| PATCH | `/api/comments/:id` | ✅ | Author | Edit comment |
| DELETE | `/api/comments/:id` | ✅ | Author/Manager | Delete comment |

---

## Middleware Chain

### requireAuth
Validates session via better-auth. Attaches `req.user` with user data.

### requireTeamMembership
Checks if user is a member of the team specified in `req.params.teamId`.

### requireManagerRole
Checks if user has 'manager' role in the team.

### validate(schema)
Validates request body/params against Zod schema.

### errorHandler
Global error handler for Express. Returns structured error responses.

---

## Socket.io Integration

### Initialization (`lib/socket.js`)
```javascript
import { Server } from 'socket.io';

export function initSocket(server) {
    const io = new Server(server, {
        cors: { origin: "http://localhost:5173", credentials: true }
    });
    
    io.on('connection', (socket) => {
        socket.on('join:team', (teamId) => socket.join(`team:${teamId}`));
        socket.on('leave:team', (teamId) => socket.leave(`team:${teamId}`));
    });
}

export function emitToTeam(teamId, event, payload) {
    io.to(`team:${teamId}`).emit(event, payload);
}
```

### Events Emitted
| Event | Trigger | Payload |
|-------|---------|---------|
| `task:assigned` | Task created with assignee | taskId, title, assigneeId, assignedBy, teamId |
| `task:status_changed` | Status updated | taskId, title, newStatus, previousStatus, userId, userName |
| `comment:added` | Comment created | taskId, commentId, content, authorId, authorName, teamId |

---

## Error Handling

All errors follow consistent structure:
```json
{
    "error": "ERROR_CODE",
    "message": "Human readable message"
}
```

Common error codes:
- `VALIDATION_ERROR` - Invalid input (400)
- `UNAUTHORIZED` - Not authenticated (401)
- `FORBIDDEN` - Insufficient permissions (403)
- `NOT_FOUND` - Resource not found (404)
- `INTERNAL_ERROR` - Server error (500)

---

## Environment Variables

```env
PORT=5001
DATABASE_URL=mysql://user:password@localhost:3306/managercheck
BETTER_AUTH_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

---

**Last Updated:** 2025-12-24
**Version:** 2.0.0
