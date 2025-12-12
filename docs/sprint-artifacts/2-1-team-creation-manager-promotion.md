# Story 2.1: Team Creation & Manager Promotion

**Goal:** Allow users to create self-service teams and manage membership, establishing the boundaries for task delegation.

## User Story
**As a** Member,
**I want** to create a new team,
**So that** I can become a Manager and start assigning tasks.

## Acceptance Criteria
- **Given** I am a logged-in user, **When** I create a team "Engineering", **Then**:
  - A new `team` record is created.
  - I am added to `user_team` with role `'manager'`.
  - The UI updates to show the new team context.
- **And** the backend validates `name` is required (Zod).

## Technical Notes
- **API:** `POST /api/teams`
- **Validation:** Zod schema for team creation (name required).
- **Database:** Transactional insert:
    1.  Insert into `teams` table.
    2.  Insert into `team_members` (or `user_teams`) table with `role='manager'`.
- **Frontend:**
    -   New view or modal for "Create Team".
    -   Update state/store with new team context upon success.

## Dependencies
- Authentication (Completed)
- Database Schema (Existing)
