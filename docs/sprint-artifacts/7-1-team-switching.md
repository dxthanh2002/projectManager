# Story 7.1: Team Switching (Drawer Navigation)

Status: done
Epic: 7 - Mobile Dashboard & Team Awareness
Created: 2025-12-26
Completed: 2025-12-26
Author: Bob (Scrum Master)
Implemented by: Amelia (Developer)

---

## Story

**As a** User (Manager or Member),
**I want** to switch between my teams via a drawer menu,
**So that** I can manage different projects on-the-go.

---

## Acceptance Criteria

1. **AC1:** Left-side Drawer implementation showing a list of all user's teams
2. **AC2:** Tapping a team updates `currentTeamId` in Zustand and refreshes the Dashboard
3. **AC3:** Current team title displayed in the app header
4. **AC4:** Empty state shown if user has no teams with "Create Team" CTA (FR30)
5. **AC5:** Loading indicator shown while fetching teams (FR33)

---

## Tasks / Subtasks

### Task 1: API Integration for Teams (AC: 1, 5)

- [ ] 1.1 Create `useTeams` TanStack Query hook
  - Endpoint: `GET /api/teams`
  - Returns: `Team[]` array with `id`, `name`, `description`, `role`
  - Configure stale time and caching

- [ ] 1.2 Create API types in `src/types/team.ts`
  ```typescript
  interface Team {
    id: string;
    name: string;
    description?: string;
    role: 'manager' | 'member';
    createdAt: string;
  }
  ```

### Task 2: Zustand Store Enhancement (AC: 2)

- [ ] 2.1 Update `useAppStore` to include team management
  ```typescript
  interface AppState {
    currentTeamId: string | null;
    setCurrentTeam: (teamId: string) => void;
  }
  ```

- [ ] 2.2 Persist `currentTeamId` to AsyncStorage
  - Use zustand/persist middleware

### Task 3: Drawer Navigation Component (AC: 1, 3)

- [ ] 3.1 Install expo-router drawer if needed
  ```bash
  bun add @react-navigation/drawer
  ```

- [ ] 3.2 Create `src/components/TeamDrawer.tsx`
  - List of team items with Paper `List.Item`
  - Show role badge (Manager/Member)
  - Highlight selected team

- [ ] 3.3 Update `_layout.tsx` to use Drawer navigator
  - Wrap main navigation with Drawer
  - Configure drawer position: left
  - Set drawer content to `TeamDrawer`

### Task 4: Header Integration (AC: 3)

- [ ] 4.1 Create `src/components/AppHeader.tsx`
  - Show current team name
  - Hamburger menu icon to open drawer
  - Use `useAppStore` to get current team info

- [ ] 4.2 Integrate header into tabs layout

### Task 5: Empty State & Loading (AC: 4, 5)

- [ ] 5.1 Create `src/components/EmptyTeamState.tsx`
  - Message: "You don't have any workspaces yet!"
  - Primary button: "Create Your First Workspace"
  - Navigate to team creation flow

- [ ] 5.2 Add loading skeleton while fetching teams

---

## Dev Notes

### Architecture References

- **State Management:** Zustand with persist [Source: docs/architecture-mobile.md#Decision-6]
- **Data Fetching:** TanStack Query [Source: docs/architecture-mobile.md#Decision-5]
- **Navigation:** expo-router v6 [Source: docs/architecture-mobile.md#Decision-2]
- **UI Components:** react-native-paper [Source: docs/architecture-mobile.md#Technology-Stack]

### Project Structure Impact

```
mobile/src/
├── app/
│   ├── _layout.tsx          # UPDATE: Add Drawer wrapper
│   └── (tabs)/
│       └── _layout.tsx      # UPDATE: Add header with team name
├── components/
│   ├── TeamDrawer.tsx       # NEW: Drawer content
│   ├── AppHeader.tsx        # NEW: Custom header
│   └── EmptyTeamState.tsx   # NEW: Empty state component
├── hooks/
│   └── use-teams.ts         # NEW: Teams query hook
├── store/
│   └── app-store.ts         # UPDATE: Add currentTeamId
└── types/
    └── team.ts              # NEW: Team type definitions
```

### UX Design References

- Empty state design: [Source: docs/ux-design-specification.md#Empty-State-Patterns]
- Loading patterns: [Source: docs/ux-design-specification.md#Loading-State-Patterns]
- Experience principle: "Glanceable Dashboards" [Source: docs/ux-design-specification.md#Experience-Principles]

### Dependencies

- Story 6-3 (API & State Infrastructure) - **DONE**
- Backend `/api/teams` endpoint - **EXISTS**

### Testing Notes

- Test drawer open/close gestures
- Test team switch updates dashboard content
- Test empty state navigation
- Test persistence across app restart

---

## Dev Agent Record

### Context Reference

<!-- Story context will be added during implementation -->

### Agent Model Used

Gemini 2.5

### Completion Notes List

<!-- To be filled during development -->

### File List

<!-- Files created/modified during development -->
