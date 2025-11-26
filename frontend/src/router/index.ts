import { createRouter, createWebHistory } from "vue-router";
// import About from '../views/About.vue'

// import App from "../App.vue";

const About = () => import("@/views/About.vue");
// const Detail = () => import("../views/Detail.vue");
const Main = () => import("@/views/Main.vue");
const NotFound = () => import("@/views/NotFound.vue");

const routes = [
  {
    path: "/",
    name: "Home",
    component: Main,
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
export default router;
