import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AchievementCard from '@/components/ui/AchievementCard.vue'
import id from '@/locales/id'
import type { Achievement } from '@/types/portfolio'

/**
 * A contribution card is only worth having if the PR and the release can be
 * opened from it. The description is stored as plain text, so these cases pin
 * that its URLs become real anchors — with the href still filtered — while the
 * prose around them stays text.
 */
function mountCard(achievement: Partial<Achievement>) {
  const i18n = createI18n({ legacy: false, locale: 'id', messages: { id } })
  return mount(AchievementCard, {
    props: {
      achievement: {
        id: '1',
        title: 'Kontribusi fitur',
        organizer: 'InlitX / Streak',
        date: '2026-09-26',
        type: 'contribution',
        order_index: 0,
        created_at: '2026-09-26T00:00:00Z',
        ...achievement,
      } as Achievement,
    },
    global: { plugins: [i18n] },
  })
}

describe('AchievementCard', () => {
  it('renders the contribution category label', () => {
    const wrapper = mountCard({})
    expect(wrapper.text()).toContain('Kontribusi')
  })

  it('turns URLs in the description into clickable anchors', () => {
    const wrapper = mountCard({
      description: 'Rilis di https://github.com/InlitX/streak/releases/tag/v2.1.0 ya',
    })

    const links = wrapper.findAll('a')
    expect(links).toHaveLength(1)
    expect(links[0]!.attributes('href')).toBe(
      'https://github.com/InlitX/streak/releases/tag/v2.1.0',
    )
    expect(links[0]!.attributes('target')).toBe('_blank')
    expect(links[0]!.attributes('rel')).toContain('noopener')
  })

  it('renders both the pull request and the release link', () => {
    const wrapper = mountCard({
      description:
        'Pull request: https://github.com/InlitX/streak/pull/230\nRilis: https://github.com/InlitX/streak/releases/tag/v2.1.0',
    })

    const hrefs = wrapper.findAll('a').map((a) => a.attributes('href'))
    expect(hrefs).toEqual([
      'https://github.com/InlitX/streak/pull/230',
      'https://github.com/InlitX/streak/releases/tag/v2.1.0',
    ])
  })

  it('keeps the surrounding prose as text, not as markup', () => {
    const wrapper = mountCard({
      description: 'Menyumbang fitur duplikat habit ke Streak, aplikasi open source.',
    })

    expect(wrapper.findAll('a')).toHaveLength(0)
    expect(wrapper.text()).toContain('Menyumbang fitur duplikat habit ke Streak')
  })

  it('never emits a javascript: href', () => {
    const wrapper = mountCard({
      description: 'Coba javascript:alert(1) di sini',
    })

    // Not a URL by the pattern's definition, so it stays inert text and no
    // anchor is created at all.
    expect(wrapper.findAll('a')).toHaveLength(0)
    expect(wrapper.text()).toContain('javascript:alert(1)')
  })
})
