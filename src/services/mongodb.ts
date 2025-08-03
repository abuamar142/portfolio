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
    console.log(`🔄 Making API request to: ${config.baseURL}${config.url}`)
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
    console.log(`✅ API response received (${response.status})`)
    return response
  },
  (error) => {
    console.error('❌ Response interceptor error:', error.response?.status, error.message)
    return Promise.reject(error)
  },
)

export async function fetchPortfolioData(): Promise<Portfolio> {
  console.log('🔍 Fetching portfolio data from external API...')
  console.log('API URL:', `${API_BASE_URL}${API_ENDPOINT}`)

  // Minimum loading time untuk UX yang lebih baik (bisa dikonfigurasi)
  const MIN_LOADING_TIME = 500 // ms (reduced from 800ms)
  const startTime = Date.now()

  try {
    const response = await client.get(API_ENDPOINT)
    console.log('✅ Data fetched successfully from backend API')
    console.log('Response status:', response.status)

    // Log data structure for debugging
    const data = response.data
    console.log('📊 Data structure received:', {
      hasPersonalInfo: !!data.personalInfo,
      hasAbout: !!data.about,
      experiencesCount: data.experiences?.length || 0,
      projectsCount: data.projects?.length || 0,
      skillsCount: data.skills?.length || 0,
      educationCount: data.education?.length || 0,
      achievementsCount: data.achievements?.length || 0,
    })

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

    console.log('🎉 Portfolio data processed successfully')

    // Pastikan minimum loading time untuk UX yang lebih baik
    const elapsedTime = Date.now() - startTime
    if (elapsedTime < MIN_LOADING_TIME) {
      await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_TIME - elapsedTime))
    }

    return portfolioData
  } catch (error: any) {
    console.error('❌ Failed to fetch portfolio data from backend API')
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
    })

    // Provide specific error messages based on error type
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error(
        `Cannot connect to backend server at ${API_BASE_URL}. Please check if the backend is running.`,
      )
    }

    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. The backend server took too long to respond.')
    }

    if (error.response?.status === 404) {
      throw new Error(
        `API endpoint not found: ${API_ENDPOINT}. Please check the backend API configuration.`,
      )
    }

    if (error.response?.status === 500) {
      throw new Error('Backend server error. Please try again later.')
    }

    if (error.response?.status >= 400 && error.response?.status < 500) {
      throw new Error(`Client error (${error.response.status}): ${error.response.statusText}`)
    }

    // Generic error fallback
    throw new Error(`Failed to fetch portfolio data: ${error.message}`)
  }
}
