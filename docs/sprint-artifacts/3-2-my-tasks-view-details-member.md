# Story 3.2: My Tasks View & Details (Member)

**Epic:** 3 - Task Management Core  
**Status:** done  
**Story ID:** 3.2  
**Story Key:** 3-2-my-tasks-view-details-member

## Story

**As a** Member,  
**I want** to see tasks assigned to me,  
**So that** I know what to work on.

## Acceptance Criteria

### AC1: My Tasks Filter
**Given** I am logged in,  
**When** I view "My Tasks",  
**Then** I see a list of tasks where `assignee_id = me`

### AC2: Task Details View
**Given** I am viewing the task list,  
**When** I click a task,  
**Then** I see full details: Title, Description, Due Date, Priority, Status, Assignee

## Tasks / Subtasks

### Backend (ALREADY COMPLETE ✅)

> [!NOTE]
> API already supports `?assigneeId=userId` filter in GET `/api/teams/:teamId/tasks`

### Frontend Implementation

- [ ] **Task 1: Add "My Tasks" Filter Toggle**
  - [ ] Subtask 1.1: Add "My Tasks" checkbox/toggle in TaskListView
  - [ ] Subtask 1.2: When checked, filter by `assigneeId = currentUser.id`
  - [ ] Subtask 1.3: Get current user from auth store

- [ ] **Task 2: Add Task Detail Modal**
  - [ ] Subtask 2.1: Create task detail modal in TaskListView
  - [ ] Subtask 2.2: Show all task fields: title, description, status, priority, due date, assignee, created date
  - [ ] Subtask 2.3: Open modal when clicking task card

### Testing

- [ ] **Task 3: Manual Testing**
  - [ ] Subtask 3.1: Toggle "My Tasks" filter and verify only assigned tasks show
  - [ ] Subtask 3.2: Click task card to open details modal

---

## Agent Records

| Date | Agent | Action |
|------|-------|--------|
| 2025-12-17 | Dev (Amelia) | Created story file |
