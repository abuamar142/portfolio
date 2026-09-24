import axios from 'axios'
import { getStoredToken } from '@/composables/useAuth'

const API_BASE = import.meta.env.VITE_PORTFOLIO_API_URL || 'https://portfolio.abuamar.online'

// Shared axios client for portfolio-service endpoints (quotes, links, ...):
// one base URL + one Authorization interceptor for every tool.
const client = axios.create({
  baseURL: `${API_BASE}/api/v1`,
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

export default client
