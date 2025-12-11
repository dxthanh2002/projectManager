# Story 1.2: User Signup & Login (Better-Auth Integration)

**Story ID:** 1.2  
**Epic:** 1 - Foundation & Authentication  
**Status:** ready-for-dev  
**Created:** 2025-12-09  
**Updated:** 2025-12-09 (Better Auth docs review)  
**Story Key:** `1-2-user-signup-login-better-auth-integration`

---

## User Story

**As a** Guest,  
**I want** to sign up and log in,  
**So that** I can access the system and maintain my session.

---

## Business Context

This story implements the core authentication flow using Better Auth's official Vue client. It creates the frontend UI and integrates with the existing better-auth backend setup.

**Value:** Enables user access to the application, establishes session persistence, and sets up the foundation for role-based features.

**Covered FRs:** FR1 (Signup), FR2 (Login), FR3 (Logout), FR4 (Session Persistence)

---

## Acceptance Criteria

### AC1: Signup Flow

**Given** I am a guest user on the Signup page,  
**When** I submit a valid email and password,  
**Then**:
- A new user is created via `authClient.signUp.email()`
- I am automatically logged in (default behavior)
- I am redirected to the dashboard/home page
- My session is stored in HTTP-only cookies

**And** the signup form validates:
- Email is required and valid format
- Password is required (min 8 characters by default)
- Displays error messages for validation failures

---

### AC2: Login Flow

**Given** I am a guest user on the Login page,  
**When** I submit valid credentials,  
**Then**:
- I am authenticated via `authClient.signIn.email()`
- My session is established
- I am redirected to the dashboard/home page
- Session data is accessible via `authClient.useSession()`

**And** invalid credentials show appropriate error messages

---

### AC3: Session Persistence

**Given** I am logged in,  
**When** I refresh the page or close/reopen the browser,  
**Then**:
- My session persists (via HTTP-only cookies)
- `authClient.useSession()` automatically fetches my session
- I remain logged in without re-entering credentials

---

### AC4: Logout Flow

**Given** I am logged in,  
**When** I click the Logout button,  
**Then**:
- My session is destroyed via `authClient.signOut()`
- Cookies are cleared
- Session data becomes null
- I am redirected to the Login page

---

## Technical Requirements

### Architecture Compliance

