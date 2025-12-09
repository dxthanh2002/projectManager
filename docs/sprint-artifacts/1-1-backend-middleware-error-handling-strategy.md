# Story 1.1: Backend Middleware & Error Handling Strategy

**Story ID:** 1.1  
**Epic:** 1 - Foundation & Authentication  
**Status:** ready-for-dev  
**Created:** 2025-12-09  
**Story Key:** `1-1-backend-middleware-error-handling-strategy`

---

## User Story

**As a** Developer,  
**I want** to standardize validation, authentication middleware, and error handling,  
**So that** the API is secure, consistent, and easy to debug.

---

## Business Context

This is a **foundation story** that establishes clean architectural patterns for all subsequent API development. By centralizing middleware and error handling NOW, we prevent technical debt and ensure consistent security/validation across the entire application.

**Value:** Reduces future development time, improves API consistency, enhances debuggability, and prevents security gaps.

---

## Acceptance Criteria

### AC1: Centralized Authentication Middleware

**Given** the existing codebase with inline auth middleware in `src/routes/teams.js`,  
**When** I refactor authentication logic,  
**Then** I should have a new file `src/middleware/auth.js` that exports:

- `requireAuth(req, res, next)` - Validates user session using better-auth
- `requireTeamMembership(req, res, next)` - Validates user is member of team from `req.params.teamId`
- `requireManagerRole(req, res, next)` - Validates `req.teamRole === 'manager'`

**And** all three middleware functions follow the existing error response format:
```javascript
{ error: "ERROR_CODE", message: "Human readable message" }
```

**And** the inline middleware in `src/routes/teams.js` (lines 14-60) is removed and replaced with imports from `src/middleware/auth.js`.

---

### AC2: Global Error Handler

**Given** the need for consistent error responses,  
**When** I create `src/middleware/error.js`,  
**Then** it should export a global error handler middleware that:

- Catches `ZodError` instances → Returns 400 with formatted validation errors
- Catches errors with `status` property → Returns that status code
- Catches authentication/authorization errors → Returns 401/403 appropriately  
- Catches all other errors → Returns 500 with generic message (no stack traces in production)

**And** the error handler is registered in `src/server.js` AFTER all route definitions:
```javascript
app.use(errorHandler); // Must be last middleware
```

**And** all error responses follow the standard format:
```javascript
{
  error: "ERROR_CODE",
  message: "Description",
  details?: [] // Optional, for validation errors
}
```

---

### AC3: Validation Middleware Integration

**Given** the existing `src/middleware/validate.js` is already implemented,  
**When** I verify its integration,  
**Then** I confirm:

- The `validate(schema)` factory function exists and works correctly
- It handles Zod validation errors with 400 status
- It follows the standard error response format
- **No changes needed** - this file is already correct

**And** I document in comments that future routes should use this pattern:
```javascript
router.post('/endpoint', 
  requireAuth, 
  validate(mySchema), 
  controller
);
```

---

### AC4: Route Refactoring

**Given** all centralized middleware is created,  
**When** I update existing routes,  
**Then**:

- `src/routes/teams.js` imports from `src/middleware/auth.js` instead of defining inline
- All inline middleware functions (lines 14-60) are deleted
- Route definitions use the imported middleware
- **No functional changes** - API behavior remains identical

---

## Technical Requirements

### Architecture Compliance

**Reference:** Architecture Decision "Middleware & Validation Strategy" (2025-12-09)

**MUST follow these patterns:**

1. **File Structure:**
   ```
   backend/src/middleware/
   ├── auth.js       (NEW - move from teams.js)
   ├── validate.js   (EXISTS - no changes)
   └── error.js      (NEW - create global handler)
   ```

2. **Technology Stack:**
   - **better-auth** - Already integrated, reuse `auth.api.getSession()`
   - **Zod v3.x** - Already installed, used in validate.js
   - **Drizzle ORM** - For database queries in `requireTeamMembership`

3. **Error Response Standard:**
   ```typescript
   {
     error: string;      // ERROR_CODE in SCREAMING_SNAKE_CASE
     message: string;    // Human-readable description
     details?: Array<{   // Optional, for validation errors
       field: string;
       message: string;
     }>;
   }
   ```

---

## Developer Guardrails

### 🚨 CRITICAL: What NOT to Do

1. **DO NOT** change the behavior of authentication - only move the code
2. **DO NOT** modify `validate.js` - it's already correct
3. **DO NOT** add new dependencies - use existing better-auth and Zod
4. **DO NOT** change API response formats - maintain backward compatibility
5. **DO NOT** skip the global error handler registration in server.js

