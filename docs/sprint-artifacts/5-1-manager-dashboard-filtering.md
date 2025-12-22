# Story 5.1: Manager Dashboard & Filtering

Status: done

## Story

**As a** Manager,
**I want** to view and filter all team tasks,
**So that** I can manage workload.

## Acceptance Criteria

1. **AC1**: Given I am a Manager, When I view Dashboard, Then I see all tasks for my team.
2. **AC2**: When I filter by status (e.g., "Blocked"), Then only tasks with that status show.
3. **AC3**: When I filter by team member, Then only that member's tasks show.

## Tasks / Subtasks

### Task 1: Add Assignee Filter to TaskListView (AC: #3)
- [ ] Add `assigneeFilter` ref to TaskListView.vue
- [ ] Add assignee dropdown UI with team members list
- [ ] Wire up watcher to include assigneeId in API call

## Dev Notes

### Current State Analysis

**Already Implemented:**
- ✅ Backend API: `GET /api/teams/:teamId/tasks?status=...&assigneeId=...&priority=...`
- ✅ Store: `fetchTasks(teamId, filters)` accepts { status, priority, assigneeId }
- ✅ UI: Status filter dropdown (todo, in_progress, done, blocked)
- ✅ UI: Priority filter dropdown (high, medium, low)
- ✅ Team members fetched on mount (`teamStore.fetchTeamMembers`)

**Missing:**
- ❌ Assignee filter dropdown in TaskListView UI

### Implementation

**File to modify:** `frontend/src/views/TaskListView.vue`

**Changes:**
1. Add `assigneeFilter` ref (line ~76)
2. Add to watcher (line ~86)
3. Add assignee select dropdown in UI (line ~325)

### FRs Covered

- FR13: Managers view team dashboard ✅
- FR14: Filter tasks by status ✅
- FR15: Filter tasks by assigned member ❌ (to implement)
- FR17: Members filter their tasks by status ✅
