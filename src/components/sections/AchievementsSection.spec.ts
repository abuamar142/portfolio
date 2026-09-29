import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import id from '@/locales/id'
import AchievementsSection from '@/components/sections/AchievementsSection.vue'
import type { Achievement, Portfolio } from '@/types/portfolio'

/**
 * The section is where the contribution type has to prove itself: a filter
 * chip that lists it, and a card that survives being filtered to. The
 * portfolio composable is mocked because the real one fetches on mount.
 */
const achievements: Achievement[] = [
  {
    id: '1',
    title: 'Kontribusi fitur duplikat habit',
    organizer: 'InlitX / Streak',
    date: '2026-09-26',
    type: 'contribution',
    description: 'Pull request: https://github.com/InlitX/streak/pull/230',
    order_index: 0,
    created_at: '2026-09-26T00:00:00Z',
  },
  {
    id: '2',
    title: 'Belajar Dasar AI',
    organizer: 'Dicoding',
    date: '2024-04-11',
    type: 'certificate',
    description: 'Kelulusan kelas',
    order_index: 1,
    created_at: '2024-04-11T00:00:00Z',
  },
]

vi.mock('@/composables/usePortfolio', () => ({
  usePortfolio: () => ({
    portfolio: {
      value: { achievements } as unknown as Portfolio,
    },
    loading: { value: false },
    error: { value: null },
    refresh: vi.fn(),
  }),
}))

// vi.mock is hoisted above the imports, so the static import above already
// resolves to the stubbed composable.

function mountSection() {
  const i18n = createI18n({ legacy: false, locale: 'id', messages: { id } })
  return mount(AchievementsSection, { global: { plugins: [i18n] } })
}

describe('AchievementsSection', () => {
  it('offers a contribution filter chip with its own count', () => {
    const wrapper = mountSection()
    const chips = wrapper.findAll('button.chip').map((c) => c.text())

    const contribution = chips.find((c) => c.includes('Kontribusi'))
    expect(contribution).toBeDefined()
    // The chip carries the count for its own category: exactly one.
    expect(contribution).toContain('1')
  })

  it('filters down to contributions only', async () => {
    const wrapper = mountSection()

    const contributionChip = wrapper
      .findAll('button.chip')
      .find((c) => c.text().includes('Kontribusi'))
    await contributionChip!.trigger('click')

    const cards = wrapper.findAll('article.figure-block')
    expect(cards).toHaveLength(1)
    expect(cards[0]!.text()).toContain('Kontribusi fitur duplikat habit')
    expect(wrapper.text()).not.toContain('Belajar Dasar AI')
  })

  it('keeps the contribution link clickable inside the card', () => {
    const wrapper = mountSection()
    const link = wrapper.find('article.figure-block a')

    expect(link.attributes('href')).toBe('https://github.com/InlitX/streak/pull/230')
    expect(link.attributes('target')).toBe('_blank')
  })
})
