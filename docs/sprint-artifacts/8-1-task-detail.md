# Story 8.1: Task Detail & Status Transitions

Status: drafted
Epic: 8 - Mobile Task Execution & Communication
Created: 2025-12-26
Author: Bob (Scrum Master)

---

## Story

**As a** Member,
**I want** to view task details and update status,
**So that** I can communicate my progress.

---

## Acceptance Criteria

1. **AC1:** Task detail shows rich description, priority, and deadline
2. **AC2:** Status picker (Action Sheet style) for state transitions
3. **AC3:** If "Blocked" is selected, a comment modal is enforced
4. **AC4:** Status change reflects instantly in UI (FR28 - Optimistic)
5. **AC5:** On error, UI rolls back with toast notification (FR29)
6. **AC6:** Celebratory animation on marking "Done"

---

## Tasks / Subtasks

### Task 1: Bottom Sheet Task Detail (AC: 1)

- [ ] 1.1 Install @gorhom/bottom-sheet
  ```bash
  bun add @gorhom/bottom-sheet
  ```

- [ ] 1.2 Create `src/components/TaskDetailSheet.tsx`
  - Bottom sheet with snap points [50%, 90%]
  - Display: title, description, status, priority, due date
  - Close on swipe down

- [ ] 1.3 Add GestureHandlerRootView if not present in layout

### Task 2: Status Action Sheet (AC: 2)

- [ ] 2.1 Create `src/components/StatusActionSheet.tsx`
  - Use react-native-paper Menu or custom Modal
  - Options: To Do, In Progress, Done, Help Needed
  - "Help Needed" styled in amber (supportive)

- [ ] 2.2 Add status button to TaskDetailSheet
  - Shows current status with color
  - Tap opens Action Sheet

### Task 3: Blocker Comment Modal (AC: 3)

- [ ] 3.1 Create `src/components/BlockerCommentModal.tsx`
  - Triggered when user selects "Blocked"
  - Required text input (min 10 chars)
  - Submit button disabled until valid
  - Message: "What do you need help with?"

- [ ] 3.2 Integrate with status change flow
  - If status === 'blocked', show modal first
  - On submit, update status + add comment

### Task 4: Optimistic UI & API Integration (AC: 4, 5)

- [ ] 4.1 Create `useUpdateTaskStatus` mutation hook
  - Endpoint: PATCH /api/tasks/:id
  - Optimistic update with onMutate
  - Rollback on error with toast

- [ ] 4.2 Create `useAddComment` mutation hook (for blocker)
  - Endpoint: POST /api/tasks/:id/comments
  - Required for blocker flow

### Task 5: Done Animation (AC: 6)

- [ ] 5.1 Add checkmark animation for Done status
  - Use react-native-reanimated
  - Brief confetti or checkmark burst
  - Toast: "Nice work! 🎉"

### Task 6: Navigation Integration

- [ ] 6.1 Update TaskCard to open TaskDetailSheet
  - Pass task ID to sheet
  - Fetch full task details in sheet

---

## Dev Notes

### Architecture References

- **Bottom Sheet:** @gorhom/bottom-sheet [Source: docs/architecture-mobile.md#Decision-10]
- **Optimistic UI:** TanStack Query onMutate [Source: docs/architecture-mobile.md#Decision-9]
- **Animation:** react-native-reanimated [Source: docs/architecture-mobile.md#Technology-Stack]

### Project Structure Impact

```
mobile/src/
├── components/
│   ├── TaskDetailSheet.tsx      # NEW: Bottom sheet detail
│   ├── StatusActionSheet.tsx    # NEW: Status picker
│   ├── BlockerCommentModal.tsx  # NEW: Blocker input
│   └── TaskCard.tsx             # UPDATE: Open sheet
├── hooks/
│   ├── use-update-task.ts       # NEW: Status mutation
│   └── use-add-comment.ts       # NEW: Comment mutation
```

### UX Design References

- Blocker UI: [Source: docs/ux-design-specification.md#Executive-Summary]
- Experience Mechanics: [Source: docs/ux-design-specification.md#Experience-Mechanics]
- Optimistic patterns: [Source: docs/ux-design-specification.md#Optimistic-UI-Patterns]

### Dependencies

- Story 7-2 (Task Dashboard) - **DONE**
- Backend PATCH /api/tasks/:id - **EXISTS**

---

## Dev Agent Record

### Agent Model Used

Gemini 2.5
