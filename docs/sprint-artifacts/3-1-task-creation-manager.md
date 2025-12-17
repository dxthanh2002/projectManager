# Story 3.1: Task Creation (Manager)

**Epic:** 3 - Task Management Core  
**Status:** done  
**Story ID:** 3.1  
**Story Key:** 3-1-task-creation-manager

## Story

**As a** Manager,  
**I want** to create and assign tasks,  
**So that** I can delegate work to my team.

## Acceptance Criteria

### AC1: Create Task with All Fields
**Given** I am a Manager of Team A,  
**When** I create a task with Title, Description, Assignee, Priority, Due Date,  
**Then**:
- Task is saved with `team_id`, `created_by`, `assignee_id`
- API returns 201 Created with task details
- Task appears in the team task list

### AC2: Validation & Error Handling
**Given** I attempt to create a task,  
**When** title is empty or assignee is not a team member,  
**Then**:
- API returns 400 with validation error message
- Frontend displays appropriate error toast

### AC3: Assignee Selection
**Given** I am creating a task,  
**When** I select an assignee,  
**Then** I can only choose from team members of Team A

### AC4: Task List View
**Given** I am a member of Team A,  
**When** I view the team tasks,  
**Then** I see all tasks filtered by team with status, priority, and assignee info

## Tasks / Subtasks

### Backend Implementation (ALREADY COMPLETE ✅)

> [!NOTE]
> Backend endpoints are already fully implemented in `src/routes/tasks.js`. No backend work needed.

- [x] **Task 1: POST `/api/teams/:teamId/tasks`** - Already implemented
- [x] **Task 2: GET `/api/teams/:teamId/tasks`** - Already implemented  
- [x] **Task 3: Zod validation schemas** - Already in `task.validators.js`

### Frontend Implementation (FOCUS)

- [ ] **Task 4: Create Task Store (Pinia)**
  - [ ] Subtask 4.1: Create `src/store/useTaskStore.ts`
  - [ ] Subtask 4.2: Add state: `tasks: Record<teamId, ITask[]>`
  - [ ] Subtask 4.3: Add actions: `fetchTasks(teamId)`, `createTask(teamId, data)`
  - [ ] Subtask 4.4: Add getters: `currentTeamTasks`, `tasksByStatus`

- [ ] **Task 5: Create API Service Functions**
  - [ ] Subtask 5.1: Add to `src/services/api.ts`:
    - `fetchTeamTasksAPI(teamId)`
    - `createTaskAPI(teamId, data)`
    - `fetchTeamMembersForAssigneeAPI(teamId)` (reuse existing)

- [ ] **Task 6: Create TaskListView.vue**
  - [ ] Subtask 6.1: Create `src/views/TaskListView.vue`
  - [ ] Subtask 6.2: Display tasks in Card grid or Table
  - [ ] Subtask 6.3: Show: Title, Assignee, Status badge, Priority badge, Due Date
  - [ ] Subtask 6.4: Add "Create Task" button (managers only)
  - [ ] Subtask 6.5: Add filters: status, priority, assignee

- [ ] **Task 7: Create CreateTaskDialog.vue**
  - [ ] Subtask 7.1: Create modal with form fields:
    - Title (required)
    - Description (optional)
    - Priority (select: low/medium/high)
    - Due Date (date picker)
    - Assignee (select from team members)
  - [ ] Subtask 7.2: Form validation with error display
  - [ ] Subtask 7.3: Submit creates task and refreshes list

- [ ] **Task 8: Add Route**
  - [ ] Subtask 8.1: Add route `/teams/:teamId/tasks` in router
  - [ ] Subtask 8.2: Protected with `requiresAuth` meta

- [ ] **Task 9: Add ITask Interface**
  - [ ] Subtask 9.1: Add to `src/types/modal.d.ts`:
    ```typescript
    interface ITask {
      id: string;
      title: string;
      description: string | null;
      status: 'todo' | 'in_progress' | 'done' | 'blocked';
      priority: 'low' | 'medium' | 'high';
      dueDate: string | null;
      teamId: string;
      assigneeId: string | null;
      createdById: string;
      createdAt: string;
      assignee?: { id: string; name: string; email: string } | null;
    }
    ```

### Testing

- [ ] **Task 10: Manual Browser Testing**
  - [ ] Subtask 10.1: Navigate to `/teams/{teamId}/tasks`
  - [ ] Subtask 10.2: Create task with all fields
  - [ ] Subtask 10.3: Verify task appears in list
  - [ ] Subtask 10.4: Test validation (empty title)
  - [ ] Subtask 10.5: Verify non-manager can't see Create button

## Dev Notes

### Existing Backend Patterns (Reference)

**API Endpoints (already implemented):**
```javascript
// GET /api/teams/:teamId/tasks - List tasks with filters
// POST /api/teams/:teamId/tasks - Create task (manager only)
// Middleware: requireAuth → requireTeamMembership → requireManagerRole
```

**Response Schema:**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string|null",
  "status": "todo|in_progress|done|blocked",
  "priority": "low|medium|high",
  "dueDate": "YYYY-MM-DD|null",
  "teamId": "uuid",
  "assigneeId": "uuid|null",
  "createdById": "uuid",
  "createdAt": "ISO-8601",
  "assignee": { "id": "uuid", "name": "string", "email": "string" } | null
}
```

### Frontend Patterns (from Story 2-2)

**Store Pattern:**
```typescript
// Follow useTeamStore.ts pattern
// axios interceptor returns response.data directly
const response = await fetchTeamTasksAPI(teamId);
this.tasks[teamId] = Array.isArray(response) ? response : [];
```

**Component Pattern:**
```vue
<!-- Follow TeamMembersView.vue pattern -->
<SidebarApp>
  <!-- Header with Create button (managers only) -->
  <!-- Loading state -->
  <!-- Empty state -->
  <!-- Task cards/table -->
  <!-- Create task modal -->
</SidebarApp>
```

### UI Components Available

Use shadcn-vue components:
- `Card`, `CardHeader`, `CardContent`
- `Button`, `Input`, `Badge`
- `Select` (for priority, assignee)
- Custom date picker or native date input

### Critical Guardrails

1. **axios interceptor** returns `response.data` directly - don't access `.data` again
2. **Manager check**: Use `currentTeam?.role === 'manager'` pattern
3. **UUID generation**: Backend handles UUIDs, not needed on frontend
4. **Team-scoped**: All task APIs require `teamId` parameter

---

## Agent Records

| Date | Agent | Action |
|------|-------|--------|
| 2025-12-17 | SM (Bob) | Created story file from Epic 3 context |
