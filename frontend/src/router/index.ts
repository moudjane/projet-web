import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Profile from '../views/Profile.vue'
import UsersList from '../views/UsersList.vue'
import ConversationsList from '../views/ConversationsList.vue'
import ConversationDetail from '../views/ConversationDetail.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/users',
    name: 'UsersList',
    component: UsersList
  },
  {
    path: '/conversations',
    name: 'ConversationsList',
    component: ConversationsList
  },
  {
    path: '/conversation/:id',
    name: 'ConversationDetail',
    component: ConversationDetail,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router