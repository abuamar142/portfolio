import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { mount } from '@vue/test-utils'
import { useCrudList } from '@/composables/useCrudList'

/**
 * useCrudList replaced ~40 duplicated lines in three list pages, so these
 * tests are the fence around that refactor: the behaviours that used to drift
 * (error clearing, debounce reset, page reset on filter change, unmount
 * cleanup) each get an explicit case.
 *
 * The composable reads/writes route query state, so every test mounts it
 * inside a real router rather than mocking useRoute.
 */
async function mountList<T>(options: Parameters<typeof useCrudList<T>>[0]) {
  const router = createRouter({ history: createWebHashHistory(), routes: [{ path: '/', component: { template: '<div/>' } }] })
  await router.push('/')
  await router.isReady()

  let api!: ReturnType<typeof useCrudList<T>>
  const wrapper = mount(
    defineComponent({
      setup() {
        api = useCrudList<T>(options)
        return () => h('div')
      },
    }),
    { global: { plugins: [router] } },
  )
  await nextTick()
  return { api, wrapper }
}

const pageOf = <T>(items: T[], total = items.length) => ({ items, total })

describe('useCrudList', () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  it('fetches on mount and exposes the returned items', async () => {
    const fetch = vi.fn(async () => pageOf(['a', 'b'], 2))
    const { api } = await mountList<string>({ fetch, limit: 10 })
    await vi.waitFor(() => expect(api.loading.value).toBe(false))
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(api.items.value).toEqual(['a', 'b'])
    expect(api.error.value).toBe(false)
  })

  it('passes search, tag, page and limit to the fetch function', async () => {
    const fetch = vi.fn(async () => pageOf<string>([], 0))
    const { api } = await mountList<string>({ fetch, limit: 18 })
    api.search.value = 'vue'
    api.selectedTag.value = 'dev'
    api.page.value = 2
    await api.fetchItems()
    expect(fetch).toHaveBeenLastCalledWith({ search: 'vue', tag: 'dev', page: 2, limit: 18 })
  })

  it('sets the error flag when the fetch rejects, and clears it on retry', async () => {
    const fetch = vi.fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(pageOf(['ok'], 1))
    const { api } = await mountList<string>({ fetch, limit: 10 })
    await vi.waitFor(() => expect(api.error.value).toBe(true))
    expect(api.loading.value).toBe(false)
    // Retry must clear the previous failure, otherwise the error panel sticks
    // around behind the fresh list.
    await api.fetchItems()
    expect(api.error.value).toBe(false)
    expect(api.items.value).toEqual(['ok'])
  })

  it('computes totalPages from total and limit', async () => {
    const fetch = vi.fn(async () => pageOf<string>([], 45))
    const { api } = await mountList<string>({ fetch, limit: 20 })
    await vi.waitFor(() => expect(api.total.value).toBe(45))
    expect(api.totalPages.value).toBe(3)
  })

  it('debounces search and restarts from page 1', async () => {
    vi.useFakeTimers()
    const fetch = vi.fn(async () => pageOf<string>([], 0))
    const { api } = await mountList<string>({ fetch, limit: 10, debounceMs: 300 })
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

    api.page.value = 4
    api.search.value = 'ku'
    api.debouncedFetch()
    // Not yet: the debounce window is still open.
    expect(fetch).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(300)
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(api.page.value).toBe(1)
  })

  it('restarts from page 1 when the tag filter changes', async () => {
    const fetch = vi.fn(async () => pageOf<string>([], 0))
    const { api } = await mountList<string>({ fetch, limit: 10 })
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
    api.page.value = 3
    api.onTagChange()
    expect(api.page.value).toBe(1)
  })

  it('moves between pages and stops at the edges', async () => {
    const fetch = vi.fn(async () => pageOf<string>([], 30))
    const { api } = await mountList<string>({ fetch, limit: 10 })
    await vi.waitFor(() => expect(api.totalPages.value).toBe(3))

    api.nextPage()
    expect(api.page.value).toBe(2)
    api.nextPage()
    expect(api.page.value).toBe(3)
    // Already on the last page: must not advance past it.
    api.nextPage()
    expect(api.page.value).toBe(3)

    api.prevPage()
    expect(api.page.value).toBe(2)
    api.prevPage()
    expect(api.page.value).toBe(1)
    // Already on the first page: must not go to 0.
    api.prevPage()
    expect(api.page.value).toBe(1)
  })

  it('resets to page 1 after a create', async () => {
    const fetch = vi.fn(async () => pageOf<string>([], 100))
    const { api } = await mountList<string>({ fetch, limit: 10 })
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
    api.page.value = 5
    api.afterCreate()
    expect(api.page.value).toBe(1)
  })

  it('forwards extra resource-specific params (snippet language)', async () => {
    const fetch = vi.fn(async () => pageOf<string>([], 0))
    const language = 'go'
    const { api } = await mountList<string>({
      fetch,
      limit: 10,
      extraParams: () => ({ language }),
    })
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
    expect(fetch).toHaveBeenCalledWith(expect.objectContaining({ language }))
    void api
  })

  it('cancels a pending debounce when the page unmounts', async () => {
    vi.useFakeTimers()
    const fetch = vi.fn(async () => pageOf<string>([], 0))
    const { api, wrapper } = await mountList<string>({ fetch, limit: 10, debounceMs: 300 })
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
    api.debouncedFetch()
    wrapper.unmount()
    vi.advanceTimersByTime(500)
    // The unmount cleared the timer: no fetch fired after teardown.
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
