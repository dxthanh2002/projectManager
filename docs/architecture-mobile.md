# Mobile Architecture - ManagerCheck

**Generated:** 2025-12-25  
**Type:** React Native / Expo Mobile App  
**Stack:** Expo 54 + React Native 0.81.5 + React 19  

---

## Executive Summary

The ManagerCheck mobile app is built with **Expo 54** and **React Native 0.81.5**, leveraging the **New Architecture** (Fabric + TurboModules) and **React 19** features including the React Compiler. Authentication is handled via **better-auth/expo** with secure storage using `expo-secure-store`.

### Key Technology Highlights

| Feature | Description |
|---------|-------------|
| **New Architecture** | Native module system with Fabric renderer enabled |
| **React 19** | Latest React with concurrent features |
| **React Compiler** | Automatic memoization (experimental) |
| **Typed Routes** | Type-safe navigation with expo-router |
| **Secure Auth** | better-auth with SecureStore persistence |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MOBILE APP (Expo 54)                            │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    expo-router v6 (File-based)                    │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐                  │  │
│  │  │  (auth)    │  │  (tabs)    │  │  (user)    │                  │  │
│  │  │  Group     │  │  Group     │  │  Group     │                  │  │
│  │  └────────────┘  └────────────┘  └────────────┘                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                 │                                       │
│  ┌──────────────────────────────▼──────────────────────────────────┐   │
│  │                        Components                                │   │
│  │  ThemedText | ThemedView | IconSymbol | HapticTab | Collapsible │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                 │                                       │
│  ┌──────────────────────────────▼──────────────────────────────────┐   │
│  │                    State & Auth Layer                            │   │
│  │         React Context + better-auth/expo + SecureStore           │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                 │                                       │
│  ┌──────────────────────────────▼──────────────────────────────────┐   │
│  │                      API Client (authClient)                     │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┼───────────────────────────────────────┘
                                  │
                                  ▼ HTTP/REST + WebSocket
                    Backend API (Express 5) Port 3000
```

---

## Technology Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Runtime** | Expo | 54.0.30 | Development platform |
| **Framework** | React Native | 0.81.5 | Mobile UI framework |
| **UI Library** | React | 19.1.0 | Component model |
| **Language** | TypeScript | 5.9.2 | Type safety |
| **Navigation** | expo-router | 6.0.21 | File-based routing |
| **Navigation** | @react-navigation | 7.x | Navigation primitives |
| **Auth** | better-auth | 1.4.9 | Authentication |
| **Auth Plugin** | @better-auth/expo | 1.4.9 | Expo integration |
| **Secure Storage** | expo-secure-store | 15.0.8 | Encrypted credential storage |
| **Image** | expo-image | 3.0.11 | Optimized image handling |
| **Animation** | react-native-reanimated | 4.1.1 | Performant animations |
| **Gestures** | react-native-gesture-handler | 2.28.0 | Touch handling |
| **Haptics** | expo-haptics | 15.0.8 | Tactile feedback |

---

## Directory Structure

```
mobile/
├── app.json                 # Expo configuration
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── src/
│   ├── app/                 # expo-router routes
│   │   ├── _layout.tsx      # Root layout (Stack + ThemeProvider)
│   │   ├── modal.tsx        # Modal screen
│   │   ├── (auth)/          # Auth route group (empty - to implement)
│   │   ├── (tabs)/          # Tab navigation group
│   │   │   ├── _layout.tsx  # Tab bar configuration
│   │   │   ├── index.tsx    # Home tab
│   │   │   └── explore.tsx  # Explore tab
│   │   └── (user)/          # User profile routes
│   ├── components/          # Reusable UI components
│   │   ├── themed-text.tsx  # Theme-aware Text
│   │   ├── themed-view.tsx  # Theme-aware View
│   │   ├── haptic-tab.tsx   # Tab with haptic feedback
│   │   ├── collapsible.tsx  # Expandable content
│   │   ├── parallax-scroll-view.tsx
│   │   ├── external-link.tsx
│   │   ├── hello-wave.tsx
│   │   └── ui/              # Core UI components
│   │       ├── collapsible.tsx
│   │       ├── icon-symbol.tsx
│   │       └── icon-symbol.ios.tsx
│   ├── context/             # React Context providers
│   │   └── app.context.tsx  # Theme context
│   ├── hooks/               # Custom React hooks
│   │   ├── use-color-scheme.ts
│   │   ├── use-color-scheme.web.ts
│   │   └── use-theme-color.ts
│   ├── lib/                 # Library integrations
│   │   └── auth-client.ts   # better-auth client setup
│   ├── constants/           # App constants
│   │   └── theme.ts         # Color definitions
│   └── assets/              # Images, icons
```

---

## Expo Configuration

### app.json Key Settings

```json
{
  "expo": {
    "scheme": "mobile",           // Deep link scheme
    "newArchEnabled": true,       // New Architecture (Fabric + TurboModules)
    "experiments": {
      "typedRoutes": true,        // Type-safe navigation
      "reactCompiler": true       // Automatic memoization
    },
    "android": {
      "edgeToEdgeEnabled": true   // Full-screen UI
    }
  }
}
```

### New Architecture Benefits
- **Fabric Renderer**: More responsive UI with synchronous layout
- **TurboModules**: Faster native module loading
- **Codegen**: Type-safe native bindings

---

## Architecture Decisions

### Decision 1: Authentication Strategy

**Status:** Approved  
**Date:** 2025-12-25

#### Context
The web app uses better-auth with session cookies. Mobile requires a different token storage mechanism that's secure and persistent.

#### Decision
Use **better-auth/expo** plugin with **expo-secure-store** for encrypted credential storage.

#### Implementation

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export const authClient = createAuthClient({
    baseURL: BASE_URL,
    plugins: [
        expoClient({
            scheme: "mobile",      // Must match app.json scheme
            storagePrefix: "mobile",
            storage: SecureStore,  // Encrypted storage
        }),
    ],
});

// Export convenience methods
export const { signIn, signUp, signOut, useSession } = authClient;
```

