# Frontend Architecture - ManagerCheck

**Generated:** 2025-12-24
**Type:** Vue 3 Single Page Application
**Pattern:** Component-based with Composition API

---

## Executive Summary

The frontend is a **Vue 3 SPA** built with **TypeScript** and **Vite** (using rolldown). It uses **Pinia** for state management, **Vue Router** for navigation, and **Socket.io-client** for real-time updates. The UI is styled with **TailwindCSS 4** and **shadcn-vue** components.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            App.vue (Root)                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │ NotificationToast│  │   Vue Router    │  │   Socket.io     │         │
│  └─────────────────┘  └────────┬────────┘  └─────────────────┘         │
└────────────────────────────────┼────────────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          Views (10 Routes)                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │Dashboard │ │TaskList  │ │Members   │ │ Sign In  │ │ Sign Up  │     │
│  │  View    │ │  View    │ │  View    │ │   Page   │ │   Page   │     │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────────┘ └──────────┘     │
└───────┼────────────┼────────────┼───────────────────────────────────────┘
        │            │            │
        ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Pinia Stores (5)                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │  Auth    │ │  Team    │ │  Task    │ │ Comment  │ │Notification│    │
│  │  Store   │ │  Store   │ │  Store   │ │  Store   │ │  Store    │    │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘    │
└───────┼────────────┼────────────┼────────────┼────────────┼─────────────┘
        │            │            │            │            │
        ▼            ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         API Layer (lib/)                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                     │
│  │ auth-client │  │    api.ts   │  │  socket.ts  │                     │
│  │(better-auth)│  │   (axios)   │  │(socket.io)  │                     │
│  └─────────────┘  └─────────────┘  └─────────────┘                     │
└─────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                    Backend REST API + WebSocket
```

---

## Directory Structure

```
frontend/src/
├── main.ts                  # Entry point
├── App.vue                  # Root component + Socket.io setup
├── router/
│   └── index.ts             # Route definitions + auth guards
├── store/                   # Pinia stores
│   ├── useAuthStore.ts      # Authentication state
│   ├── useTeamStore.ts      # Teams & members
│   ├── useTaskStore.ts      # Tasks CRUD
│   ├── useCommentStore.ts   # Comments CRUD
│   └── useNotificationStore.ts  # Real-time notifications
├── views/                   # Page components
│   ├── DashboardView.vue    # Team dashboard with stats
│   ├── TaskListView.vue     # Task management (22KB)
│   ├── TeamMembersView.vue  # Member management
│   ├── Auth/                # Sign in, sign up, welcome
│   └── Teams/               # Create team
├── components/              # 114 components
│   ├── AppSidebar.vue       # Main navigation
│   ├── TeamSidebar.vue      # Team context sidebar
│   ├── NotificationToast.vue # Toast notifications
│   ├── LoginForm.vue        # Auth forms
│   ├── SignupForm.vue
│   ├── comments/            # Comment components
│   ├── teams/               # Team components
│   └── ui/                  # 102 shadcn-vue components
├── lib/
│   ├── auth-client.ts       # better-auth client
│   ├── api.ts               # Axios instance
│   ├── socket.ts            # Socket.io client
│   └── utils.ts             # Shared utilities
├── types/                   # TypeScript definitions
├── schemas/                 # Zod validation schemas
└── css/
    └── style.css            # Global styles
