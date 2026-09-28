import { isAxiosError } from 'axios'
import type { Portfolio } from '@/types/portfolio'
import client from '@/services/client'
import { fetchAchievements } from '@/services/achievement'

const API_ENDPOINT = '/profile'

/**
 * Portfolio data (identity, skills, experiences, projects, education) now
 * comes from portfolio-service instead of the Payload CMS. The response shape
 * is deliberately identical — the service returns the same camelCase keys
 * (personalInfo, githubUrl) the CMS used, so this swap is a URL change rather
 * than a rewrite of every consuming component.
 *
 * Achievements are a separate call: they moved to Postgres earlier (2026-09-27)
 * and live at /achievements, not inside the profile payload.
 */
export async function fetchPortfolioData(): Promise<Portfolio> {
  const MIN_LOADING_TIME = 500
  const startTime = Date.now()

  try {
    const response = await client.get(API_ENDPOINT)

    const body = response.data

    // portfolio-service wraps every payload as { success, message, data }.
    if (!body || typeof body !== 'object') {
      throw new Error('Invalid response structure from API')
    }
    if (body.success === false) {
      throw new Error(body.message || 'API returned an error')
    }

    const data = body.data && typeof body.data === 'object' ? body.data : body

    const personalInfo = data.personalInfo
    if (!personalInfo || typeof personalInfo !== 'object' || !personalInfo.fullname) {
      throw new Error('Personal info is missing from the profile response.')
    }

    const portfolioData: Portfolio = {
      personalInfo,
      about: data.about || personalInfo.about || '',
      experiences: Array.isArray(data.experiences) ? data.experiences : [],
      projects: Array.isArray(data.projects) ? data.projects : [],
      skills: Array.isArray(data.skills) ? data.skills : [],
      education: Array.isArray(data.education) ? data.education : [],
      achievements: [],
    }

    portfolioData.achievements = await fetchAchievements()

    const elapsedTime = Date.now() - startTime
    if (elapsedTime < MIN_LOADING_TIME) {
      await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_TIME - elapsedTime))
    }

    return portfolioData
  } catch (error: unknown) {
    const axiosError = isAxiosError(error) ? error : null
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
        `Cannot connect to backend server at ${client.defaults.baseURL}. Please check if the backend is running.`,
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
