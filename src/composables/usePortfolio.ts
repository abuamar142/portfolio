import { ref, onMounted } from 'vue'
import { portfolioService } from '@/services/portfolioService'
import type { Portfolio } from '@/types/portfolio'

export function usePortfolio() {
  const portfolioData = ref<Portfolio | null>(null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  const loadPortfolioData = async () => {
    try {
      isLoading.value = true
      error.value = null

      const data = await portfolioService.getPortfolioData()
      portfolioData.value = data
      console.log('📊 Portfolio data loaded:', data.personalInfo.fullname)
    } catch (err) {
      console.error('Failed to load portfolio data:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load portfolio data'
      portfolioData.value = null
    } finally {
      isLoading.value = false
    }
  }

  const refreshData = async () => {
    try {
      isLoading.value = true
      error.value = null

      const data = await portfolioService.refreshData()
      portfolioData.value = data
      console.log('🔄 Portfolio data refreshed manually')
    } catch (err) {
      console.error('Failed to refresh portfolio data:', err)
      error.value = err instanceof Error ? err.message : 'Failed to refresh portfolio data'
      portfolioData.value = null
    } finally {
      isLoading.value = false
    }
  }

  onMounted(async () => {
    console.log('🚀 usePortfolio mounted, loading data...')
    await loadPortfolioData()
  })

  return {
    portfolioData,
    isLoading,
    error,
    refreshData,
    loadPortfolioData,
  }
}