#### Usage Pattern
```typescript
// In components
import { useSession, signIn, signOut } from "@/lib/auth-client";

function ProfileScreen() {
  const { data: session, isPending } = useSession();
  
  if (isPending) return <Loading />;
  if (!session) return <LoginScreen />;
  
  return <UserProfile user={session.user} />;
}
```

#### Security Benefits
- **SecureStore**: Uses Keychain (iOS) / Keystore (Android)
- **Encrypted**: Credentials encrypted at rest
- **Automatic**: Token refresh handled by better-auth

---

### Decision 2: Navigation Architecture

**Status:** Approved  
**Date:** 2025-12-25

#### Context
The app needs authenticated and unauthenticated flows with tab-based main navigation.

#### Decision
Use **expo-router v6** with route groups and Stack/Tab hybrid navigation.

#### Current Structure
```
src/app/
├── _layout.tsx              # Root: Stack navigator + ThemeProvider
├── modal.tsx                # Modal presentation
├── (auth)/                  # Unauthenticated routes (login, signup)
├── (tabs)/                  # Main app tabs
│   ├── _layout.tsx          # Tab bar with haptic feedback
│   ├── index.tsx            # Home/Dashboard
│   └── explore.tsx          # Explore/Search
└── (user)/                  # User-related screens
```

#### Root Layout Pattern
```typescript
// _layout.tsx
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
```

#### Tab Layout with Haptics
```typescript
// (tabs)/_layout.tsx
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,  // Haptic feedback on tab press
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      {/* More tabs */}
    </Tabs>
  );
}
```

---

### Decision 3: Theming System

**Status:** Approved  
**Date:** 2025-12-25

#### Context
App needs to support light/dark mode with system preference detection.

#### Decision
Use **React Navigation themes** + custom themed components.

#### Implementation

```typescript
// hooks/use-color-scheme.ts
import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
  return useRNColorScheme();  // Returns 'light' | 'dark' | null
}

// components/themed-text.tsx
import { Text, type TextProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export function ThemedText({ style, lightColor, darkColor, ...rest }: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  return <Text style={[{ color }, style]} {...rest} />;
}
```

#### Color Constants
```typescript
// constants/theme.ts
export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#0a7ea4',
    icon: '#687076',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
  },
};
```

---

### Decision 4: Component Architecture

**Status:** Approved  
**Date:** 2025-12-25

#### Context
Need reusable, platform-aware components with consistent styling.

#### Decision
Create a component library with platform-specific implementations where needed.

