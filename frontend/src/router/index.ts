import { createRouter, createWebHistory } from "vue-router";
import { authClient } from "@/lib/auth-client";

// import About from '../views/About.vue'
// import App from "../App.vue";

const About = () => import("@/views/About.vue");
// const Detail = () => import("../views/Detail.vue");
const Main = () => import("@/views/Main.vue");
const SignIn = () => import("@/views/Auth/SignInPage.vue");
const SignUp = () => import("@/views/Auth/SignUpPage.vue");
const Welcome = () => import("@/views/Auth/Welcome.vue");

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/DashboardView.vue"),
    meta: { requiresAuth: true, fullWidth: true },
  },
  {
    path: "/signin",
    name: "Signin",
    component: SignIn,
    meta: { guestOnly: true },
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
    meta: { guestOnly: true },
  },
  {
    path: "/welcome",
    name: "Welcome",
    component: Welcome,
    meta: { guestOnly: true },
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/detail",
    name: "Detail",
    component: () => import("@/views/Detail.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/views/DashboardView.vue"),
    meta: { requiresAuth: true, fullWidth: true }
  },
  {
    path: "/teams/create",
    name: "CreateTeam",
    component: () => import("@/views/Teams/CreateTeamPage.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/teams/:teamId",
    name: "TeamDetails",
    // Placeholder for now, can point to a Dashboard or List view
    component: () => import("@/views/Main.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/teams/:teamId/members",
    name: "TeamMembers",
    component: () => import("@/views/TeamMembersView.vue"),
    meta: { requiresAuth: true, fullWidth: true }
  },
  {
    path: "/teams/:teamId/tasks",
    name: "TeamTasks",
    component: () => import("@/views/TaskListView.vue"),
    meta: { requiresAuth: true, fullWidth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach(async (to, from, next) => {
  // Skip auth check if navigating to non-protected routes
  if (!to.meta.requiresAuth && !to.meta.guestOnly) {
    next();
    return;
  }

  try {
    const { data: session } = await authClient.getSession();

    if (to.meta.requiresAuth) {
      if (session) {
        next();
      } else {
        // Only redirect to signin if we're certain there's no session
        next('/signin');
      }
    } else if (to.meta.guestOnly) {
      if (session) {
        next('/dashboard');
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (error) {
    console.error("Auth Guard Error:", error);
    // On error, be more permissive - allow navigation to protected routes
    // The API will handle unauthorized access with 401 responses
    if (to.meta.guestOnly) {
      // If going to guest-only page and error checking session, allow it
      next();
    } else {
      // For protected routes, allow navigation - let the API handle auth
      next();
    }
  }
});

export default router;
