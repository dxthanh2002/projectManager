# Mobile Architecture - ManagerCheck

**Generated:** 2025-12-24
**Type:** React Native / Expo Mobile App
**Pattern:** File-based Routing (expo-router)

---

## Executive Summary

The mobile app is built with **Expo 51** and **React Native 0.74**, using **expo-router** for file-based navigation. It uses **Formik + Yup** for form handling and **Axios** for API communication with the existing backend.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MOBILE APP (Expo)                                │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      expo-router (File-based)                     │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐                 │  │
│  │  │  (auth)    │  │  (tabs)    │  │  (user)    │                 │  │
│  │  │  Group     │  │  Group     │  │  Group     │                 │  │
│  │  └────────────┘  └────────────┘  └────────────┘                 │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                 │                                        │
│  ┌──────────────────────────────▼──────────────────────────────────┐  │
│  │                        Components (32)                           │  │
│  │  button | input | loading | home | todo | library | example     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                 │                                        │
│  ┌──────────────────────────────▼──────────────────────────────────┐  │
│  │                    Context / State                               │  │
│  │           React Context + AsyncStorage                           │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                 │                                        │
│  ┌──────────────────────────────▼──────────────────────────────────┐  │
│  │                      Axios (API Client)                          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┼───────────────────────────────────────┘
                                  │
                                  ▼ HTTP/REST
                    Backend API (Express 5) Port 5001