#### Platform-Specific Pattern
```typescript
// components/ui/icon-symbol.tsx (Android/Web)
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export function IconSymbol({ name, size, color }: IconSymbolProps) {
  return <MaterialIcons name={MAPPING[name]} size={size} color={color} />;
}

// components/ui/icon-symbol.ios.tsx (iOS)
import { SymbolView } from 'expo-symbols';

export function IconSymbol({ name, size, color, weight }: IconSymbolProps) {
  return <SymbolView name={name} size={size} tintColor={color} weight={weight} />;
}
```

#### Haptic Tab Component
```typescript
// components/haptic-tab.tsx
import * as Haptics from 'expo-haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <Pressable
      {...props}
      onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    />
  );
}
```

---

### Decision 5: API Integration (To Implement)

**Status:** Planned  
**Date:** 2025-12-25

#### Context
Need to communicate with existing Express backend for team/task operations.

#### Planned Approach
Extend `authClient` for API calls since it already handles:
- Base URL configuration
- Authentication headers
- Token refresh

```typescript
// lib/api.ts (Planned)
import { authClient } from './auth-client';

// API calls through authClient fetch
export const api = {
  teams: {
    list: () => authClient.$fetch('/api/teams'),
    create: (data: CreateTeamDto) => authClient.$fetch('/api/teams', { 
      method: 'POST', 
      body: data 
    }),
  },
  tasks: {
    byTeam: (teamId: string) => authClient.$fetch(`/api/teams/${teamId}/tasks`),
    updateStatus: (taskId: string, status: string) => 
      authClient.$fetch(`/api/tasks/${taskId}/status`, { 
        method: 'PATCH', 
        body: { status } 
      }),
  },
};
```

---

### Decision 6: Real-Time Notifications (To Implement)

**Status:** Planned  
**Date:** 2025-12-25

#### Context
Web app uses Socket.io for real-time updates. Mobile needs same functionality.

#### Planned Approach
Use **socket.io-client** with authentication from better-auth session.

```typescript
// lib/socket.ts (Planned)
import { io, Socket } from 'socket.io-client';
import { authClient } from './auth-client';

let socket: Socket | null = null;

export async function initSocket() {
  const session = await authClient.getSession();
  if (!session) return null;
  
  socket = io(process.env.EXPO_PUBLIC_API_URL!, {
    transports: ['websocket'],
    auth: { token: session.token },
  });
  
  return socket;
}

export function joinTeam(teamId: string) {
  socket?.emit('join:team', teamId);
}

export function onTaskAssigned(callback: (data: any) => void) {
  socket?.on('task:assigned', callback);
}
```

---

## Development Commands

```bash
# Install dependencies
cd mobile
bun install   # or npm install

# Start development server
bun run start

# Run on Android
bun run android

# Run on iOS
bun run ios

# Run on Web
bun run web

# Lint code
bun run lint
```

---

## Environment Configuration

```env
# mobile/.env
EXPO_PUBLIC_API_URL=http://192.168.x.x:3000
```

> **Note:** Use your machine's local IP for physical device testing, not `localhost`.

---

## Current State vs. Planned Features

### ✅ Implemented
- [x] Expo 54 project with New Architecture
- [x] expo-router v6 file-based navigation
- [x] better-auth/expo client setup
- [x] expo-secure-store for credential storage
- [x] Theme system (light/dark mode)
- [x] Tab navigation with haptic feedback
- [x] Themed components (Text, View)
- [x] Platform-specific icons (SF Symbols / Material Icons)
- [x] React 19 with experimental React Compiler

### 🔄 To Be Implemented
- [ ] Auth screens (login, signup) in `(auth)` group
- [ ] Auth state guard in root layout
- [ ] Team context and task context
- [ ] Dashboard screen (task list, filters)
- [ ] Task detail screen
- [ ] Create/edit task modals
- [ ] Socket.io real-time integration
- [ ] Notification system

---

## Backend Integration Reference

The mobile app connects to the same backend as the web frontend:

| Backend Endpoint | Mobile Usage |
|-----------------|--------------|
| `/api/auth/sign-in/email` | Email login |
| `/api/auth/sign-up/email` | Email registration |
| `/api/auth/sign-out` | Logout |
| `/api/teams` | Team CRUD |
| `/api/teams/:id/tasks` | Task operations |
| `/api/tasks/:id/comments` | Comments |
| WebSocket (Socket.io) | Real-time notifications |

---

**Last Updated:** 2025-12-25  
**Version:** 3.0.0 (Complete Rewrite for Expo 54)
