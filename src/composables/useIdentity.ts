import { computed } from 'vue'
import { usePortfolio } from './usePortfolio'

/**
 * Site identity, derived ONLY from the CMS `personalInfo` document.
 *
 * Opsi A (identity-sync 2026-09-16): no static fallback. When the backend is
 * unreachable the identity is null and the hero shows the error state instead
 * of stale hardcoded values. Site-owned constants (resume path, timezone
 * label) live here because they are UI configuration, not identity data.
 */
export const SITE_RESUME_PATH = '/cv.pdf'
export const SITE_TIME_ZONE_LABEL = 'WIB (UTC+7)'

export function useIdentity() {
  const { portfolio } = usePortfolio()

  const identity = computed(() => portfolio.value?.personalInfo ?? null)

  const initials = computed(() => {
    const name = identity.value?.fullname ?? ''
    const parts = name.replace(/,.*$/, '').trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return ''
    if (parts.length === 1) return (parts[0]?.slice(0, 2) ?? '').toUpperCase()
    return `${parts[0]?.[0] ?? ''}${parts[parts.length - 1]?.[0] ?? ''}`.toUpperCase()
  })

  const phoneHref = computed(() => {
    const whatsApp = identity.value?.whatsApp
    if (whatsApp) return whatsApp
    const phone = identity.value?.phone ?? ''
    return `https://wa.me/${phone.replace(/[^+\d]/g, '').replace('+', '')}`
  })

  return { identity, initials, phoneHref }
}
