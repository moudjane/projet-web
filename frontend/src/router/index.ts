import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '../views/LoginPage.vue'
import Register from '../views/RegisterPage.vue'
import Dashboard from '../views/DashboardPage.vue'
import ConversationDetail from '../views/ConversationDetailPage.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/conversation/:id',
    name: 'ConversationDetail',
    component: ConversationDetail,
    props: true,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.loadToken()
  if (to.meta.requiresAuth && !authStore.token) {
    return next({ path: '/login' })
  }
  next()
})

export default router