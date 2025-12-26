# Story 7.2: Task Dashboard (Manager/Member)

Status: drafted
Epic: 7 - Mobile Dashboard & Team Awareness
Created: 2025-12-26
Author: Bob (Scrum Master)

---

## Story

**As a** User (Manager or Member),
**I want** to see a filtered list of tasks for the current team,
**So that** I can track progress or my responsibilities.

---

## Acceptance Criteria

1. **AC1:** Managers see all team tasks
2. **AC2:** Members see only their assigned tasks
3. **AC3:** Supports status filtering (Todo, In Progress, Done, Blocked) via segmented control
4. **AC4:** Supports priority filtering (Low, Medium, High) (FR26)
5. **AC5:** Multiple filters can be combined (FR27)
6. **AC6:** Pull-to-refresh implemented for manual sync (FR35)
7. **AC7:** Loading indicator shown while fetching tasks (FR33)
8. **AC8:** Empty state shown when no tasks match filters (FR31)

---

## Tasks / Subtasks

### Task 1: API Integration for Tasks (AC: 1, 2, 7)

- [ ] 1.1 Create `useTasks` TanStack Query hook
  - Endpoint: `GET /api/teams/:teamId/tasks`
  - Filter by role: Manager gets all, Member gets assigned only
  - Configure query key with teamId for proper caching

- [ ] 1.2 Add Task interface enhancements if needed
  - Ensure `assignee` info is included in response

### Task 2: Task Card Component (AC: 1, 2)

- [ ] 2.1 Create `src/components/TaskCard.tsx`
  - Display: title, status pill, priority badge, assignee avatar
  - Use react-native-paper Card component
  - Status colors from theme constants

- [ ] 2.2 Create status color constants
  ```typescript
  // constants/theme.ts
  export const StatusColors = {
    todo: '#6B7280',
    in_progress: '#3B82F6',
    done: '#10B981',
    blocked: '#F59E0B',
  };
  ```

### Task 3: Filter Controls (AC: 3, 4, 5)

- [ ] 3.1 Create `src/components/TaskFilters.tsx`
  - SegmentedButtons for status filter (All, Todo, In Progress, Done, Blocked)
  - Chip row for priority filter (optional toggle)
  - Store filter state in local component state or Zustand

- [ ] 3.2 Add filter state to `useAppStore` (optional)
  ```typescript
  taskStatusFilter: TaskStatus | 'all';
  taskPriorityFilter: TaskPriority | 'all';
  ```

### Task 4: Task List Screen (AC: 6, 7, 8)

- [ ] 4.1 Update `app/(tabs)/tasks.tsx`
  - Integrate `useTasks` hook with currentTeamId
  - Add TaskFilters component at top
  - Render FlatList of TaskCard components
  - Implement pull-to-refresh

- [ ] 4.2 Create empty state component
  - Message: "No tasks yet. Ready to get productive?"
  - CTA: "Create Task" (Manager only)

- [ ] 4.3 Implement role-based filtering
  - Get current user ID from session
  - Filter tasks by assigneeId for Members

### Task 5: Dashboard Integration (AC: 1)

- [ ] 5.1 Update Dashboard with task stats
  - Count by status (todo, in_progress, done, blocked)
  - Display in Quick Stats card

---

## Dev Notes

### Architecture References

- **Data Fetching:** TanStack Query [Source: docs/architecture-mobile.md#Decision-5]
- **Status Colors:** Custom theme constants [Source: docs/architecture-mobile.md#Decision-11]
- **UI Components:** react-native-paper [Source: docs/architecture-mobile.md#Technology-Stack]
- **Loading States:** FR33 [Source: docs/prd.md#Loading-States]

### Project Structure Impact

```
mobile/src/
├── app/(tabs)/
│   ├── tasks.tsx              # UPDATE: Full implementation
│   └── index.tsx              # UPDATE: Add task stats
├── components/
│   ├── TaskCard.tsx           # NEW: Task display card
│   └── TaskFilters.tsx        # NEW: Filter controls
├── hooks/
│   └── use-tasks.ts           # NEW: Tasks query hook
└── constants/
    └── theme.ts               # UPDATE: Add StatusColors
```

### UX Design References

- Status pills: [Source: docs/ux-design-specification.md#Design-System-Foundation]
- Empty state: [Source: docs/ux-design-specification.md#Empty-State-Patterns]
- Loading patterns: [Source: docs/ux-design-specification.md#Loading-State-Patterns]

### Dependencies

- Story 7-1 (Team Switching) - **DONE**
- Backend `/api/teams/:id/tasks` endpoint - **EXISTS**

### Testing Notes

- Test manager sees all tasks
- Test member sees only assigned tasks
- Test filter combinations
- Test empty state with no tasks
- Test pull-to-refresh updates list

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
