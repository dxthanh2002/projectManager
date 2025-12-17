# Story 3.3: Task Updates & Deletion

**Epic:** 3 - Task Management Core  
**Status:** ready-for-dev  
**Story ID:** 3.3  
**Story Key:** 3-3-task-updates-deletion

## Story

**As a** Manager,  
**I want** to edit or delete tasks,  
**So that** I can correct mistakes or remove stale work.

## Acceptance Criteria

### AC1: Edit Task
**Given** I am a Manager,  
**When** I edit a task title/priority/description/assignee/due date,  
**Then** the change is saved and the UI updates

### AC2: Delete Task
**Given** I am a Manager,  
**When** I delete a task,  
**Then** it is permanently removed (cascade deletes comments)

### AC3: Non-Manager Restrictions
**Given** I am a Member (not Manager),  
**Then** I cannot see Edit/Delete buttons

## Tasks / Subtasks

### Backend (ALREADY COMPLETE ✅)

> [!NOTE]
> APIs already implemented in `tasks.js`: PATCH `/api/tasks/:id`, DELETE `/api/tasks/:id`

### Frontend Implementation

- [ ] **Task 1: Add API Functions**
  - [ ] `updateTaskAPI(taskId, data)`
  - [ ] `deleteTaskAPI(taskId)`

- [ ] **Task 2: Add Store Actions**
  - [ ] `updateTask(teamId, taskId, data)` 
  - [ ] `deleteTask(teamId, taskId)`

- [ ] **Task 3: Add Edit/Delete UI**
  - [ ] Edit button in task detail modal (managers only)
  - [ ] Delete button with confirmation (managers only)
  - [ ] Edit modal with form fields

---

## Agent Records

| Date | Agent | Action |
|------|-------|--------|
| 2025-12-17 | Dev (Amelia) | Created story file |
