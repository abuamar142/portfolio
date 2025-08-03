import { ref } from 'vue'
import type { Portfolio } from '@/types/portfolio'
import { fetchPortfolioData } from '@/services/mongodb'

// Shared state - singleton pattern
const portfolio = ref<Portfolio | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
let loadPromise: Promise<void> | null = null

export function usePortfolio() {
  const loadPortfolio = async (retryCount = 0) => {
    // If already loading or loaded, return existing promise/data
    if (loadPromise && !retryCount) {
      return loadPromise
    }

    const maxRetries = 3

    loadPromise = (async () => {
      try {
        loading.value = true
        error.value = null
        portfolio.value = await fetchPortfolioData()
      } catch (err) {
        console.error(`Error loading portfolio (attempt ${retryCount + 1}/${maxRetries}):`, err)

        // Retry logic for network errors
        if (retryCount < maxRetries - 1) {
          loadPromise = null // Reset promise for retry
          setTimeout(
            () => {
              loadPortfolio(retryCount + 1)
            },
            (retryCount + 1) * 1000,
          )
          return
        }

        error.value = err instanceof Error ? err.message : 'Failed to load portfolio data'
      } finally {
        if (retryCount >= maxRetries - 1 || portfolio.value) {
          loading.value = false
        }
      }
    })()

    return loadPromise
  }

  return {
    portfolio,
    loading,
    error,
    refresh: () => {
      loadPromise = null // Reset promise to allow new request
      return loadPortfolio()
    },
  }
}
