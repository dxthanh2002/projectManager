# Integration Architecture - ManagerCheck

**Generated:** 2025-12-24
**Pattern:** Client-Server with Real-time Updates

---

## Overview

ManagerCheck uses a classic client-server architecture with two communication channels:
1. **REST API** - For CRUD operations
2. **WebSocket** - For real-time notifications

---

## Communication Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Vue 3 SPA)                            │
│                                                                          │
│  ┌──────────────────┐          ┌──────────────────┐                    │
│  │   Pinia Stores   │          │  Socket.io Client │                    │
│  │  (State Mgmt)    │          │ (Real-time Events)│                    │
│  └────────┬─────────┘          └─────────┬────────┘                    │
│           │                               │                             │
│           ▼                               │                             │
│  ┌──────────────────┐                     │                             │
│  │    Axios (api.ts)│                     │                             │
│  └────────┬─────────┘                     │                             │
└───────────┼───────────────────────────────┼─────────────────────────────┘
            │                               │
            │ HTTP/REST                     │ WebSocket
            │ Port 5001                     │ Port 5001
            ▼                               ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                         BACKEND (Express 5)                               │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐│
│  │                        HTTP Server                                    ││
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐         ││
│  │  │   better-auth  │  │  REST Routes   │  │  Socket.io     │         ││
│  │  │  /api/auth/*   │  │  /api/*        │  │  Server        │         ││
│  │  └────────────────┘  └───────┬────────┘  └───────┬────────┘         ││
│  └──────────────────────────────┼───────────────────┼────────────────────┘│
│                                 │                   │                     │
│                                 │                   │                     │
│                                 ▼                   │                     │
│  ┌──────────────────────────────────────────────────▼────────────────────┐│
│  │                      emitToTeam(teamId, event, payload)               ││
│  │                      Broadcasts to team room subscribers              ││
│  └──────────────────────────────────────────────────────────────────────┘│
│                                 │                                         │
│                                 ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐│
│  │                      Drizzle ORM (db.js)                              ││
│  │                      MySQL Connection                                 ││
│  └──────────────────────────────────────────────────────────────────────┘│
└───────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                         MySQL DATABASE                                    │
│                                                                           │
│   user │ team │ user_team │ task │ comment                               │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## REST API Integration

### Axios Configuration
```typescript
// frontend/src/lib/api.ts
import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:5001/api',
    withCredentials: true,  // Send session cookie
    headers: {
        'Content-Type': 'application/json',
    },
});
```

### Request Flow
1. **User action** triggers store method
2. **Pinia store** calls API via axios
3. **Request** sent to Express backend
4. **Middleware** validates auth + permissions
5. **Route handler** processes request
6. **Drizzle ORM** executes database query
7. **Response** returned to store
8. **Store** updates reactive state
9. **UI** re-renders automatically

---

## WebSocket Integration

### Connection Setup

**Frontend (`lib/socket.ts`):**
```typescript
export const socket = io('http://localhost:5001', {
    withCredentials: true,
    autoConnect: false,
});
```

**Backend (`lib/socket.js`):**
```javascript
export function initSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true,
        },
    });
    
    io.on('connection', (socket) => {
        socket.on('join:team', (teamId) => {
            socket.join(`team:${teamId}`);
        });
        
        socket.on('leave:team', (teamId) => {
            socket.leave(`team:${teamId}`);
        });
    });
}
```

### Event Flow
1. **User** opens team view
2. **Frontend** emits `join:team` event
3. **Backend** adds socket to team room
4. **Action** occurs (task created, comment added)
5. **Route handler** calls `emitToTeam()`
6. **Socket.io** broadcasts to room
7. **All connected clients** receive event
8. **Frontend** updates stores locally
9. **NotificationStore** adds notification

---

## Real-time Events

| Event | Trigger | Payload | Frontend Action |
|-------|---------|---------|-----------------|
| `task:assigned` | Task created with assignee | taskId, title, assigneeId, assignedBy, teamId | Show notification, update task list |
| `task:status_changed` | Status updated | taskId, title, newStatus, previousStatus, userId, userName | Update task locally, show notification |
| `comment:added` | Comment created | taskId, commentId, content, authorId, authorName, teamId | Add comment locally, show notification |

---

## Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │     │   Backend   │     │   MySQL     │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │  POST /api/auth/signin               │
       │  {email, password}                   │
       │─────────────────►│                   │
       │                   │  Verify user      │
       │                   │─────────────────►│
       │                   │◄─────────────────│
       │                   │                   │
       │                   │  Create session   │
       │                   │─────────────────►│
       │                   │◄─────────────────│
       │                   │                   │
       │  Set-Cookie: session                 │
       │◄─────────────────│                   │
       │                   │                   │
       │  GET /api/me      │                   │
       │  Cookie: session  │                   │
       │─────────────────►│                   │
       │                   │  Validate session │
       │                   │─────────────────►│
       │                   │◄─────────────────│
       │  {user, session}  │                   │
       │◄─────────────────│                   │
       │                   │                   │
```

---

## CORS Configuration

**Backend:**
```javascript
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'delay'],
    credentials: true,  // Allow cookies
}));
```

**Frontend:**
```typescript
// Axios
withCredentials: true

// Socket.io
withCredentials: true
```

---

## Data Synchronization Strategy

### Optimistic Updates
For better UX, some operations use optimistic updates:
1. **Update local state immediately**
2. **Send API request**
3. **On error, revert local state**

### Real-time Sync
WebSocket events ensure all clients stay in sync:
1. **Actor client** makes change via REST
2. **Backend** processes and broadcasts
3. **All clients** (including actor) receive event
4. **Non-actor clients** update local state

---

## Port Configuration

| Service | Port | Description |
|---------|------|-------------|
| Frontend (Vite) | 5173 | Development server |
| Backend (Express) | 5001 | REST API + WebSocket |
| MySQL | 3306 | Database |

---

**Last Updated:** 2025-12-24
**Version:** 2.0.0