**Reference:** Better Auth Official Documentation (https://www.better-auth.com/docs/basic-usage)

**MUST follow these patterns:**

1. **Better Auth Vue Client:**
   - Install: `npm i better-auth` (already installed)
   - Import from: `better-auth/vue`
   - Create client instance with `createAuthClient()`
   - Use built-in `useSession()` hook (reactive, nanostore-based)

2. **Client Methods:**
   - **Signup:** `authClient.signUp.email({ email, password, name })`
   - **Login:** `authClient.signIn.email({ email, password, callbackURL })`
   - **Logout:** `authClient.signOut()`
   - **Session:** `authClient.useSession()` (returns reactive ref)

3. **Session Management:**
   - Better Auth uses HTTP-only cookies automatically
   - `useSession()` hook provides reactive session data
   - No manual token storage needed
   - Session auto-refreshes on mount

---

## Developer Guardrails

### 🚨 CRITICAL: What NOT to Do

1. **DO NOT** create custom Pinia auth store - use Better Auth's `useSession()` hook
2. **DO NOT** use axios for auth - use `authClient` methods
3. **DO NOT** manually manage tokens/cookies - Better Auth handles this
4. **DO NOT** call `getSession()` on app init - `useSession()` does this automatically
5. **DO NOT** store passwords in state - only send to API

---

### ✅ Implementation Checklist

**Step 1: Create Better Auth Client**
- [ ] Create `frontend/src/lib/auth-client.ts`
- [ ] Import `createAuthClient` from `better-auth/vue`
- [ ] Configure with `baseURL: 'http://localhost:5001'` (backend URL)
- [ ] Export `authClient` instance

**Step 2: Create Signup Page**
- [ ] Create `frontend/src/views/Signup.vue`
- [ ] Add email, password, and name input fields
- [ ] Add form validation (email format, password min 8 chars)
- [ ] Call `authClient.signUp.email()` with callbacks:
  - `onSuccess`: Redirect to dashboard
  - `onError`: Display error message
- [ ] Add link to Login page

**Step 3: Create Login Page**
- [ ] Create `frontend/src/views/Login.vue`
- [ ] Add email and password input fields
- [ ] Add form validation
- [ ] Call `authClient.signIn.email()` with callbacks:
  - `onSuccess`: Redirect to dashboard
  - `onError`: Display error message
- [ ] Add "Remember Me" option (default: true)
- [ ] Add link to Signup page

**Step 4: Add Session Display**
- [ ] Use `authClient.useSession()` in components
- [ ] Display user info when logged in
- [ ] Add logout button that calls `authClient.signOut()`

**Step 5: Configure Vue Router**
- [ ] Add `/signup` route
- [ ] Add `/login` route
- [ ] Add navigation guards to protect authenticated routes
- [ ] Redirect to `/login` if not authenticated

---

## File Locations & Patterns

### Files to CREATE:
- `frontend/src/lib/auth-client.ts` (NEW - Better Auth client instance)
- `frontend/src/views/Signup.vue` (NEW - Signup page)
- `frontend/src/views/Login.vue` (NEW - Login page)

### Files to MODIFY:
- `frontend/src/router/index.ts` (add auth routes + guards)
- `frontend/src/App.vue` or layout component (add logout button)

### Files to VERIFY (already exist):
- `backend/src/lib/auth.ts` (better-auth config - no changes)

---

## Implementation Notes

### Better Auth Client Setup

```typescript
// frontend/src/lib/auth-client.ts
import { createAuthClient } from 'better-auth/vue';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:5001' // Backend server URL
});
```

### Signup Component Pattern

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const name = ref('');
const error = ref('');
const loading = ref(false);

async function handleSignup() {
  error.value = '';
  
  const { data, error: signupError } = await authClient.signUp.email({
    email: email.value,
    password: password.value,
    name: name.value,
    callbackURL: '/dashboard'
  }, {
    onRequest: () => {
      loading.value = true;
    },
    onSuccess: () => {
      router.push('/dashboard');
    },
    onError: (ctx) => {
      error.value = ctx.error.message;
      loading.value = false;
    }
  });
}
</script>

<template>
  <form @submit.prevent="handleSignup">
    <input v-model="name" placeholder="Name" required />
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit" :disabled="loading">Sign Up</button>
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>
```

### Login Component Pattern

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const rememberMe = ref(true);
const error = ref('');
const loading = ref(false);

async function handleLogin() {
  error.value = '';
  
  const { data, error: loginError } = await authClient.signIn.email({
    email: email.value,
    password: password.value,
    rememberMe: rememberMe.value,
    callbackURL: '/dashboard'
  }, {
    onRequest: () => {
      loading.value = true;
    },
    onSuccess: () => {
      router.push('/dashboard');
    },
    onError: (ctx) => {
      error.value = ctx.error.message;
      loading.value = false;
    }
  });
}
</script>

<template>
  <form @submit.prevent="handleLogin">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <label>
      <input v-model="rememberMe" type="checkbox" />
      Remember Me
    </label>
    <button type="submit" :disabled="loading">Log In</button>
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>
```

### Session Usage Pattern

```vue
<script setup lang="ts">
import { authClient } from '@/lib/auth-client';

const session = authClient.useSession();

async function handleLogout() {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        router.push('/login');
      }
    }
  });
}
</script>

<template>
  <div v-if="session.data">
    <p>Welcome, {{ session.data.user.name }}!</p>
    <button @click="handleLogout">Logout</button>
  </div>
  <div v-else-if="session.isPending">
    Loading...
  </div>
</template>
```

### Router Guard Pattern

```typescript
// router/index.ts
import { authClient } from '@/lib/auth-client';

router.beforeEach(async (to, from, next) => {
  // Get current session
  const { data: session } = await authClient.getSession();
  
  if (to.meta.requiresAuth && !session) {
    next('/login');
  } else if (to.path === '/login' && session) {
    next('/');
  } else {
    next();
  }
});
```

---

## Testing Requirements

### Manual Testing Checklist:

1. **Signup Flow:**
   - [ ] Valid signup → creates user and auto-logs in
   - [ ] Invalid email → shows error
   - [ ] Short password (< 8 chars) → shows error
   - [ ] Duplicate email → shows error

2. **Login Flow:**
   - [ ] Valid credentials → logs in successfully
   - [ ] Invalid credentials → shows error
   - [ ] Empty fields → shows validation errors
   - [ ] Remember Me unchecked → session expires on browser close

3. **Session Persistence:**
   - [ ] Refresh page → stays logged in
   - [ ] Close/reopen browser (Remember Me: true) → stays logged in
   - [ ] Close/reopen browser (Remember Me: false) → logged out

4. **Logout Flow:**
   - [ ] Click logout → clears session
   - [ ] After logout → redirected to login
   - [ ] After logout → cannot access protected routes

### Automated Testing:
- **Not required for this story** - Focus on manual testing
- Future stories will add E2E tests with Playwright

---

## Dependencies

**Prerequisites:**
- Story 1.1 (Backend Middleware) - ✅ Complete
- Better Auth backend already configured

**Blocks:**
- Story 2.1 (Team Creation) - Needs authenticated users
- All future stories - Require user authentication

---

## Definition of Done

- [ ] `lib/auth-client.ts` created with Better Auth Vue client
- [ ] `views/Signup.vue` created with form validation
- [ ] `views/Login.vue` created with form validation
- [ ] Session display using `useSession()` hook
- [ ] Router configured with auth routes and guards
- [ ] All manual tests pass (signup, login, persistence, logout)
- [ ] Session persists across page refreshes
- [ ] Logout clears session and redirects properly
- [ ] Sprint status updated to `done` when complete

---

**Story prepared by:** SM Agent (Bob)  
**Updated with:** Better Auth Official Documentation  
**Ready for:** Dev Agent implementation  
**Estimated Complexity:** Medium (frontend + Better Auth integration)  
**Risk Level:** Low (using official Better Auth client)
