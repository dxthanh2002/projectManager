# Story 8.2: Real-Time Mobile Comments

Status: drafted
Epic: 8 - Mobile Task Execution & Communication
Created: 2025-12-26
Author: Bob (Scrum Master)

---

## Story

**As a** User,
**I want** to view and add comments in real-time,
**So that** I can resolve blockers or provide context.

---

## Acceptance Criteria

1. **AC1:** Comment feed implemented in task detail view
2. **AC2:** Socket.io integration for instant comment delivery
3. **AC3:** Keyboard-aware input for smooth mobile typing
4. **AC4:** Optimistic UI for comment submission (FR28)
5. **AC5:** Error handling with rollback (FR29)

---

## Tasks / Subtasks

### Task 1: Comments API Hook

- [ ] 1.1 Create `useComments` query hook
  - Endpoint: GET /api/tasks/:taskId/comments
  - Returns: Comment[] array

- [ ] 1.2 Extend `useAddComment` hook (already exists)
  - Add optimistic update

### Task 2: Comments Feed UI

- [ ] 2.1 Create `src/components/CommentItem.tsx`
  - Author avatar + name
  - Comment text
  - Timestamp (relative: "2 min ago")

- [ ] 2.2 Create `src/components/CommentsFeed.tsx`
  - FlatList of comments
  - Loading skeleton
  - Empty state: "No comments yet"

### Task 3: Comment Input

- [ ] 3.1 Create `src/components/CommentInput.tsx`
  - TextInput with send button
  - KeyboardAvoidingView
  - Disabled state while sending

### Task 4: Integration into TaskDetailSheet

- [ ] 4.1 Add Comments section to TaskDetailSheet
  - CommentsFeed component
  - CommentInput at bottom

### Task 5: Real-Time Updates (Socket.io)

- [ ] 5.1 Create `src/hooks/use-socket.ts`
  - Socket.io client connection
  - Handle reconnection

- [ ] 5.2 Listen for `comment:new` events
  - Invalidate comments query on new comment

---

## Dev Notes

### Architecture References

- Socket.io: [Source: docs/architecture-mobile.md#Decision-8]
- Optimistic UI: [Source: docs/architecture-mobile.md#Decision-9]

### Files to Create/Update

```
mobile/src/
├── components/
│   ├── CommentItem.tsx      # NEW
│   ├── CommentsFeed.tsx     # NEW
│   ├── CommentInput.tsx     # NEW
│   └── TaskDetailSheet.tsx  # UPDATE
├── hooks/
│   ├── use-comments.ts      # NEW
│   └── use-socket.ts        # NEW
```

### Dependencies

- Story 8-1 (Task Detail) - **DONE**
- Backend Socket.io - **EXISTS**
