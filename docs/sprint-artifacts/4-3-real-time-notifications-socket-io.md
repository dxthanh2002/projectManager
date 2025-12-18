# Story 4.3: Real-Time Notifications (Socket.io)

Status: ready-for-dev

## Story

As a **User** (Member or Manager),
I want to **see updates instantly without refreshing**,
So that **I can react quickly to task assignments, status changes, and comments**.

## Acceptance Criteria

1. **AC1**: Given Manager assigns me a task, When I am online, Then I see a "New Task Assigned" toast notification immediately.
2. **AC2**: Given Member marks their task "Blocked", When Manager is online, Then they see a "Task Blocked" alert with task title.
3. **AC3**: Given Member marks their task "Done", When Manager is online, Then they see a "Task Completed" notification.
4. **AC4**: Given a user adds a comment to a task, When other team members are online, Then they see a "New Comment" notification.
5. **AC5**: Given I am viewing a task list, When another user updates a task status, Then the task card reflects the new status without manual refresh.

## Tasks / Subtasks

### Task 1: Backend - Socket.io Server Setup (AC: #1, #2, #3, #4, #5)
- [ ] Install `socket.io` package in backend
- [ ] Create `backend/src/lib/socket.js` to initialize Socket.io server
- [ ] Integrate Socket.io with Express server in `server.js`
- [ ] Implement session authentication for socket connections using `better-auth` cookies
- [ ] Implement `team:{teamId}` room joining on successful connection

### Task 2: Backend - Emit Events on Task Actions (AC: #1, #2, #3, #5)
- [ ] Emit `task:assigned` event when task is created with assignee (in `tasks.js`)
- [ ] Emit `task:status_changed` event when task status is updated (in `tasks.js`)
- [ ] Ensure events are emitted to correct team room only

### Task 3: Backend - Emit Events on Comment Actions (AC: #4)
- [ ] Emit `comment:added` event when comment is created (in `comments.js`)
- [ ] Include task title in payload for notification context

### Task 4: Frontend - Socket.io Client Setup (AC: #1, #2, #3, #4, #5)
- [ ] Install `socket.io-client` package in frontend
- [ ] Create `frontend/src/lib/socket.ts` with connection management
- [ ] Connect socket on successful login, disconnect on logout
- [ ] Join team room when team context changes

### Task 5: Frontend - useUIStore for Notifications (AC: #1, #2, #3, #4)
- [ ] Create `frontend/src/store/useUIStore.ts`
- [ ] Implement toast notification queue state
- [ ] Implement `showToast(type, title, message)` action
- [ ] Implement toast auto-dismiss after 5 seconds

### Task 6: Frontend - Event Listeners & Toast Display (AC: #1, #2, #3, #4)
- [ ] Listen for `task:assigned` event → show toast if assignee is current user
- [ ] Listen for `task:status_changed` event → show toast for blocked/done if user is manager or assignee
- [ ] Listen for `comment:added` event → show toast if task is visible
- [ ] Create `ToastContainer.vue` component for displaying notifications

### Task 7: Frontend - Real-Time Task List Updates (AC: #5)
- [ ] Listen for `task:status_changed` event in `useTaskStore`
- [ ] Update task status in store without refetching
- [ ] Listen for `task:assigned` event → add task to list if assignee is current user

## Dev Notes

### Backend Implementation Status: 🔴 NOT STARTED
- Server uses plain Express (`server.js`) with NO Socket.io
- TODO comments exist in `tasks.js:344` and `comments.js:131` for WebSocket events
- Need full Socket.io integration from scratch

### Architecture Requirements (from docs/architecture.md)

**Event Taxonomy:**
| Event Name | Direction | Payload | Trigger |
|:---|:---|:---|:---|
| `task:assigned` | Server → Client | `{ taskId, title, assigneeId, assignedBy }` | Manager creates/assigns task |
| `task:status_changed` | Server → Client | `{ taskId, newStatus, userId, teamId }` | Member updates status |
| `comment:added` | Server → Client | `{ taskId, commentId, text, authorName }` | User adds comment |
| `team:member_added` | Server → Client | `{ teamId, user }` | Manager adds member |

**Room Strategy:**
- Clients join rooms based on Team IDs: `team:{teamId}`
- Events emitted to specific rooms for data privacy
- `socket.join('team:' + teamId)` on connection

**Authentication:**
- Reuse `better-auth` session cookies
- Validate session from cookie header during handshake

### Frontend Architecture Requirements

- **`useUIStore`**: Toast notifications, active modals (from architecture.md)
- **Store Integration**: Stores subscribe to Socket.io events
- **Optimistic Updates**: On `task:status_changed`, update task object immediately without refetching

### File Structure Requirements

```
backend/src/
├── lib/
│   └── socket.js              # [NEW] Socket.io server setup
├── server.js                  # [MODIFY] Integrate socket server
├── routes/
│   ├── tasks.js               # [MODIFY] Emit socket events
│   └── comments.js            # [MODIFY] Emit socket events

frontend/src/
├── lib/
│   └── socket.ts              # [NEW] Socket.io client
├── store/
│   └── useUIStore.ts          # [NEW] Toast notification store
├── components/
│   └── ToastContainer.vue     # [NEW] Toast notification UI
├── App.vue                    # [MODIFY] Mount ToastContainer
```

### Related Functional Requirements

- **FR22**: Members receive real-time notification when a new task is assigned to them
- **FR23**: Managers receive real-time notification when a task status changes to Blocked
- **FR24**: Managers receive real-time notification when a task status changes to Done
- **FR25**: Users receive real-time notification when a comment is added to a task they are involved with

### Testing Requirements

1. **Manual Testing - Task Assignment:**
   - Open two browser windows with different users (Manager and Member)
   - Manager creates task and assigns to Member
   - Member should see toast notification immediately

2. **Manual Testing - Status Change:**
   - Member updates task to "Blocked"
   - Manager should see "Task Blocked" alert

3. **Manual Testing - Comments:**
   - One user adds comment on task
   - Other team members should see notification

4. **API Testing (via browser console):**
   ```javascript
   // Check socket connection
   console.log(window.socket?.connected)
   ```

### Previous Story Intelligence

- Story 4-1 implemented status transitions with blocker validation
- Story 4-2 implemented comments system (CRUD complete)
- Backend routes are ready for Socket.io integration (TODO comments in place)
- Frontend stores use Pinia with Options API pattern

### Library/Framework Requirements

| Dependency | Version | Location | Purpose |
|------------|---------|----------|---------|
| socket.io | ^4.x | backend | WebSocket server |
| socket.io-client | ^4.x | frontend | WebSocket client |

### References

- [Source: docs/architecture.md#Real-Time Communication] - Socket.io implementation details
- [Source: docs/prd.md#FR22-FR25] - Real-time notification requirements
- [Source: docs/epics.md#Story 4.3] - Story definition

---

## Dev Agent Record

### Context Reference

Story 4-3: Real-Time Notifications - Full Stack Socket.io Implementation

### Agent Model Used

Gemini 2.5 Pro (SM Agent - Bob, YOLO mode)

### Debug Log References

### Completion Notes List

### File List

<!-- Files will be added by dev agent during implementation -->
