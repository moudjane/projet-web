import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
  }),
  actions: {
    setToken(token: string, rememberMe = false) {
      this.token = token

      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem('token', token)
    },
    loadToken() {
      this.token = localStorage.getItem('token') || sessionStorage.getItem('token')
    },
    clearToken() {
      this.token = null
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
    },
  },
})
