import { ref, computed } from 'vue'
import type { AuthUser } from '@/types/auth'

const isClient = typeof window !== 'undefined'

// App-scoped storage keys.
const TOKEN_KEY = 'portfolio_access_token'
const REFRESH_TOKEN_KEY = 'portfolio_refresh_token'
const USER_KEY = 'portfolio_user'


/** Single source for the Bearer token — services/client.ts interceptor uses this. */
export function getStoredToken(): string {
  return isClient ? localStorage.getItem(TOKEN_KEY) || '' : ''
}

/** Refresh token (7d TTL). client.ts exchanges it for a new pair on a 401. */
export function getStoredRefreshToken(): string {
  return isClient ? localStorage.getItem(REFRESH_TOKEN_KEY) || '' : ''
}

/** Persist the access + refresh pair returned by login/refresh in one step. */
export function setTokens(access: string, refresh: string) {
  token.value = access
  if (isClient) {
    localStorage.setItem(TOKEN_KEY, access)
    if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
  }
}

/**
 * Auth-failure signal. client.ts emits this when a refresh attempt fails, so
 * any mounted listener (App.vue) can logout + prompt a fresh login.
 */
type AuthFailedListener = () => void
const authFailedListeners = new Set<AuthFailedListener>()
export function onAuthFailed(listener: AuthFailedListener): () => void {
  authFailedListeners.add(listener)
  return () => authFailedListeners.delete(listener)
}
export function emitAuthFailed(): void {
  authFailedListeners.forEach((fn) => fn())
}

const user = ref<AuthUser | null>(null)
const token = ref<string>(isClient ? (localStorage.getItem(TOKEN_KEY) || '') : '')
const isAuthenticated = computed(() => !!token.value && !!user.value)

// Global auth modal state: App.vue mounts <AuthModal> once, any page can call
// openAuth() (see AuthControls / empty-state CTAs).
const showAuth = ref(false)

/**
 * A gated action the user asked for before they were signed in (e.g. tapping
 * "Tulis Kutipan" while logged out). It runs once authentication succeeds so
 * the user does not have to find the button again.
 */
let pendingIntent: (() => void) | null = null

export function runAuthIntent(): void {
  const intent = pendingIntent
  pendingIntent = null
  intent?.()
}

export function useAuth() {
  function openAuth(intent?: () => void) {
    pendingIntent = typeof intent === 'function' ? intent : null
    showAuth.value = true
  }

  function closeAuth() {
    // A dismissed dialog must not leave a stale action queued.
    pendingIntent = null
    showAuth.value = false
  }

  function setUser(newUser: AuthUser) {
    user.value = newUser
  }

  function logout() {
    token.value = ''
    user.value = null
    if (isClient) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  }

  function loadStoredUser() {
    if (!isClient) return
    const stored = localStorage.getItem(USER_KEY)
    if (stored) {
      try {
        user.value = JSON.parse(stored)
      } catch { /* ignore */ }
    }
  }

  function storeUser(u: AuthUser) {
    user.value = u
    if (isClient) localStorage.setItem(USER_KEY, JSON.stringify(u))
  }

  loadStoredUser()

  return {
    user,
    token,
    isAuthenticated,
    showAuth,
    openAuth,
    closeAuth,
    setTokens,
    setUser,
    storeUser,
    logout,
  }
}
