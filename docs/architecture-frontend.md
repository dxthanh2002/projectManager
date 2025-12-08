# Frontend Architecture

**Generated:** 2025-12-05  
**Part:** Frontend Web Application  
**Type:** Single Page Application (SPA)  

## Executive Summary

The frontend is a **Vue 3 Single Page Application** built with TypeScript and Vite, using TailwindCSS for styling. The application follows Vue's Composition API with `<script setup>` syntax, centralized routing via Vue Router, and state management with Pinia. Authentication integrates with the backend via better-auth client library.

## Technology Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Framework | Vue 3 | 3.5.24 | Progressive JavaScript framework |
| Build Tool | Vite (Rolldown) | 7.2.2 | Lightning-fast bundler |
| Language | TypeScript | 5.9.3 | Type-safe development |
| Routing | Vue Router | 4.6.3 | Client-side routing |
| State | Pinia | 3.0.4 | Centralized state management |
| Styling | TailwindCSS | 4.1.17 | Utility-first CSS |
| UI Components | Flowbite Vue | 0.2.2 | Pre-built components |
| Forms | vee-validate | 4.15.1 | Form validation |
| Validation | Zod | 4.1.13 | Schema validation |
| HTTP | axios | 1.13.2 | API client |
| Auth | better-auth | 1.4.4 | Authentication client |
| Icons | lucide-vue-next | 0.554.0 | Icon library |

**Development Tools:**
- `vue-tsc` - TypeScript compiler for Vue
- `prettier` - Code formatting
- `@vueuse/core` - Composition utilities

## Architecture Pattern

**Pattern:** Component-Based SPA with Feature-Sliced Structure

```
┌────────────────────────┐
│   Browser (index.html) │
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│   Vue Router           │  ← Route matching
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│   Views (Pages)        │  ← Page components
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│   Components           │  ← Reusable UI
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│   Pinia Store          │  ← State management
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│   Services (axios)     │  ← API calls
└───────────┬────────────┘
            │
  HTTP/JSON to Backend API
```

## Directory Structure

```
frontend/
├── src/
│   ├── main.ts              # Application entry point
│   ├── App.vue              # Root component
│   ├── router/              # Routing configuration
│   │   └── index.ts         # Route definitions (7 routes)
│   ├── views/               # Page-level components (7 views)
│   │   ├── Main.vue         # Home page
│   │   ├── About.vue        # About page
│   │   ├── Detail.vue       # Detail page
│   │   ├── NotFound.vue     # 404 page
│   │   └── Auth/            # Auth pages
│   │       ├── SignInPage.vue
│   │       ├── SignUpPage.vue
│   │       └── Welcome.vue
│   ├── components/          # Reusable components (33 components)
│   │   ├── HelloWorld.vue
│   │   ├── Hero.vue
│   │   ├── LoginForm.vue
│   │   ├── SignupForm.vue
│   │   ├── Contact.vue
│   │   ├── Stats.vue
│   │   └── [27 more...]
│   ├── layouts/             # Layout wrappers (3 layouts)
│   ├── store/               # Pinia stores
│   ├── services/            # API service layer
│   ├── lib/                 # Utility libraries (3 files)
│   ├── schemas/             # Validation schemas (vee-validate)
│   ├── types/               # TypeScript definitions (3 files)
│   ├── css/                 # Global styles
│   └── assets/              # Static assets
├── public/                  # Public static files
├── index.html               # HTML entry point
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # TailwindCSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## Core Components

### 1. Application Entry (`main.ts`)

**Responsibilities:**
- Create Vue application instance
- Register global plugins (Router, Pinia)
- Mount app to DOM
- Import global CSS

**Initialization Flow:**
```typescript
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

### 2. Routing (`router/index.ts`)

**Library:** Vue Router v4.6.3

**Route Configuration:**

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | Main.vue | Homepage |
| `/signin` | SignInPage.vue | User login |
| `/signup` | SignUpPage.vue | User registration |
| `/welcome` | Welcome.vue | Post-auth welcome |
| `/about` | About.vue | About page |
| `/detail` | Detail.vue | Detail view |
| `/notfound` | NotFound.vue | 404 error |

**Features:**
- History mode (HTML5 History API)
- Lazy-loaded routes for code splitting
- Centralized route definitions

### 3. State Management (`store/`)

**Library:** Pinia v3.0.4

**Pattern:** Composition API stores

**Expected Stores:**
- User store (authentication state)
- Task store (task management)
- UI store (global UI state)

**Benefits:**
- TypeScript support out of the box
- Devtools integration
- Modular store composition

### 4. Component Architecture

**Total Components:** 33+ reusable components

**Component Types:**

**Form Components:**
- `LoginForm.vue` - Login form with validation
- `SignupForm.vue` - Registration form

**Layout Components:**
- `Hero.vue` - Hero section
- `Contact.vue` - Contact section
- `Stats.vue` - Statistics display
- `Story.vue` - Story/content section

