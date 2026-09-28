import { ref, computed, onServerPrefetch, watch, onMounted, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePosts, type Post } from '@/composables/usePosts'
import { formatDateLong } from '@/lib/formatDate'
import { sanitizeHtml } from '@/lib/sanitizeHtml'

export function useBlogPost(slugRef: Ref<string>) {
  const { locale } = useI18n()
  const { getBySlug } = usePosts()
  const post = ref<Post | null>(null)
  const loading = ref(true)
  const error = ref('')
  // True when the API says this slug has no public post (missing or draft).
  // BlogDetail turns it into robots=noindex: an unknown slug is served the SPA
  // shell with HTTP 200 for browsers (nginx only 404s crawler user-agents, via
  // the preview server), so the page has to exclude itself from the index.
  // A plain network failure must NOT set this — a real post has to stay
  // indexable when the API merely hiccups.
  const notFound = ref(false)

  onServerPrefetch(async () => {
    try {
      const fetched = await getBySlug(slugRef.value, locale.value)
      if (!fetched || fetched.status === 'draft') {
        notFound.value = true
        throw new Error('Not found')
      }
      post.value = fetched
    } catch (e) {
      console.warn('[BlogDetail] prerender fetch failed', slugRef.value, locale.value, e)
      error.value = 'Post not found'
    } finally {
      loading.value = false
    }
  })

  async function fetchPost() {
    loading.value = true
    error.value = ''
    notFound.value = false
    try {
      const fetched = await getBySlug(slugRef.value, locale.value)
      if (import.meta.env.DEV) {
        console.debug('[BlogDetail] slug=', slugRef.value, 'locale=', locale.value, 'fetched=', fetched)
      }
      post.value = fetched
      if (!post.value) {
        notFound.value = true
        throw new Error('Not found')
      }
      if (post.value.status === 'draft') {
        notFound.value = true
        throw new Error('Not found')
      }
    } catch (e) {
      console.warn('[BlogDetail] failed to load', slugRef.value, 'locale', locale.value, e)
      if (!post.value) error.value = 'Post not found'
    } finally {
      loading.value = false
    }
  }

  // Blog bodies arrive as raw HTML from the CMS. Vue's v-html inserts it
  // verbatim, so a compromised/badly-authored record would be stored XSS on
  // this origin. Sanitize with a strict allow-list before it reaches the DOM
  // (SSR-safe: DOMPurify only runs in the browser, the prerendered pass keeps
  // the raw string and the client re-sanitizes on hydration).
  const contentHtml = computed(() => {
    const raw = post.value?.contentHtml || post.value?.content?.html || post.value?.excerpt || ''
    if (!raw) return ''
    if (typeof window === 'undefined') return raw
    return sanitizeHtml(raw)
  })
  const coverUrl = computed(() => post.value?.coverImage?.url || post.value?.cover?.url || '')
  const readingTime = computed(() => {
    if (!post.value) return 0
    const words = (post.value.contentHtml || post.value.content?.html || post.value.excerpt || '').replace(/<[^>]*>/g, '').split(/\s+/).length
    return Math.max(1, Math.ceil(words / 200))
  })

  function formatDate(iso?: string | null) {
    return formatDateLong(iso, locale.value)
  }

  function toggleLocale() {
    const next = locale.value === 'en' ? 'id' : 'en'
    locale.value = next as never
    try {
      localStorage.setItem('portfolio-language', next)
    } catch {}
  }

  watch(locale, () => fetchPost())
  watch(slugRef, () => fetchPost())
  onMounted(fetchPost)

  return { post, loading, error, notFound, fetchPost, contentHtml, coverUrl, readingTime, formatDate, toggleLocale }
}
