import { computed } from 'vue'
import { usePortfolio } from './usePortfolio'

/**
 * Derived counts for hero/about strips. Everything here comes from portfolio
 * data — no invented metrics.
 */
export function useStats() {
  const { portfolio } = usePortfolio()

  const yearsBuilding = computed<number | null>(() => {
    const durations = portfolio.value?.experiences?.map((e) => e.duration) ?? []
    const years = (durations.join(' ').match(/(?:19|20)\d{2}/g) ?? []).map(Number)
    if (!years.length) return null
    const span = new Date().getFullYear() - Math.min(...years)
    return span > 0 ? span : null
  })

  const projectCount = computed(() => portfolio.value?.projects?.length ?? 0)
  const roleCount = computed(() => portfolio.value?.experiences?.length ?? 0)
  const technologyCount = computed(() => portfolio.value?.skills?.length ?? 0)

  return { yearsBuilding, projectCount, roleCount, technologyCount }
}