```

---

## Routing

| Path | View | Auth | Layout |
|------|------|------|--------|
| `/` | DashboardView | ✅ | Full width |
| `/dashboard` | DashboardView | ✅ | Full width |
| `/signin` | SignInPage | Guest only | - |
| `/signup` | SignUpPage | Guest only | - |
| `/welcome` | Welcome | Guest only | - |
| `/teams/create` | CreateTeamPage | ✅ | Centered |
| `/teams/:teamId` | Main | ✅ | - |
| `/teams/:teamId/members` | TeamMembersView | ✅ | Full width |
| `/teams/:teamId/tasks` | TaskListView | ✅ | Full width |
| `/about` | About | - | - |

### Route Guards
```typescript
router.beforeEach(async (to, from, next) => {
    const { data: session } = await authClient.getSession();
    
    if (to.meta.requiresAuth && !session) {
        next('/signin');
    } else if (to.meta.guestOnly && session) {
        next('/dashboard');
    } else {
        next();
    }
});
```

---

## Pinia Stores

### useAuthStore
Manages authentication state.
```typescript
interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    // Actions
    checkSession(): Promise<void>;
    signOut(): Promise<void>;
}
```

### useTeamStore
Manages teams and members.
```typescript
interface TeamStore {
    teams: Team[];
    currentTeam: Team | null;
    members: TeamMember[];
    loading: boolean;
    // Actions
    fetchTeams(): Promise<void>;
    createTeam(data): Promise<Team>;
    fetchMembers(teamId): Promise<void>;
    inviteMember(teamId, email): Promise<void>;
    updateMemberRole(teamId, userId, role): Promise<void>;
    removeMember(teamId, userId): Promise<void>;
}
```

### useTaskStore
Manages tasks with filtering.
```typescript
interface TaskStore {
    tasks: Task[];
    loading: boolean;
    filters: { status?, assigneeId?, priority? };
    // Actions
    fetchTasks(teamId): Promise<void>;
    createTask(teamId, data): Promise<Task>;
    updateTask(taskId, data): Promise<void>;
    updateTaskStatus(taskId, status): Promise<void>;
    deleteTask(taskId): Promise<void>;
}
```

### useCommentStore
Manages task comments.
```typescript
interface CommentStore {
    comments: Comment[];
    loading: boolean;
    // Actions
    fetchComments(taskId): Promise<void>;
    addComment(taskId, content): Promise<Comment>;
    updateComment(commentId, content): Promise<void>;
    deleteComment(commentId): Promise<void>;
}
```

### useNotificationStore
Manages real-time notifications.
```typescript
interface NotificationStore {
    notifications: Notification[];
    unreadCount: number;
    // Actions
    addNotification(notification): void;
    markAsRead(id): void;
    clearAll(): void;
}
```

---

## Socket.io Integration

### Setup (`lib/socket.ts`)
```typescript
import { io } from 'socket.io-client';

export const socket = io('http://localhost:5001', {
    withCredentials: true,
    autoConnect: false,
});

export function joinTeam(teamId: string) {
    socket.emit('join:team', teamId);
}

export function leaveTeam(teamId: string) {
    socket.emit('leave:team', teamId);
}
```

### Event Handlers (`App.vue`)
```typescript
socket.on('task:assigned', (data) => {
    notificationStore.addNotification({
        type: 'task_assigned',
        message: `${data.assignedBy} assigned you a task: ${data.title}`,
        ...data
    });
});

socket.on('task:status_changed', (data) => {
    taskStore.updateTaskLocally(data.taskId, { status: data.newStatus });
    notificationStore.addNotification({...});
});

socket.on('comment:added', (data) => {
    commentStore.addCommentLocally(data);
    notificationStore.addNotification({...});
});
```

---

## UI Components

### Layout Components
- **AppSidebar** - Main navigation with team switcher
- **TeamSidebar** - Team context navigation
- **NotificationToast** - Toast notification display

### Form Components
- **LoginForm** - Sign in form with validation
- **SignupForm** - Registration form

### shadcn-vue Components (102)
Located in `components/ui/`:
- Buttons, inputs, selects
- Dialog, drawer, sheet
- Cards, tables, dropdown menus
- Toast, tooltip, popover
- And many more...

---

## Styling

### TailwindCSS 4
Using the latest TailwindCSS with Vite plugin:
```javascript
// tailwind.config.js
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts}'],
    theme: {
        extend: {
            // Custom theme extensions
        }
    },
    plugins: [
        require('tailwindcss-animate'),
    ]
}
```

### Component Libraries
- **shadcn-vue** - Headless UI components
- **Flowbite Vue** - Additional UI components
- **Lucide Vue** - Icon library
- **Tabler Icons Vue** - Additional icons

---

## Form Validation

Using **vee-validate** with **Zod** schemas:
```typescript
// schemas/auth.ts
import { z } from 'zod';

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const signUpSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
});
```

---

## Build & Development

### Scripts
```bash
pnpm dev      # Start dev server (Vite HMR)
pnpm build    # Production build
pnpm preview  # Preview production build
```

### Environment Variables
```env
VITE_API_URL=http://localhost:5001
```

### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
});
```

---

**Last Updated:** 2025-12-24
**Version:** 2.0.0
