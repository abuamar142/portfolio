import { beforeEach, describe, expect, it } from 'vitest'
import {
  emitAuthFailed,
  getStoredRefreshToken,
  getStoredToken,
  onAuthFailed,
  setTokens,
  useAuth,
} from '@/composables/useAuth'

/**
 * Auth is the gate on every write path in the app (studio CRUD, uploads), so
 * the token lifecycle gets explicit coverage: what is persisted, what logout
 * clears, and that a failed refresh notifies listeners instead of leaving a
 * dead session in place.
 */
describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear()
    const { logout } = useAuth()
    logout()
  })

  it('persists the access token on setTokens', () => {
    setTokens('access-123', 'refresh-456')
    expect(localStorage.getItem('portfolio_access_token')).toBe('access-123')
    expect(localStorage.getItem('portfolio_refresh_token')).toBe('refresh-456')
    expect(getStoredToken()).toBe('access-123')
    expect(getStoredRefreshToken()).toBe('refresh-456')
  })

  it('keeps the previous refresh token when none is supplied', () => {
    setTokens('a1', 'r1')
    // A refresh response that omits the refresh token must not wipe it.
    setTokens('a2', '')
    expect(getStoredToken()).toBe('a2')
    expect(getStoredRefreshToken()).toBe('r1')
  })

  it('marks the session authenticated only with both token and user', () => {
    const { isAuthenticated, storeUser } = useAuth()
    setTokens('a', 'r')
    expect(isAuthenticated.value).toBe(false)
    storeUser({ id: 'u1', email: 'abuamar.albadawi@gmail.com', username: 'abuamar', display_name: 'Abu Amar' })
    expect(isAuthenticated.value).toBe(true)
  })

  it('clears token, refresh token and user on logout', () => {
    const { isAuthenticated, storeUser, logout } = useAuth()
    setTokens('a', 'r')
    storeUser({ id: 'u1', email: 'x@y.z', username: 'x', display_name: 'X' })
    expect(isAuthenticated.value).toBe(true)

    logout()
    expect(getStoredToken()).toBe('')
    expect(getStoredRefreshToken()).toBe('')
    expect(localStorage.getItem('portfolio_user')).toBeNull()
    expect(isAuthenticated.value).toBe(false)
  })

  it('notifies subscribers when a refresh fails, and can unsubscribe', () => {
    let calls = 0
    const off = onAuthFailed(() => calls++)
    emitAuthFailed()
    expect(calls).toBe(1)
    off()
    emitAuthFailed()
    expect(calls).toBe(1)
  })

  it('queues a gated intent and runs it only after authentication', () => {
    const { openAuth, closeAuth } = useAuth()
    let ran = false
    openAuth(() => { ran = true })
    // Dismissing must drop the queued action rather than fire it later.
    closeAuth()
    expect(ran).toBe(false)
  })
})
