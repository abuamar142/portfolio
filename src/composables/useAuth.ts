import { ref, computed } from 'vue'
import type { AuthUser } from '@/types/quote'

const user = ref<AuthUser | null>(null)
const token = ref<string>(localStorage.getItem('quote_access_token') || '')
const isAuthenticated = computed(() => !!token.value && !!user.value)

export function useAuth() {
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('quote_access_token', newToken)
  }

  function setUser(newUser: AuthUser) {
    user.value = newUser
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('quote_access_token')
    localStorage.removeItem('quote_user')
  }

  function loadStoredUser() {
    const stored = localStorage.getItem('quote_user')
    if (stored) {
      try {
        user.value = JSON.parse(stored)
      } catch { /* ignore */ }
    }
  }

  function storeUser(u: AuthUser) {
    user.value = u
    localStorage.setItem('quote_user', JSON.stringify(u))
  }

  // Load on init
  loadStoredUser()

  return {
    user,
    token,
    isAuthenticated,
    setToken,
    setUser,
    storeUser,
    logout,
    loadStoredUser,
  }
}
