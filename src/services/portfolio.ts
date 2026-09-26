import axios from 'axios'
import type { Portfolio } from '@/types/portfolio'
import { backendClient } from '@/services/client'

const API_ENDPOINT = '/personal/data'

export async function fetchPortfolioData(): Promise<Portfolio> {
  const MIN_LOADING_TIME = 500
  const startTime = Date.now()

  try {
    const response = await backendClient.get(API_ENDPOINT)

    const body = response.data

    // Backend returns { success, message, data } — unwrap the data field
    if (!body || typeof body !== 'object') {
      throw new Error('Invalid response structure from API')
    }

    if (body.success === false) {
      throw new Error(body.message || 'API returned an error')
    }

    // Unwrap: use body.data if it exists (structured response), otherwise body (flat/legacy format)
    const data = body.data && typeof body.data === 'object' && body.data.personalInfo
      ? body.data
      : body

    // Opsi A (identity-sync 2026-09-16): personalInfo is required. No static
    // fallback — a missing document is a backend data error, surfaced as one.
    const personalInfo = data.personalInfo
    if (!personalInfo || typeof personalInfo !== 'object' || !personalInfo.fullname) {
      throw new Error('Personal info is missing from the backend response.')
    }
    const portfolioData: Portfolio = {
      personalInfo,
      about: data.about || data.personalInfo?.about || '',
      experiences: Array.isArray(data.experiences) ? data.experiences : [],
      projects: Array.isArray(data.projects) ? data.projects : [],
      skills: Array.isArray(data.skills) ? data.skills : [],
      education: Array.isArray(data.education) ? data.education : [],
      achievements: Array.isArray(data.achievements) ? data.achievements : [],
    }

    const elapsedTime = Date.now() - startTime
    if (elapsedTime < MIN_LOADING_TIME) {
      await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_TIME - elapsedTime))
    }

    return portfolioData
  } catch (error: unknown) {
    const axiosError = axios.isAxiosError(error) ? error : null
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    console.error('portfolio fetch failed:', {
      message: errorMessage,
      code: axiosError?.code,
      status: axiosError?.response?.status,
      url: axiosError?.config?.url,
      baseURL: axiosError?.config?.baseURL,
    })

    if (axiosError?.code === 'ENOTFOUND' || axiosError?.code === 'ECONNREFUSED') {
      throw new Error(
        `Cannot connect to backend server at ${backendClient.defaults.baseURL}. Please check if the backend is running.`,
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

    throw new Error(`Failed to fetch portfolio data: ${errorMessage}`)
  }
}