```

---

## Directory Structure

```
mobile/
├── app.json                 # Expo configuration
├── package.json             # Dependencies
├── babel.config.js          # Babel configuration
├── tsconfig.json            # TypeScript config
├── src/
│   ├── app/                 # expo-router routes (21 items)
│   │   ├── _layout.tsx      # Root layout
│   │   ├── index.tsx        # Entry screen
│   │   ├── (auth)/          # Auth route group (5 items)
│   │   ├── (tabs)/          # Tab navigation group (7 items)
│   │   ├── (user)/          # User route group (1 item)
│   │   ├── like/            # Like screens (2 items)
│   │   └── product/         # Product screens (4 items)
│   ├── components/          # Reusable components (32 items)
│   │   ├── button/          # Button variants
│   │   ├── input/           # Input components
│   │   ├── loading/         # Loading indicators
│   │   ├── home/            # Home screen components
│   │   ├── todo/            # Todo list components
│   │   ├── library/         # Shared library components
│   │   ├── CustomFlatList/  # Custom list component
│   │   └── example/         # Example components
│   ├── context/             # React Context (1 item)
│   ├── types/               # TypeScript definitions (4 items)
│   ├── utils/               # Utility functions (4 items)
│   ├── data/                # Static data/mock (1 item)
│   └── assets/              # Images, icons (36 items)
```

---

## Technology Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Framework | Expo | 51.0.22 | Development platform |
| Runtime | React Native | 0.74.3 | Mobile UI framework |
| Language | TypeScript | 5.3.3 | Type safety |
| Navigation | expo-router | 3.5.23 | File-based routing |
| Navigation | @react-navigation | 6.x | Navigation primitives |
| Forms | Formik | 2.4.6 | Form management |
| Validation | Yup | 1.6.1 | Schema validation |
| HTTP | Axios | 1.7.5 | API client |
| Storage | AsyncStorage | 1.23.1 | Local persistence |
| Animation | react-native-reanimated | 3.10.1 | Animations |
| Gestures | react-native-gesture-handler | 2.16.1 | Touch handling |

---

## Routing Structure

### Route Groups

| Group | Path | Purpose |
|-------|------|---------|
| `(auth)` | `/auth/*` | Authentication screens (5 items) |
| `(tabs)` | `/tabs/*` | Main tab navigation (7 items) |
| `(user)` | `/user/*` | User profile screens (1 item) |
| `like` | `/like/*` | Like/favorite screens (2 items) |
| `product` | `/product/*` | Product detail screens (4 items) |

### Root Layout (`_layout.tsx`)
- Stack navigator for root navigation
- Auth state management
- Global providers setup

---

## Component Organization

| Directory | Items | Purpose |
|-----------|-------|---------|
| `button/` | 5 | Button variants and styles |
| `input/` | 1 | Text input components |
| `loading/` | 1 | Loading indicators |
| `home/` | 5 | Home screen specific |
| `todo/` | 3 | Todo list components |
| `library/` | 6 | Shared library components |
| `CustomFlatList/` | 2 | Optimized list component |
| `example/` | 9 | Example/demo components |

---

## Development Commands

```bash
# Install dependencies
cd mobile
npm install

# Start development server
npm start
# or
npm run dev

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### Quick Start

```bash
# From project root
cd mobile
npm install
npm run android   # For Android emulator/device
```

---

## Environment Configuration

```env
# mobile/.env
API_URL=http://localhost:5001
# For physical device, use your machine's IP:
# API_URL=http://192.168.x.x:5001
```

---

## Integration with Backend

The mobile app will connect to the same backend as the web frontend:

| Backend Endpoint | Mobile Usage |
|-----------------|--------------|
| `/api/auth/*` | Authentication (better-auth) |
| `/api/teams` | Team management |
| `/api/teams/:id/tasks` | Task operations |
| `/api/tasks/:id/comments` | Comments |
| WebSocket (Socket.io) | Real-time notifications |

---

## Architecture Decisions

_This section contains key architectural decisions for the mobile app implementation._

---

### Decision 1: Navigation Architecture

**Status:** Approved  
**Date:** 2025-12-24

#### Context
The mobile app requires a navigation structure that supports authenticated flows, tab-based main navigation, and team context switching similar to the web app.

#### Decision
Use **expo-router** with a hybrid navigation pattern:

```
src/app/
├── _layout.tsx              # Root: Auth check + Stack navigator
├── index.tsx                # Entry: Redirect based on auth state
├── (auth)/                  # Auth group (unauthenticated only)
│   ├── _layout.tsx          # Stack for auth screens
│   ├── login.tsx
│   └── signup.tsx
├── (main)/                  # Main app group (authenticated)
│   ├── _layout.tsx          # Drawer + Bottom tabs hybrid
│   ├── (tabs)/              # Bottom tab navigation
│   │   ├── _layout.tsx      # Tab bar config
│   │   ├── dashboard.tsx    # Manager dashboard
│   │   ├── my-tasks.tsx     # Member tasks
│   │   └── notifications.tsx
│   ├── task/[id].tsx        # Task detail (modal/stack)
│   └── team/[teamId]/       # Team context routes
│       ├── members.tsx
│       └── settings.tsx
```

#### Rationale
- **expo-router v3** provides file-based routing consistency with modern patterns
- **Drawer** enables team switching (mirroring web sidebar)
- **Bottom Tabs** provides quick access to main features
- **Stack** within groups handles detail screens

---

### Decision 2: State Management

**Status:** Approved  
**Date:** 2025-12-24

#### Context
The web app uses Pinia (5 stores). Mobile needs equivalent state management that works with React Native and handles async persistence.

#### Decision
Use **React Context + Hooks** pattern (not Redux/Zustand) for simplicity:

```typescript
// contexts/
├── AuthContext.tsx      // User session, login/logout
├── TeamContext.tsx      // Current team, team list, members
├── TaskContext.tsx      // Tasks, filters, CRUD operations
├── NotificationContext.tsx  // Real-time notifications, toast queue
└── AppContext.tsx       // App-wide providers wrapper
```

#### Key Patterns
```typescript
// AuthContext example
interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Persist session to AsyncStorage
  useEffect(() => {
    if (state.session) {
      AsyncStorage.setItem('session', JSON.stringify(state.session));
    }
  }, [state.session]);
  
  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
}
```

#### Rationale
- **Matches Web pattern** conceptually (contexts ≈ Pinia stores)
- **No additional dependencies** - React Context is built-in
- **AsyncStorage integration** for persistence
- **Simple mental model** for small-medium app

---

### Decision 3: API Integration

**Status:** Approved  
**Date:** 2025-12-24

#### Context
Mobile app must communicate with existing Express backend. Need consistent API handling, error management, and auth token attachment.

#### Decision
Use **Axios** with centralized interceptors:

```typescript
// lib/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:5001';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: Attach auth token
api.interceptors.request.use(async (config) => {
  const session = await AsyncStorage.getItem('session');
  if (session) {
    const { token } = JSON.parse(session);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear session and redirect to login
      await AsyncStorage.removeItem('session');
      router.replace('/login');
    }
    return Promise.reject(error);
  }
);
```

#### API Service Pattern
```typescript
// services/taskService.ts
export const taskService = {
  getTeamTasks: (teamId: string) => api.get(`/teams/${teamId}/tasks`),
  createTask: (teamId: string, data: CreateTaskDto) => api.post(`/teams/${teamId}/tasks`, data),
  updateStatus: (taskId: string, status: TaskStatus) => api.patch(`/tasks/${taskId}/status`, { status }),
  // ...
};
```

---

### Decision 4: Real-Time Integration

**Status:** Approved  
**Date:** 2025-12-24

#### Context
Web app uses Socket.io for real-time notifications. Mobile must have identical real-time behavior using same events.

#### Decision
Use **socket.io-client** with team room pattern:

```typescript
// lib/socket.ts
import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:5001';

let socket: Socket | null = null;

export function initSocket(sessionToken: string) {
  socket = io(API_URL, {
    autoConnect: true,
    transports: ['websocket'],
    auth: { token: sessionToken },
  });
  
  socket.on('connect', () => console.log('Socket connected'));
  socket.on('disconnect', () => console.log('Socket disconnected'));
  
  return socket;
}

export function joinTeam(teamId: string) {
  socket?.emit('join:team', teamId);
}

export function leaveTeam(teamId: string) {
  socket?.emit('leave:team', teamId);
}

export function onTaskAssigned(callback: (data: TaskAssignedEvent) => void) {
  socket?.on('task:assigned', callback);
}

export function onTaskStatusChanged(callback: (data: TaskStatusEvent) => void) {
  socket?.on('task:status_changed', callback);
}

export function onCommentAdded(callback: (data: CommentAddedEvent) => void) {
  socket?.on('comment:added', callback);
}
```

#### Integration with Context
```typescript
// In NotificationContext
useEffect(() => {
  if (session) {
    const socket = initSocket(session.token);
    
    onTaskAssigned((data) => {
      dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'task_assigned', ...data } });
      showToast(`New task: ${data.title}`);
    });
    
    return () => socket.disconnect();
  }
}, [session]);
```

---

### Decision 5: Authentication Strategy

**Status:** Approved  
**Date:** 2025-12-24

#### Context
Web uses better-auth with session cookies. Mobile cannot use cookies the same way - need token-based approach.

#### Decision
**Token-based authentication** with AsyncStorage persistence:

#### Flow
1. **Login**: Call `/api/auth/sign-in/email` → receive session token
2. **Store**: Save token to AsyncStorage
3. **Use**: Attach token in Authorization header for all API calls
4. **Persist**: On app start, check AsyncStorage for existing session
5. **Logout**: Clear AsyncStorage, reset context, redirect to login

```typescript
// Auth flow implementation
async function login(email: string, password: string) {
  const response = await api.post('/auth/sign-in/email', { email, password });
  const { session, user } = response.data;
  
  await AsyncStorage.setItem('session', JSON.stringify(session));
  await AsyncStorage.setItem('user', JSON.stringify(user));
  
  dispatch({ type: 'LOGIN_SUCCESS', payload: { session, user } });
  initSocket(session.token);
  router.replace('/(main)/(tabs)/dashboard');
}

async function checkSession() {
  const sessionStr = await AsyncStorage.getItem('session');
  if (sessionStr) {
    const session = JSON.parse(sessionStr);
    // Validate session with backend
    try {
      const { data } = await api.get('/me');
      dispatch({ type: 'RESTORE_SESSION', payload: data });
    } catch {
      await AsyncStorage.clear();
    }
  }
}
```

---

### Decision 6: Offline Handling (Future)

**Status:** Deferred  
**Date:** 2025-12-24

#### Decision
**Online-only for MVP**. Graceful error handling when offline:
- Show "No connection" banner
- Disable form submissions
- Queue local optimistic updates for retry when online

---

## Current State

### ✅ In Place
- Expo 51 project setup
- expo-router file-based navigation
- Route groups (auth, tabs, user)
- 32 reusable components
- TypeScript configuration
- Formik + Yup form handling

### 🔄 To Be Implemented
- [ ] **AuthContext** with AsyncStorage persistence
- [ ] **API interceptors** with error handling
- [ ] **Socket.io client** with team room pattern
- [ ] **TaskContext** with CRUD operations
- [ ] **Navigation restructure** for ManagerCheck flows
- [ ] **Task screens** (list, detail, create)
- [ ] **Team screens** (members, switcher)
- [ ] **Notification system** with toast

---

**Last Updated:** 2025-12-24
**Version:** 2.0.0 (Architecture Decisions Added)