**Utility Components:**
- `HelloWorld.vue` - Sample component

**Base Components:** (from reka-ui)
- UI primitives for building complex components

**Strategy:** Composition over inheritance

### 5. Form Validation

**Libraries:**
- `vee-validate` v4.15.1 - Form validation framework
- `zod` v4.1.13 - Schema validation
- `@vee-validate/zod` - Integration adapter

**Location:** `src/schemas/`

**Pattern:**
```typescript
// Define schema with Zod
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

// Use in component with vee-validate
const { errors } = useForm({
  validationSchema: toTypedSchema(loginSchema)
})
```

## UI/UX Design

### Styling Approach

**Primary:** TailwindCSS v4.1.17
- Utility-first CSS framework
- Custom configuration in `tailwind.config.js`
- Animations via `tailwindcss-animate`

**Component Library:** Flowbite Vue v0.2.2
- Pre-built components (buttons, modals, cards, etc.)
- TailwindCSS-based components
- Accessibility built-in

**Icons:** lucide-vue-next v0.554.0
- Modern icon library
- Vue 3 optimized components

### Responsive Design

- Mobile-first approach via TailwindCSS
- Breakpoint system (sm, md, lg, xl, 2xl)
- Utility classes for responsive behavior

## Data Flow

### API Communication

**HTTP Client:** axios v1.13.2

**Service Layer Pattern:**
```
Component
    ↓ (action)
Pinia Store
    ↓ (API call)
Service Layer (axios)
    ↓ (HTTP request)
Backend REST API
```

**Location:** `src/services/`

**Expected Services:**
- `authService.ts` - Authentication API calls
- `taskService.ts` - Task management API calls

### State Management Flow

```
User Interaction
    ↓
Component Event Handler
    ↓
Pinia Action
    ↓ (if needs data)
API Service Call
    ↓
Backend Response
    ↓
Pinia State Update
    ↓
Component Reactive Update
```

## Authentication Flow

**Library:** better-auth v1.4.4 (client)

**Integration:**
1. User submits credentials via `LoginForm.vue`
2. Form validates with vee-validate
3. Service calls `/api/auth/sign-in`
4. Backend returns session cookie
5. Pinia store updates user state
6. Router navigates to protected route

**Session Persistence:**
- Cookies managed by browser
- better-auth client SDK handles automatically
- Store syncs on app initialization

## Development Workflow

### Local Development

1. **Install Dependencies:** `pnpm install`
2. **Configure Environment:** Create `.env` with backend URL
3. **Start Dev Server:** `pnpm dev` (Vite on port 5173)
4. **Hot Module Replacement:** Instant updates without refresh

### Build Process

```bash
# Type check
vue-tsc -b

# Build for production
vite build

# Output: dist/ folder (static files)
```

### Code Quality

- **TypeScript:** Strict mode enabled
- **Prettier:** Formatting on save
- **ESLint:** Not yet configured (recommended)

## Deployment Architecture

### Production Build

**Output:** Static files in `dist/`

**Deployment Options:**
- Vercel (recommended for Vite)
- Netlify
- AWS S3 + CloudFront
- Nginx static hosting

**Environment Variables:**
- Build-time variables via `.env.production`
- Vite exposes with `VITE_` prefix

## Performance Considerations

1. **Code Splitting:** Route-based lazy loading
2. **Tree Shaking:** Vite automatically removes unused code
3. **Asset Optimization:** Vite optimizes images, fonts, CSS
4. **Caching:** Static assets with content hashing
5. **Lazy Loading:** Dynamic imports for large components

## Testing Strategy

**Current:** No tests configured

**Recommended:**
- **Unit Tests:** Vitest + Vue Test Utils
- **Component Tests:** Testing Library for Vue
- **E2E Tests:** Playwright or Cypress

## TypeScript Configuration

**Files:**
- `tsconfig.json` - Base configuration
- `tsconfig.app.json` - App-specific settings
- `tsconfig.node.json` - Build tool settings

**Key Settings:**
- Strict mode enabled
- Vue 3 JSX support
- Path aliases (`@/` → `src/`)

## Accessibility

**Built-in:**
- Flowbite components have ARIA attributes
- Keyboard navigation support
- Semantic HTML structure

**Recommendations:**
- Add ARIA labels to custom components
- Test with screen readers
- Follow WCAG 2.1 guidelines

## Environment Variables

Vite environment variables (`.env`):

```env
# API endpoint
VITE_API_URL=http://localhost:5001

# Other config
VITE_APP_TITLE=Task Manager
```

## Future Enhancements

1. **Complete State Stores:** Implement user/task stores
2. **API Service Layer:** Complete service modules
3. **Testing:** Add Vitest + Vue Test Utils
4. **PWA:** Service worker for offline support
5. **i18n:** Multi-language support
6. **Dark Mode:** Theme switcher
7. **Lazy Loading:** Optimize component imports
8. **Error Boundary:** Global error handling
