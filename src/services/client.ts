import axios from 'axios'
import type { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { getStoredToken, getStoredRefreshToken, setTokens, emitAuthFailed } from '@/composables/useAuth'

const API_BASE = import.meta.env.VITE_PORTFOLIO_API_URL || 'https://portfolio.abuamar.online'
const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'https://auth.abuamar.online'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://backend.abuamar.online'

// Shared axios client for portfolio-service endpoints (quotes, links, ...):
// one base URL + one Authorization interceptor for every tool.
const client = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

/**
 * Public read-only backend (posts, portfolio data). No Authorization header:
 * these endpoints are unauthenticated, and sending a personal token to a
 * different origin than it was issued for is unnecessary exposure.
 */
export const backendClient = axios.create({
  baseURL: `${BACKEND_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: 30000,
})

/**
 * Auth-service client. Deliberately bare: login/register/refresh must not run
 * through the interceptor that attaches the access token or that tries to
 * refresh on 401 (that would recurse on the refresh call itself).
 */
export const authClient = axios.create({
  baseURL: `${AUTH_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Inject JWT token if available
client.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean }

/**
 * Single-flight refresh: concurrent 401s share one refresh call instead of
 * firing N rotations (each rotation revokes the previous refresh token, so
 * parallel refreshes would invalidate each other).
 */
let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getStoredRefreshToken()
  if (!refreshToken) throw new Error('no refresh token')

  const { data } = await authClient.post(
    '/auth/refresh',
    { refresh_token: refreshToken },
    { timeout: 15000 },
  )
  const access = data?.data?.access_token
  const refresh = data?.data?.refresh_token
  if (!access) throw new Error('refresh response missing access_token')
  setTokens(access, refresh || refreshToken)
  return access
}

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined
    const status = error.response?.status

    // Only a 401 with a stored refresh token can be recovered; anything else
    // (401 without refresh, 403, network) passes through untouched.
    const canRetry =
      status === 401 &&
      !!config &&
      !config._retried &&
      !config.url?.includes('/auth/refresh') &&
      !!getStoredRefreshToken()

    if (!canRetry || !config) return Promise.reject(error)

    config._retried = true
    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null
        })
      }
      const newToken = await refreshPromise
      config.headers.Authorization = `Bearer ${newToken}`
      return client.request(config as AxiosRequestConfig)
    } catch {
      // Refresh itself failed (expired/revoked 7d token): clear session and
      // let the app prompt a fresh login instead of failing silently.
      emitAuthFailed()
      return Promise.reject(error)
    }
  },
)

export default client
