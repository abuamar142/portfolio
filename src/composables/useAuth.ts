import { ref, computed } from 'vue'
import type { AuthUser } from '@/types/quote'

const isClient = typeof window !== 'undefined'

// App-scoped storage keys. The pre-SSO build used quote_* names; migrate them
// once on load so an existing session survives the rename.
const TOKEN_KEY = 'portfolio_access_token'
const REFRESH_TOKEN_KEY = 'portfolio_refresh_token'
const USER_KEY = 'portfolio_user'
const LEGACY_TOKEN_KEY = 'quote_access_token'
const LEGACY_USER_KEY = 'quote_user'

function migrateStoredAuth() {
  if (!isClient) return
  if (!localStorage.getItem(TOKEN_KEY) && localStorage.getItem(LEGACY_TOKEN_KEY)) {
    localStorage.setItem(TOKEN_KEY, localStorage.getItem(LEGACY_TOKEN_KEY) as string)
  }
  if (!localStorage.getItem(USER_KEY) && localStorage.getItem(LEGACY_USER_KEY)) {
    localStorage.setItem(USER_KEY, localStorage.getItem(LEGACY_USER_KEY) as string)
  }
  localStorage.removeItem(LEGACY_TOKEN_KEY)
  localStorage.removeItem(LEGACY_USER_KEY)
}
migrateStoredAuth()

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

export function useAuth() {
  function openAuth() {
    showAuth.value = true
  }

  function closeAuth() {
    showAuth.value = false
  }

  function setToken(newToken: string) {
    token.value = newToken
    if (isClient) localStorage.setItem(TOKEN_KEY, newToken)
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

  // Load on init
  loadStoredUser()

  return {
    user,
    token,
    isAuthenticated,
    showAuth,
    openAuth,
    closeAuth,
    setToken,
    setTokens,
    setUser,
    storeUser,
    logout,
    loadStoredUser,
  }
}
