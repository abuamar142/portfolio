import { computed, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { useQueryNumberRef, useQueryStringRef } from '@/composables/useQueryRef'

/**
 * The list-page contract shared by quotes, links and snippets.
 *
 * Those three pages each carried their own copy of the same ~40 lines: a
 * debounced search, tag + page query state, prev/next helpers, loading and
 * error flags, and a reload that resets to page 1. Fixes had to be applied
 * three times and drifted (one page cleared its error flag, another did not).
 *
 * The caller supplies the resource specifics — the fetch function, the page
 * size, and optionally the initial extra query keys — and gets the state back.
 *
 * URL sync comes from useQueryRef, so search/filter/page stay shareable and
 * the back button keeps working exactly as before.
 */
export interface CrudListFetchParams {
  search?: string
  tag?: string
  page: number
  limit: number
  /** Resource-specific filters (e.g. snippet language). */
  [key: string]: string | number | undefined
}

export interface CrudListResult<T> {
  items: T[]
  total: number
}

/** Everything a list page needs back from the shared state machine. */
export interface CrudList<T> {
  items: Ref<T[]>
  loading: Ref<boolean>
  error: Ref<boolean>
  total: Ref<number>
  totalPages: Ref<number>
  search: Ref<string>
  selectedTag: Ref<string>
  page: Ref<number>
  fetchItems: () => Promise<void>
  debouncedFetch: () => void
  onTagChange: () => void
  prevPage: () => void
  nextPage: () => void
  afterCreate: () => void
}

export function useCrudList<T, P extends CrudListFetchParams = CrudListFetchParams>(options: {
  /** Performs the request. Receives search/tag/page/limit plus any extras. */
  fetch: (params: P) => Promise<CrudListResult<T>>
  /** Page size for this resource. */
  limit: number
  /** Extra query-string refs (e.g. a language filter); read on every fetch. */
  extraParams?: () => Record<string, string | number | undefined>
  debounceMs?: number
}): CrudList<T> {
  const items = ref([]) as Ref<T[]>
  const loading = ref(true)
  const error = ref(false)
  const total = ref(0)

  const search = useQueryStringRef<string>('q', '')
  const selectedTag = useQueryStringRef<string>('tag', '')
  const page = useQueryNumberRef('page', 1)

  const totalPages = computed(() => Math.ceil(total.value / options.limit))
  const debounceMs = options.debounceMs ?? 300

  async function fetchItems() {
    loading.value = true
    error.value = false
    try {
      const result = await options.fetch({
        search: search.value || undefined,
        tag: selectedTag.value || undefined,
        page: page.value,
        limit: options.limit,
        ...(options.extraParams?.() ?? {}),
      } as P)
      items.value = result.items ?? []
      total.value = result.total ?? 0
    } catch (e: unknown) {
      console.error('[crud-list] fetch failed', e)
      error.value = true
    } finally {
      loading.value = false
    }
  }

  // Search: always restart from page 1 so a query never lands on an empty
  // page 3 of a narrower result set.
  let debounceTimer: ReturnType<typeof setTimeout> | undefined
  function debouncedFetch() {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      page.value = 1
      void fetchItems()
    }, debounceMs)
  }

  // Tag change: same contract as search.
  function onTagChange() {
    page.value = 1
    void fetchItems()
  }

  function prevPage() {
    if (page.value > 1) {
      page.value--
      void fetchItems()
    }
  }

  function nextPage() {
    if (page.value < totalPages.value) {
      page.value++
      void fetchItems()
    }
  }

  /** After a create: new items sort first, so return to page 1. */
  function afterCreate() {
    page.value = 1
    void fetchItems()
  }

  onMounted(() => void fetchItems())
  onBeforeUnmount(() => clearTimeout(debounceTimer))

  return {
    items,
    loading,
    error,
    total,
    totalPages,
    search,
    selectedTag,
    page,
    fetchItems,
    debouncedFetch,
    onTagChange,
    prevPage,
    nextPage,
    afterCreate,
  }
}
