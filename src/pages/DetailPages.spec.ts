import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHashHistory } from 'vue-router'
import QuoteDetailPage from '@/pages/QuoteDetailPage.vue'
import SnippetDetailPage from '@/pages/SnippetDetailPage.vue'
import id from '@/locales/id'

/**
 * Both detail pages answer an unknown id with the SPA shell under HTTP 200 for
 * browsers (nginx only proxies crawler user-agents to the preview server, which
 * answers a real 404), so each page has to keep itself out of the index. The
 * distinction that matters is missing vs. failed: only a missing record may set
 * robots=noindex, because a network hiccup must not deindex a real quote or
 * snippet. These cases mount the real pages and read document.head.
 */

// jsdom ships no matchMedia, and SnippetDetailPage's theme helper reads it.
window.matchMedia = window.matchMedia || ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
})) as unknown as typeof window.matchMedia
// vi.mock is hoisted above the imports, so the fns it closes over have to be
// hoisted too — a plain `const` would still be in the temporal dead zone.
const { fetchQuoteById, fetchSnippetById } = vi.hoisted(() => ({
  fetchQuoteById: vi.fn(),
  fetchSnippetById: vi.fn(),
}))

vi.mock('@/services/quote', () => ({
  fetchQuoteById,
}))

vi.mock('@/services/snippet', () => ({
  fetchSnippetById,
  updateSnippet: vi.fn(),
  deleteSnippet: vi.fn(),
}))

// Shiki pulls a large WASM grammar set; the head behaviour under test does not
// depend on highlighted markup.
vi.mock('@/lib/shiki', () => ({
  highlight: vi.fn().mockResolvedValue('<pre><code>code</code></pre>'),
}))

let cleanup: (() => void) | null = null

async function mountAt(component: unknown, path: string) {
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: '/quotes/:id', component: QuoteDetailPage },
      { path: '/snippets/:id', component: SnippetDetailPage },
      { path: '/:pathMatch(.*)*', component: { template: '<div/>' } },
    ],
  })
  await router.push(path)
  await router.isReady()

  const head = createHead()
  const wrapper = mount(component as never, {
    global: {
      plugins: [router, createI18n({ legacy: false, locale: 'id', messages: { id } }), head],
    },
  })
  await flushPromises()
  // The DOM renderer is debounced (setTimeout 0); assert after a real macrotask.
  await new Promise((resolve) => setTimeout(resolve, 0))
  cleanup = () => wrapper.unmount()
  return wrapper
}

const robots = () => document.head.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null

const notFoundError = () => Object.assign(new Error('Not Found'), { response: { status: 404 } })

afterEach(() => {
  cleanup?.()
  cleanup = null
  document.head.innerHTML = ''
  fetchQuoteById.mockReset()
  fetchSnippetById.mockReset()
})

describe('QuoteDetailPage head', () => {
  it('marks an unknown id noindex', async () => {
    fetchQuoteById.mockRejectedValue(notFoundError())
    await mountAt(QuoteDetailPage, '/quotes/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee')
    expect(robots()).toBe('noindex,nofollow')
  })

  it('leaves a real quote indexable', async () => {
    fetchQuoteById.mockResolvedValue({
      id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      content: 'Sebuah kutipan yang benar-benar ada.',
      author_name: 'Abu Amar',
      is_anonymous: false,
      tags: [],
      created_at: '2026-01-01T00:00:00Z',
    })
    await mountAt(QuoteDetailPage, '/quotes/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee')
    expect(robots()).toBeNull()
  })

  it('leaves the quote indexable when the API fails — an outage must not deindex it', async () => {
    fetchQuoteById.mockRejectedValue(new Error('Network Error'))
    await mountAt(QuoteDetailPage, '/quotes/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee')
    expect(robots()).toBeNull()
  })
})

describe('SnippetDetailPage head', () => {
  it('marks an unknown id noindex', async () => {
    fetchSnippetById.mockRejectedValue(notFoundError())
    await mountAt(SnippetDetailPage, '/snippets/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee')
    expect(robots()).toBe('noindex,nofollow')
  })

  it('leaves a real snippet indexable', async () => {
    fetchSnippetById.mockResolvedValue({
      id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      title: 'Contoh Snippet',
      description: 'Deskripsi',
      code: 'const x = 1',
      language: 'typescript',
      tags: [],
      created_at: '2026-01-01T00:00:00Z',
    })
    await mountAt(SnippetDetailPage, '/snippets/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee')
    expect(robots()).toBeNull()
  })

  it('leaves the snippet indexable when the API fails', async () => {
    fetchSnippetById.mockRejectedValue(new Error('Network Error'))
    await mountAt(SnippetDetailPage, '/snippets/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee')
    expect(robots()).toBeNull()
  })
})
