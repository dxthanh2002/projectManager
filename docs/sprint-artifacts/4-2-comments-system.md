# Story 4.2: Comments System

Status: done

## Story

As a **User** (Member or Manager),
I want to **add and view comments on tasks**,
So that **I can communicate blockers, provide context, and collaborate with my team**.

## Acceptance Criteria

1. **AC1**: Given I am viewing a task detail, When I look at the comments section, Then I see all existing comments in chronological order with author name and timestamp.
2. **AC2**: Given I am a team member viewing a task, When I type a comment and click submit, Then the comment appears in the list immediately with my name and current timestamp.
3. **AC3**: Given I am the comment author, When I click edit on my comment, Then I can modify the content and save changes.
4. **AC4**: Given I am the comment author OR team manager, When I click delete on a comment, Then the comment is removed from the list.
5. **AC5**: Given a task has comments, When the task is deleted, Then all associated comments are cascade-deleted (backend already handles this).

## Tasks / Subtasks

### Task 1: Frontend API Service Layer (AC: #1, #2, #3, #4)
- [x] Add `fetchTaskCommentsAPI(taskId: string)` to `api.ts`
- [x] Add `createCommentAPI(taskId: string, content: string)` to `api.ts`
- [x] Add `updateCommentAPI(commentId: string, content: string)` to `api.ts`
- [x] Add `deleteCommentAPI(commentId: string)` to `api.ts`
- [x] Define `IComment` interface in `modal.d.ts`

### Task 2: Pinia Store for Comments (AC: #1, #2, #3, #4)
- [x] Create `frontend/src/store/useCommentStore.ts`
- [x] Implement state: `comments: IComment[]`, `loading: boolean`, `error: string | null`
- [x] Implement `fetchComments(taskId)` action
- [x] Implement `addComment(taskId, content)` action with optimistic UI
- [x] Implement `updateComment(commentId, content)` action
- [x] Implement `deleteComment(commentId)` action
- [x] Implement `clearComments()` action for cleanup

### Task 3: Comment List Component (AC: #1, #2)
- [x] Create `frontend/src/components/comments/CommentList.vue`
- [x] Props: `taskId: string`
- [x] Display loading spinner while fetching
- [x] Display "No comments yet" empty state
- [x] Render list of CommentItem components
- [x] Add new comment form at bottom with textarea + submit button
- [x] Disable submit when content is empty
- [x] Clear textarea after successful submit

### Task 4: Comment Item Component (AC: #1, #3, #4)
- [x] Create `frontend/src/components/comments/CommentItem.vue`
- [x] Props: `comment: IComment`, `currentUserId: string`, `isManager: boolean`
- [x] Display author name, timestamp (relative time like "2 hours ago"), content
- [x] Show edit button only if current user is author
- [x] Show delete button if current user is author OR isManager
- [x] Implement inline edit mode with save/cancel buttons
- [x] Implement delete confirmation

### Task 5: Integration with Task Detail (AC: #1, #2, #3, #4, #5)
- [x] Import and use CommentList in task detail view/modal
- [x] Pass taskId prop to CommentList
- [x] Fetch comments when task detail is opened
- [x] Clear comments when task detail closes

## Dev Notes

### Backend Implementation Status: ✅ COMPLETE
The backend for comments is **already fully implemented** in previous work:
- **Routes**: `backend/src/routes/comments.js`
  - `GET /api/tasks/:taskId/comments` - List comments with author info
  - `POST /api/tasks/:taskId/comments` - Create comment (team member only)
  - `PATCH /api/comments/:id` - Update comment (author only)
  - `DELETE /api/comments/:id` - Delete comment (author or manager)
- **Schema**: `backend/src/schema/comments.ts` - Drizzle schema with proper indexes
- **Validators**: `backend/src/validators/comment.validators.js` - Zod schemas ready

### Comment Response Shape (from backend)
```typescript
interface IComment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
}
```

