import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/token-login',
    name: 'TokenLogin',
    component: () => import('../views/TokenLogin.vue')
  },
  {
    path: '/control',
    name: 'Control',
    component: () => import('../views/Control.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router