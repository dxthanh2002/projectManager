# Story 2.2: Member Invitation & Management

**Epic:** 2 - Team Management (Multi-Tenancy)  
**Status:** done  
**Story ID:** 2.2  
**Story Key:** 2-2-member-invitation-management

## Story

**As a** Manager,  
**I want** to add and remove members from my team,  
**So that** I can build my team and control who has access to our tasks.

## Acceptance Criteria

### AC1: Add Member to Team
**Given** I am a Manager of Team A,  
**When** I add user "dave@example.com" to the team,  
**Then**:
- If the user exists in the system, they are added to `user_team` table with role `'member'`
- The team members list refreshes showing the new member
- The API returns 201 Created with the new member details
- **Security:** The `requireManagerRole` middleware validates I am a manager before allowing the action

### AC2: Remove Member from Team
**Given** I am a Manager of Team A,  
**When** I remove a member from the team,  
**Then**:
- The member is removed from the `user_team` table
- They lose access to Team A's tasks immediately
- The team members list updates to reflect the removal
- **Security:** Only managers can remove members

### AC3: View Team Members
**Given** I am a member (or manager) of Team A,  
**When** I view the team members list,  
**Then**:
- I see all members with their names, emails, and roles
- The list is fetched from `/api/teams/:teamId/members`

### AC4: Validation & Error Handling
**Given** I attempt to add a member,  
**When** the user email doesn't exist in the system,  
**Then** the API returns 404 with error message "User not found"

**Given** I attempt to add a member who is already in the team,  
**Then** the API returns 409 with error message "User is already a member of this team"

## Tasks / Subtasks

### Backend Implementation