### Architecture Compliance

- **Store Pattern**: Use Pinia setup stores (consistent with existing `useTaskStore`, `useTeamStore`)
- **Component Location**: `frontend/src/components/comments/`
- **Styling**: TailwindCSS (consistent with existing components)
- **API Layer**: All HTTP calls via `frontend/src/services/api.ts` using axios

### File Structure Requirements

```
frontend/src/
├── components/
│   └── comments/
│       ├── CommentList.vue      # [NEW]
│       └── CommentItem.vue      # [NEW]
├── store/
│   └── useCommentStore.ts       # [NEW]
├── services/
│   └── api.ts                   # [MODIFY] Add comment API functions
└── types/
    └── modal.d.ts               # [MODIFY] Add IComment interface
```

### Testing Requirements

1. **Manual Testing**:
   - Create a comment as team member → verify it appears immediately
   - Edit own comment → verify content updates
   - Delete own comment → verify removal
   - As manager, delete another user's comment → verify allowed
   - As member, try to delete another user's comment → verify forbidden

2. **API Testing** (via browser console or REST client):
   ```bash
   # List comments
   GET /api/tasks/{taskId}/comments
   
   # Create comment
   POST /api/tasks/{taskId}/comments
   Content-Type: application/json
   {"content": "Test comment"}
   
   # Update comment
   PATCH /api/comments/{commentId}
   Content-Type: application/json
   {"content": "Updated content"}
   
   # Delete comment
   DELETE /api/comments/{commentId}
   ```

### Previous Story Intelligence

- Story 4-1 implemented status transitions with blocker validation
- The blocker workflow requires a comment when status changes to "blocked"
- This story completes the comments UI that 4-1 partially relies on
- Follow existing patterns from `useTaskStore` for store implementation

### Library/Framework Requirements

| Dependency | Version | Purpose |
|------------|---------|---------|
| Vue 3 | ^3.x | Component framework |
| Pinia | ^2.x | State management |
| axios | existing | HTTP client |
| TailwindCSS | existing | Styling |
| dayjs or date-fns | (add if needed) | Relative time formatting |

> **Note**: If relative time formatting is needed (e.g., "2 hours ago"), use `dayjs` with `relativeTime` plugin or `date-fns/formatDistanceToNow`.

### References

- [Source: docs/prd.md#FR11-FR12] - Users can add/view comments
- [Source: docs/architecture.md#Real-Time Communication] - WebSocket events for `comment:added`
- [Source: docs/data-models.md#Comment Table] - Database schema
- [Source: backend/src/routes/comments.js] - Complete API implementation

---

## Dev Agent Record

### Context Reference

Story 4-2: Comments System - Frontend Implementation (backend was already complete)

### Agent Model Used

Gemini 2.5 Pro (Dev Agent - Amelia)

### Debug Log References

- TypeScript compilation: `vue-tsc --noEmit` passed with no errors

### Completion Notes List

- Backend already fully implemented in `backend/src/routes/comments.js`
- Added 4 comment API functions to `api.ts`
- Added `IComment` interface to `modal.d.ts`
- Created `useCommentStore.ts` with optimistic UI updates and rollback on error
- Created `CommentList.vue` with loading, empty state, and comment form
- Created `CommentItem.vue` with relative time, edit/delete actions, permission checks
- Integrated CommentList into TaskListView.vue task detail modal
- Used `authClient.useSession()` for current user ID (consistent with existing pattern)

### File List

- `frontend/src/types/modal.d.ts` - Added `IComment` interface
- `frontend/src/services/api.ts` - Added 4 comment API functions
- `frontend/src/store/useCommentStore.ts` - New Pinia store for comments
- `frontend/src/components/comments/CommentList.vue` - New component
- `frontend/src/components/comments/CommentItem.vue` - New component
- `frontend/src/views/TaskListView.vue` - Integrated CommentList