---

### ✅ Implementation Checklist

**Step 1: Create `src/middleware/auth.js`**
- [ ] Copy `requireAuth` from teams.js lines 14-25
- [ ] Copy `requireTeamMembership` from teams.js lines 30-53
- [ ] Copy `requireManagerRole` from teams.js lines 58-66
- [ ] Add necessary imports: `auth`, `fromNodeHeaders`, `db`, `userTeam`, `eq`, `and`
- [ ] Export all three functions

**Step 2: Create `src/middleware/error.js`**
- [ ] Import `ZodError` from 'zod'
- [ ] Create `errorHandler(err, req, res, next)` function
- [ ] Handle ZodError → 400 with details array
- [ ] Handle errors with `err.status` property
- [ ] Handle generic errors → 500
- [ ] Export `errorHandler`

**Step 3: Update `src/server.js`**
- [ ] Import `errorHandler` from './middleware/error.js'
- [ ] Add `app.use(errorHandler)` AFTER all routes but BEFORE `app.listen()`

**Step 4: Refactor `src/routes/teams.js`**
- [ ] Import `{ requireAuth, requireTeamMembership, requireManagerRole }` from '../middleware/auth.js'
- [ ] Delete inline middleware functions (lines 14-66)
- [ ] Verify all route handlers still use the middleware correctly
- [ ] Test that routes still work identically

---

## File Locations & Patterns

### Files to CREATE:
- `backend/src/middleware/auth.js` (NEW)
- `backend/src/middleware/error.js` (NEW)

### Files to MODIFY:
- `backend/src/routes/teams.js` (refactor - remove inline middleware)
- `backend/src/server.js` (add global error handler)

### Files to VERIFY (no changes):
- `backend/src/middleware/validate.js` (already correct)

---

## Testing Requirements

### Manual Testing Checklist:

1. **Auth Middleware:**
   - [ ] GET `/api/teams` without auth → 401 UNAUTHORIZED
   - [ ] GET `/api/teams` with valid session → 200 OK

2. **Team Membership:**
   - [ ] GET `/api/teams/:teamId` as non-member → 403 FORBIDDEN
   - [ ] GET `/api/teams/:teamId` as member → 200 OK

3. **Manager Role:**
   - [ ] POST `/api/teams/:teamId/members` as member → 403 FORBIDDEN
   - [ ] POST `/api/teams/:teamId/members` as manager → 200 OK

4. **Error Handler:**
   - [ ] Trigger validation error → 400 with details array
   - [ ] Trigger auth error → 401 with standard format
   - [ ] Trigger server error → 500 with standard format

### Automated Testing:
- **Not required for this story** - This is refactoring existing functionality
- Future stories will add integration tests

---

## Dependencies

**Prerequisites:**
- None - This is the first story in Epic 1

**Blocks:**
- Story 1.2 (User Signup & Login) - Needs centralized auth middleware
- All future stories - Will use these middleware patterns

---

## Implementation Notes

### Existing Code Reference

**Current middleware location:** `backend/src/routes/teams.js` lines 14-66

**Key imports to preserve:**
```javascript
import { auth } from '../lib/auth.ts';
import { fromNodeHeaders } from 'better-auth/node';
import { db } from '../lib/db.js';
import { userTeam } from '../schema/index.ts';
import { eq, and } from 'drizzle-orm';
```

### Error Handler Pattern

```javascript
export function errorHandler(err, req, res, next) {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Handle errors with explicit status
  if (err.status) {
    return res.status(err.status).json({
      error: err.code || 'ERROR',
      message: err.message
    });
  }

  // Handle unexpected errors
  console.error('Unhandled error:', err);
  return res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred'
  });
}
```

---

## Definition of Done

- [ ] `src/middleware/auth.js` created with all three middleware functions
- [ ] `src/middleware/error.js` created with global error handler
- [ ] `src/server.js` registers global error handler
- [ ] `src/routes/teams.js` refactored to use centralized middleware
- [ ] All manual tests pass (auth, team membership, manager role, errors)
- [ ] No functional changes - API behaves identically to before
- [ ] Code follows existing patterns and conventions
- [ ] Sprint status updated to `in-progress` when work begins

---

**Story prepared by:** SM Agent (Bob)  
**Ready for:** Dev Agent implementation  
**Estimated Complexity:** Low (refactoring existing code)  
**Risk Level:** Low (no new functionality, just reorganization)
