import { createRouter, createWebHistory } from 'vue-router'
import About from '../views/About.vue'
import Detail from '../views/Detail.vue'
import App from '../App.vue'



const routes = [
    {
    path: '/',
    name: 'Home',
    component: App,
     },
    {
      path: '/about',
      name: 'About',
      component: About,
    },
    {
      path: '/detail',
      name: 'Detail',
      component: Detail,
    }
  ]


const router = createRouter({
  history: createWebHistory(),
  routes : routes
})
export default router
