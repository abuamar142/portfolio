import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHashHistory } from 'vue-router'
import BlogDetail from '@/pages/BlogDetail.vue'
import id from '@/locales/id'

/**
 * Posts come from Markdown files in the repo, so these cases mount the real
 * page against the real content directory — no API mock, because there is no
 * API. The behaviour that still needs pinning is the soft-404 rule: an unknown
 * slug must reach <head> as robots=noindex, and a real post must not.
 */

let cleanup: (() => void) | null = null

async function mountPage(slug: string) {
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [{ path: '/blogs/:slug', component: BlogDetail }],
  })
  await router.push(`/blogs/${slug}`)
  await router.isReady()

  // The DOM renderer is debounced (setTimeout 0), so each case waits a real
  // macrotask after the render — asserting straight after flushPromises()
  // reads a <head> the renderer has not written yet.
  const head = createHead()
  const wrapper = mount(BlogDetail, {
    global: {
      plugins: [router, createI18n({ legacy: false, locale: 'id', messages: { id } }), head],
    },
  })
  await flushPromises()
  await new Promise((resolve) => setTimeout(resolve, 0))
  cleanup = () => wrapper.unmount()
  return wrapper
}

const robots = () => document.head.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null

afterEach(() => {
  cleanup?.()
  cleanup = null
  document.head.innerHTML = ''
})

describe('BlogDetail head', () => {
  it('marks an unknown slug noindex', async () => {
    await mountPage('slug-yang-tidak-ada')
    expect(robots()).toBe('noindex,nofollow')
  })

  it('leaves a real post indexable', async () => {
    await mountPage('kenapa-ai-pakai-design-system')
    expect(robots()).toBeNull()
  })
})

describe('BlogDetail content', () => {
  it('renders the post title and body from the Markdown file', async () => {
    const wrapper = await mountPage('kenapa-ai-pakai-design-system')
    expect(wrapper.text()).toContain('Kenapa AI Lebih Rapi')
    expect(wrapper.html()).toContain('Masalah: AI + Custom Styling')
  })

  it('builds a table of contents from the headings', async () => {
    const wrapper = await mountPage('kenapa-ai-pakai-design-system')
    const links = wrapper.findAll('aside nav a')
    expect(links.length).toBeGreaterThan(0)
    // Every link must point at an id that exists in the rendered body.
    for (const link of links) {
      const target = link.attributes('href')!.replace('#', '')
      expect(wrapper.html()).toContain(`id="${target}"`)
    }
  })

  it('shows the reading time and the post date', async () => {
    const wrapper = await mountPage('kenapa-ai-pakai-design-system')
    expect(wrapper.text()).toContain('September 2026')
    expect(wrapper.text()).toMatch(/menit baca/)
  })
})
