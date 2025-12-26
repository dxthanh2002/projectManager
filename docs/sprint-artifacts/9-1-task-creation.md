# Story 9.1: Mobile Task Creation

Status: in-progress
Epic: 9 - Mobile Management & Invites
Created: 2025-12-26
Author: Bob (Scrum Master)

---

## Story

**As a** Manager,
**I want** to create tasks on mobile,
**So that** I can delegate work immediately when it arises.

---

## Acceptance Criteria

1. **AC1:** FAB on Dashboard opens "New Task" modal
2. **AC2:** Selection of assignee from team member list
3. **AC3:** Form validation with React Hook Form + Zod
4. **AC4:** Priority and due date selection
5. **AC5:** Optimistic UI on submit (FR28)

---

## Tasks / Subtasks

### Task 1: Create Task Hook

- [ ] 1.1 Create `useCreateTask` mutation hook
  - Endpoint: POST /api/teams/:teamId/tasks
  - Optimistic update to task list

### Task 2: Task Form Modal

- [ ] 2.1 Install react-hook-form and zod
  ```bash
  bun add react-hook-form zod @hookform/resolvers
  ```

- [ ] 2.2 Create `src/components/CreateTaskModal.tsx`
  - Title input (required)
  - Description textarea
  - Priority picker
  - Due date picker
  - Assignee picker

### Task 3: Team Members Hook

- [ ] 3.1 Create `useTeamMembers` hook
  - Endpoint: GET /api/teams/:teamId/members

### Task 4: Integration

- [ ] 4.1 Update tasks.tsx FAB to open modal
- [ ] 4.2 Success toast and refresh list

---

## Dev Notes

### Files to Create/Update

```
mobile/src/
├── hooks/
│   ├── use-create-task.ts      # NEW
│   └── use-team-members.ts     # NEW
├── components/
│   └── CreateTaskModal.tsx     # NEW
└── app/(tabs)/
    └── tasks.tsx               # UPDATE
```
