import { createRouter, createWebHistory } from "vue-router";
import { authClient } from "@/lib/auth-client";

// import About from '../views/About.vue'
// import App from "../App.vue";

const About = () => import("@/views/About.vue");
// const Detail = () => import("../views/Detail.vue");
const Main = () => import("@/views/Main.vue");
const NotFound = () => import("@/views/NotFound.vue");
const SignIn = () => import("@/views/Auth/SignInPage.vue");
const SignUp = () => import("@/views/Auth/SignUpPage.vue");
const Welcome = () => import("@/views/Auth/Welcome.vue");

const routes = [
  {
    path: "/",
    name: "Home",
    component: Main,
    meta: { requiresAuth: true },
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
    path: "/notfound",
    name: "Notfound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach(async (to, from, next) => {
  try {
    const { data: session } = await authClient.getSession();

    if (to.meta.requiresAuth && !session) {
      next('/signin');
    } else if (to.meta.guestOnly && session) {
      next('/');
    } else {
      next();
    }
  } catch (error) {
    console.error("Auth Guard Error:", error);
    // On error, allow navigation but maybe to a safe page or just proceed?
    // Safe default: process as if no session
    if (to.meta.requiresAuth) {
      next('/signin');
    } else {
      next();
    }
  }
});

export default router;
