import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'

/**
 * useBlogPost decides what an unknown slug means, and the two failure modes
 * must not collapse into one: a slug the CMS does not have is a soft 404 that
 * BlogDetail marks `noindex` (browsers get HTTP 200 with the SPA shell, since
 * nginx only 404s crawler user-agents), while a network/API failure is a
 * temporary condition that must leave the post indexable. Getting that
 * backwards would deindex a real post on any API hiccup, so both paths get an
 * explicit case here.
 */

import { useBlogPost } from '@/composables/useBlogPost'

const getBySlug = vi.fn()

vi.mock('@/composables/usePosts', () => ({
  usePosts: () => ({ getBySlug }),
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ locale: ref('id') }),
}))

const post = (over: Record<string, unknown> = {}) => ({
  id: '1',
  title: 'Kenapa AI Pakai Design System',
  slug: 'kenapa-ai-pakai-design-system',
  excerpt: 'Ringkasan',
  status: 'published',
  ...over,
})

describe('useBlogPost', () => {
  beforeEach(() => {
    getBySlug.mockReset()
  })

  it('exposes the post and leaves notFound false for a published slug', async () => {
    getBySlug.mockResolvedValue(post())
    const api = useBlogPost(ref('kenapa-ai-pakai-design-system'))
    await api.fetchPost()

    expect(api.post.value?.slug).toBe('kenapa-ai-pakai-design-system')
    expect(api.notFound.value).toBe(false)
    expect(api.error.value).toBe('')
    expect(api.loading.value).toBe(false)
  })

  it('sets notFound when the slug resolves to nothing', async () => {
    getBySlug.mockResolvedValue(null)
    const api = useBlogPost(ref('slug-ngawur'))
    await api.fetchPost()

    expect(api.notFound.value).toBe(true)
    expect(api.post.value).toBeNull()
    expect(api.loading.value).toBe(false)
  })

  it('treats a draft as not found', async () => {
    getBySlug.mockResolvedValue(post({ status: 'draft' }))
    const api = useBlogPost(ref('masih-draft'))
    await api.fetchPost()

    expect(api.notFound.value).toBe(true)
  })

  it('does NOT set notFound when the API throws — a real post must stay indexable', async () => {
    getBySlug.mockRejectedValue(new Error('Network Error'))
    const api = useBlogPost(ref('post-yang-ada'))
    await api.fetchPost()

    expect(api.notFound.value).toBe(false)
    expect(api.error.value).toBe('Post not found')
  })

  it('clears notFound when a later fetch succeeds', async () => {
    getBySlug.mockResolvedValueOnce(null)
    const api = useBlogPost(ref('slug'))
    await api.fetchPost()
    expect(api.notFound.value).toBe(true)

    getBySlug.mockResolvedValueOnce(post())
    await api.fetchPost()
    expect(api.notFound.value).toBe(false)
    expect(api.post.value?.title).toBe('Kenapa AI Pakai Design System')
  })

  it('fetches on mount', async () => {
    getBySlug.mockResolvedValue(post())
    // onMounted only fires inside a component instance, so mount a host that
    // captures the composable's return value.
    let api!: ReturnType<typeof useBlogPost>
    mount(
      defineComponent({
        setup() {
          api = useBlogPost(ref('kenapa-ai-pakai-design-system'))
          return () => h('div')
        },
      }),
    )
    await flushPromises()
    expect(api.post.value?.slug).toBe('kenapa-ai-pakai-design-system')
  })
})