- [ ] **Task 1: Implement POST `/api/teams/:teamId/members` endpoint** (AC: #1, #4)
  - [ ] Subtask 1.1: Add route to **existing** `src/routes/team-members.js` (file already exists)
  - [ ] Subtask 1.2: Apply middleware chain: `requireAuth` → `requireTeamMembership` → `requireManagerRole`
  - [ ] Subtask 1.3: Create Zod validation schema in `src/validators/team.validators.js`:
    - Required field: `email` (string, email format)
    - Default role: `'member'`
  - [ ] Subtask 1.4: Implement business logic:
    - Import user table from **better-auth schema**: `import { user } from '../schema/auth.js';`
    - Look up user by email: `db.select().from(user).where(eq(user.email, email))`
    - If user not found, return 404
    - Check if user already in `user_team` for this `teamId`
    - If exists, return 409
    - **Generate UUID**: `import { randomUUID } from 'crypto';`
    - Insert with UUID and joined_at: `{ id: randomUUID(), teamId, userId, role: 'member', joinedAt: new Date() }`
    - Return 201 with member details
  - [ ] Subtask 1.5: Add error handling for database constraints

- [ ] **Task 2: Create DELETE `/api/teams/:teamId/members/:userId` endpoint** (AC: #2)
  - [ ] Subtask 2.1: Add route in `src/routes/team-members.js`
  - [ ] Subtask 2.2: Apply middleware chain: `requireAuth` → `requireTeamMembership` → `requireManagerRole`
  - [ ] Subtask 2.3: Implement business logic:
    - Verify the target user is actually a member of the team
    - Delete from `user_team` table where `team_id = :teamId AND user_id = :userId`
    - Return 204 No Content on success
    - Return 404 if user is not a member
  - [ ] Subtask 2.4: Add validation to prevent removing the last manager (optional enhancement)

- [ ] **Task 3: Implement GET `/api/teams/:teamId/members` endpoint** (AC: #3)
  - [ ] Subtask 3.1: Add route to **existing** `src/routes/team-members.js`
  - [ ] Subtask 3.2: Apply middleware: `requireAuth` → `requireTeamMembership`
  - [ ] Subtask 3.3: Implement query:
    - Join `user_team` with `user` table (from `auth.js`)
    - Filter by `team_id = :teamId`
    - Select: user id, name, email, role, joined_at
  - [ ] Subtask 3.4: Return **exact response schema**:
    ```json
    [
      { "id": "uuid", "name": "string", "email": "string", "role": "manager|member", "joinedAt": "ISO-8601" }
    ]
    ```

### Frontend Implementation

- [ ] **Task 4: Create Team Members Management UI** (AC: #1, #2, #3)
  - [ ] Subtask 4.1: Create `TeamMembersView.vue` component in `src/views/`
  - [ ] Subtask 4.2: Add protected route in `src/router/index.ts`:
    ```typescript
    {
      path: '/teams/:teamId/members',
      component: TeamMembersView,
      meta: { requiresAuth: true, requiresTeamMembership: true }
    }
    ```
  - [ ] Subtask 4.3: Implement member list using **shadcn-vue** components:
    - Use `Table` component for member list display
    - Show columns: Name, Email, Role, Joined Date
    - Use `Button` for "Add Member" (visible only for managers)
    - Use `Button variant="destructive"` for "Remove" (managers only)
  - [ ] Subtask 4.4: Create "Add Member" modal using **shadcn-vue Dialog**:
    - Use `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`
    - Use `Input` for email field with validation
    - Use `Button` for submit
    - Show success `Toast` on 201
    - Refresh member list after successful add
  - [ ] Subtask 4.5: Implement remove member action:
    - Use `AlertDialog` for confirmation before removal
    - Call `DELETE /api/teams/:teamId/members/:userId`
    - Show success `Toast` on 204
    - Refresh member list after successful removal
  - [ ] Subtask 4.6: Add error handling:
    - Display error `Toast` for 404 (user not found)
    - Display error `Toast` for 409 (already a member)
    - Display error `Toast` for 403 (not a manager)

- [ ] **Task 5: Update `useTeamStore` (Pinia)** (AC: #1, #2, #3)
  - [ ] Subtask 5.1: Add `fetchTeamMembers(teamId)` action
  - [ ] Subtask 5.2: Add `addTeamMember(teamId, email)` action
  - [ ] Subtask 5.3: Add `removeTeamMember(teamId, userId)` action
  - [ ] Subtask 5.4: Store members in state: `members: Record<teamId, Member[]>`
  - [ ] Subtask 5.5: Add computed property `currentTeamMembers` based on active team

### Testing

- [ ] **Task 6: Backend API Tests**
  - [ ] Subtask 6.1: Test POST `/api/teams/:teamId/members` with valid email
  - [ ] Subtask 6.2: Test POST with non-existent email (expect 404)
  - [ ] Subtask 6.3: Test POST with duplicate member (expect 409)
  - [ ] Subtask 6.4: Test POST without manager role (expect 403)
  - [ ] Subtask 6.5: Test DELETE `/api/teams/:teamId/members/:userId` as manager
  - [ ] Subtask 6.6: Test DELETE without manager role (expect 403)
  - [ ] Subtask 6.7: Test GET `/api/teams/:teamId/members` as member

- [ ] **Task 7: Frontend Integration Tests**
  - [ ] Subtask 7.1: Test adding member via UI
  - [ ] Subtask 7.2: Test removing member via UI
  - [ ] Subtask 7.3: Test error states (404, 409, 403)
  - [ ] Subtask 7.4: Verify member list updates after add/remove

## Dev Notes

### Architecture Compliance

**Source:** [docs/architecture.md#Architecture Decision: Self-Service Team Model]

This story implements the **team-scoped multi-tenancy architecture** defined in the architecture document:

1. **Database Schema:**
   - Uses existing `user_team` junction table with `role` field ('manager' | 'member')
   - Team-scoped access control via `team_id` foreign key
   - Composite indexes on `(team_id, user_id)` for efficient lookups

2. **Authorization Middleware Chain:**
   - `requireAuth`: Validates better-auth session
   - `requireTeamMembership`: Checks user is member of team (via `teamId` param)
   - `requireManagerRole`: Checks `req.teamRole === 'manager'`

**Source:** [docs/architecture.md#Architecture Decision: Middleware & Validation Strategy]

3. **Validation Pattern:**
   - Use Zod schemas in `src/validators/team.validators.js`
   - Apply `validate(schema)` middleware to POST routes
   - Strict typing with `.strict()` to strip unknown keys

4. **Error Handling:**
   - Follow standardized error response format: `{ error: "CODE", message: "description" }`
   - HTTP status codes: 400 (validation), 401 (auth), 403 (authorization), 404 (not found), 409 (conflict), 500 (server error)

### Backend Implementation Details

**Source:** [docs/architecture-backend.md#API Design]

**Existing Endpoints to Reference:**
- The team members endpoints are already defined in the architecture
- Follow the same pattern as `src/routes/teams.js` for consistency

**File Structure:**
```
backend/src/
├── routes/
│   └── team-members.js  # EXISTING FILE - add new endpoints here
├── validators/
│   └── team.validators.js  # Add member validation schemas
└── middleware/
    └── auth.js  # Use existing middleware
```

**Drizzle ORM Patterns:**
```javascript
// CRITICAL: Import user from better-auth schema, NOT index.js
import { db } from '../lib/db.js';
import { user } from '../schema/auth.js';  // User table managed by better-auth
import { userTeam } from '../schema/index.js';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';  // For UUID generation

// Find user by email
const [existingUser] = await db.select().from(user).where(eq(user.email, email)).limit(1);
if (!existingUser) return res.status(404).json({ error: 'NOT_FOUND', message: 'User not found' });

// Check if already a member
const [existing] = await db.select().from(userTeam)
  .where(and(eq(userTeam.teamId, teamId), eq(userTeam.userId, existingUser.id)))
  .limit(1);
if (existing) return res.status(409).json({ error: 'CONFLICT', message: 'User is already a member' });

// Insert with UUID and joined_at
await db.insert(userTeam).values({
  id: randomUUID(),
  teamId,
  userId: existingUser.id,
  role: 'member',
  joinedAt: new Date()
});
```

**Source:** [docs/architecture-backend.md#Authorization Middleware]

**Middleware Usage:**
```javascript
import { requireAuth, requireTeamMembership, requireManagerRole } from '../middleware/auth.js';

router.post('/teams/:teamId/members',
  requireAuth,
  requireTeamMembership,
  requireManagerRole,
  validate(addMemberSchema),
  addMemberHandler
);
```

### Frontend Implementation Details

**Source:** [docs/architecture.md#Architecture Decision: Frontend State Management]

**Pinia Store Pattern:**
```typescript
// src/store/useTeamStore.ts
export const useTeamStore = defineStore('team', () => {
  const members = ref<Record<string, Member[]>>({});
  
  async function fetchTeamMembers(teamId: string) {
    const response = await axios.get(`/api/teams/${teamId}/members`);
    members.value[teamId] = response.data;
  }
  
  async function addTeamMember(teamId: string, email: string) {
    await axios.post(`/api/teams/${teamId}/members`, { email });
    await fetchTeamMembers(teamId); // Refresh list
  }
  
  async function removeTeamMember(teamId: string, userId: string) {
    await axios.delete(`/api/teams/${teamId}/members/${userId}`);
    await fetchTeamMembers(teamId); // Refresh list
  }
  
  return { members, fetchTeamMembers, addTeamMember, removeTeamMember };
});
```

**Component Structure (shadcn-vue):**
```
frontend/src/
├── views/
│   └── TeamMembersView.vue  # Main members management page
├── components/
│   ├── ui/                  # shadcn-vue components (auto-generated)
│   │   ├── table/           # Table, TableHeader, TableRow, etc.
│   │   ├── dialog/          # Dialog, DialogTrigger, DialogContent
│   │   ├── alert-dialog/    # AlertDialog for confirmations
│   │   ├── button/          # Button with variants
│   │   ├── input/           # Form input
│   │   └── toast/           # Toast notifications
│   └── members/
│       └── AddMemberDialog.vue  # Dialog wrapper for adding members
└── store/
    └── useTeamStore.ts      # Update with member actions
```

### Previous Story Intelligence

**Source:** [docs/sprint-artifacts/2-1-team-creation-manager-promotion.md]

**Learnings from Story 2.1:**
- Team creation uses transactional inserts (team → user_team)
- Zod validation is applied via `validate()` middleware
- Frontend uses `useTeamStore` for team state management
- API follows pattern: POST `/api/teams` with auth middleware

**Patterns to Reuse:**
- Same middleware chain pattern (`requireAuth` → `requireTeamMembership` → `requireManagerRole`)
- Same Zod validation approach
- Same Pinia store pattern for state management
- Same error handling format

### Security Considerations

1. **Authorization:**
   - Only managers can add/remove members
   - All endpoints require team membership verification
   - Prevent users from adding themselves to teams they don't manage

2. **Validation:**
   - Validate email format using Zod
   - Prevent duplicate member additions (409 Conflict)
   - Verify user exists before adding (404 Not Found)

3. **Data Privacy:**
   - Only team members can view the members list
   - User data (email, name) only exposed to team members

### Testing Requirements

**Backend Tests:**
- Use existing test patterns from Story 1.1 and 1.2
- Test all middleware chains
- Test error cases (404, 409, 403)
- Verify database state after operations

**Frontend Tests:**
- Test Pinia store actions
- Test component rendering
- Test error handling and toast notifications
- Test manager-only UI elements

### Covered Functional Requirements

- **FR19:** Managers can add a new team member to their team by email or username
- **FR20:** Managers can view a list of all members in their team(s)
- **FR21:** Managers can remove a team member from their team(s)

## Dev Agent Record

### Context Reference

Story created with comprehensive context analysis from:
- Epic 2 requirements (docs/epics.md)
- Architecture decisions (docs/architecture.md)
- Backend architecture (docs/architecture-backend.md)
- Previous story learnings (docs/sprint-artifacts/2-1-team-creation-manager-promotion.md)

### Agent Model Used

Claude 3.5 Sonnet (via Bob, Scrum Master Agent)

### Completion Notes

- [ ] Backend endpoints implemented and tested
- [ ] Frontend UI implemented and tested
- [ ] Pinia store updated with member management actions
- [ ] All acceptance criteria validated
- [ ] Error handling verified
- [ ] Security middleware validated

### File List

**Backend Files:**
- `src/routes/team-members.js` (create or update)
- `src/validators/team.validators.js` (update)
- `src/middleware/auth.js` (existing, reuse)

**Frontend Files:**
- `src/views/TeamMembersView.vue` (create)
- `src/components/AddMemberModal.vue` (create)
- `src/components/MemberList.vue` (create)
- `src/store/useTeamStore.ts` (update)
- `src/router/index.ts` (update)

**Test Files:**
- `backend/tests/team-members.test.js` (create)
- `frontend/tests/TeamMembersView.spec.ts` (create)
