# Story 8.3: In-App Notifications

Status: drafted
Epic: 8 - Mobile Task Execution & Communication
Created: 2025-12-26
Author: Bob (Scrum Master)

---

## Story

**As a** User,
**I want** to receive alerts for important events,
**So that** I don't miss task assignments or resolved blockers.

---

## Acceptance Criteria

1. **AC1:** `react-native-toast-message` integration for in-app toasts
2. **AC2:** Notification list screen showing history of recent alerts
3. **AC3:** Tapping a notification navigates directly to the task
4. **AC4:** Loading state and empty state for notifications (FR33, FR30)
5. **AC5:** Error handling with toast (FR37)

---

## Tasks / Subtasks

### Task 1: Notifications API Hook

- [ ] 1.1 Create `useNotifications` query hook
  - Endpoint: GET /api/notifications
  - Returns: Notification[] array

- [ ] 1.2 Create `useMarkAsRead` mutation hook
  - Endpoint: PATCH /api/notifications/:id/read

### Task 2: Notification Item Component

- [ ] 2.1 Create `src/components/NotificationItem.tsx`
  - Icon per notification type
  - Title + description
  - Relative timestamp
  - Unread indicator dot

### Task 3: Notifications Screen

- [ ] 3.1 Update `app/(tabs)/notifications.tsx`
  - FlatList of NotificationItem
  - Pull-to-refresh
  - Empty state: "Tất cả đã đọc! 🎉"

### Task 4: Navigation to Task

- [ ] 4.1 On notification tap, navigate to task
  - Open TaskDetailSheet with task ID
  - Mark notification as read

---

## Dev Notes

### Files to Create/Update

```
mobile/src/
├── hooks/
│   └── use-notifications.ts     # NEW
├── components/
│   └── NotificationItem.tsx     # NEW
└── app/(tabs)/
    └── notifications.tsx        # UPDATE
```

### Dependencies

- Story 8-1 (Task Detail) - **DONE**
- Toast already integrated in _layout.tsx
