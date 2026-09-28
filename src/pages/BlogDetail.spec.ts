import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHashHistory } from 'vue-router'
import BlogDetail from '@/pages/BlogDetail.vue'
import id from '@/locales/id'

/**
 * The soft-404 rule lives at the seam between the composable and the page: an
 * unknown slug must reach <head> as robots=noindex, and a real post must not.
 * Asserting on the composable alone would not catch a page that forgets to
 * wire `notFound` into its useHead call, so this mounts the real page and
 * reads document.head — the same place a JS-rendering crawler looks.
 */

const getBySlug = vi.fn()

vi.mock('@/composables/usePosts', () => ({
  usePosts: () => ({ getBySlug }),
}))

const publishedPost = {
  id: '1',
  title: 'Kenapa AI Pakai Design System',
  slug: 'kenapa-ai-pakai-design-system',
  excerpt: 'Ringkasan',
  status: 'published',
}

// Disposal is deferred to afterEach: unmounting before the assertion would
// tear the <head> entries down before the test can read them.
let cleanup: (() => void) | null = null

async function mountPage(slug: string) {
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [{ path: '/blogs/:slug', component: BlogDetail }],
  })
  await router.push(`/blogs/${slug}`)
  await router.isReady()

  // The DOM renderer is debounced (setTimeout 0), so every case waits a real
  // macrotask after the fetch settles — asserting straight after
  // flushPromises() reads a <head> the renderer has not written yet.
  const head = createHead()
  const wrapper = mount(BlogDetail, {
    global: {
      plugins: [router, createI18n({ legacy: false, locale: 'id', messages: { id } }), head],
    },
  })
  await flushPromises()
  await new Promise((resolve) => setTimeout(resolve, 0))
  // Entries from an unmounted page would otherwise outlive the test and leak
  // into the next one's <head>.
  cleanup = () => wrapper.unmount()
  return wrapper
}

const robots = () => document.head.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null

afterEach(() => {
  cleanup?.()
  cleanup = null
  document.head.innerHTML = ''
  getBySlug.mockReset()
})

describe('BlogDetail head', () => {
  it('marks an unknown slug noindex', async () => {
    getBySlug.mockResolvedValue(null)
    await mountPage('slug-ngawur')
    expect(robots()).toBe('noindex,nofollow')
  })

  it('leaves a published post indexable', async () => {
    getBySlug.mockResolvedValue(publishedPost)
    await mountPage('kenapa-ai-pakai-design-system')
    expect(robots()).toBeNull()
  })

  it('leaves the post indexable when the API fails — an outage must not deindex it', async () => {
    getBySlug.mockRejectedValue(new Error('Network Error'))
    await mountPage('kenapa-ai-pakai-design-system')
    expect(robots()).toBeNull()
  })

  it('marks a draft noindex', async () => {
    getBySlug.mockResolvedValue({ ...publishedPost, status: 'draft' })
    await mountPage('masih-draft')
    expect(robots()).toBe('noindex,nofollow')
  })
})
