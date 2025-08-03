import { ref, onMounted } from 'vue'
import type { Portfolio } from '@/types/portfolio'
import { fetchPortfolioData } from '@/services/mongodb'

export function usePortfolio() {
  const portfolio = ref<Portfolio | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const loadPortfolio = async () => {
    try {
      loading.value = true
      portfolio.value = await fetchPortfolioData()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load portfolio data'
      console.error('Error loading portfolio:', err)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    loadPortfolio()
  })

  return {
    portfolio,
    loading,
    error,
    refresh: loadPortfolio,
  }
}
