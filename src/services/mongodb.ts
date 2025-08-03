import axios from 'axios'
import type { Portfolio } from '@/types/portfolio'

// Use external backend API
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://www.backend.abuamar.site'
const API_ENDPOINT = '/api/personal/data'

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000, // 30 seconds timeout (increased from 10s)
})

// Add request interceptor for logging
client.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.error('❌ Request interceptor error:', error)
    return Promise.reject(error)
  },
)

// Add response interceptor for logging
client.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('❌ Response interceptor error:', error.response?.status, error.message)
    return Promise.reject(error)
  },
)

export async function fetchPortfolioData(): Promise<Portfolio> {
  // Minimum loading time untuk UX yang lebih baik (bisa dikonfigurasi)
  const MIN_LOADING_TIME = 500 // ms (reduced from 800ms)
  const startTime = Date.now()

  try {
    const response = await client.get(API_ENDPOINT)

    // Log data structure for debugging
    const data = response.data

    // Validate required data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data structure received from API')
    }

    // Ensure all required fields exist with fallbacks
    const portfolioData: Portfolio = {
      personalInfo: data.personalInfo || {},
      about: data.about || data.personalInfo?.about || '',
      experiences: Array.isArray(data.experiences) ? data.experiences : [],
      projects: Array.isArray(data.projects) ? data.projects : [],
      skills: Array.isArray(data.skills) ? data.skills : [],
      education: Array.isArray(data.education) ? data.education : [],
      achievements: Array.isArray(data.achievements) ? data.achievements : [],
    }

    // Pastikan minimum loading time untuk UX yang lebih baik
    const elapsedTime = Date.now() - startTime
    if (elapsedTime < MIN_LOADING_TIME) {
      await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_TIME - elapsedTime))
    }

    return portfolioData
  } catch (error: unknown) {
    console.error('❌ Failed to fetch portfolio data from backend API')

    // Type-safe error handling
    const isAxiosError = (
      err: unknown,
    ): err is {
      response?: { status: number; statusText: string }
      config?: { url: string; baseURL: string }
      code?: string
      message: string
    } => {
      return typeof err === 'object' && err !== null && 'message' in err
    }

    const axiosError = isAxiosError(error) ? error : null
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    console.error('Error details:', {
      message: errorMessage,
      code: axiosError?.code,
      status: axiosError?.response?.status,
      statusText: axiosError?.response?.statusText,
      url: axiosError?.config?.url,
      baseURL: axiosError?.config?.baseURL,
    })

    // Provide specific error messages based on error type
    if (axiosError?.code === 'ENOTFOUND' || axiosError?.code === 'ECONNREFUSED') {
      throw new Error(
        `Cannot connect to backend server at ${API_BASE_URL}. Please check if the backend is running.`,
      )
    }

    if (axiosError?.code === 'ECONNABORTED') {
      throw new Error('Request timeout. The backend server took too long to respond.')
    }

    if (axiosError?.response?.status === 404) {
      throw new Error(
        `API endpoint not found: ${API_ENDPOINT}. Please check the backend API configuration.`,
      )
    }

    if (axiosError?.response?.status === 500) {
      throw new Error('Backend server error. Please try again later.')
    }

    if (
      axiosError?.response?.status &&
      axiosError.response.status >= 400 &&
      axiosError.response.status < 500
    ) {
      throw new Error(
        `Client error (${axiosError.response.status}): ${axiosError.response.statusText}`,
      )
    }

    // Generic error fallback
    throw new Error(`Failed to fetch portfolio data: ${errorMessage}`)
  }
}
