import { ref, computed, onServerPrefetch, watch, onMounted, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePosts, type Post } from '@/composables/usePosts'
import { formatDateLong } from '@/lib/formatDate'

export function useBlogPost(slugRef: Ref<string>) {
  const { locale } = useI18n()
  const { getBySlug } = usePosts()
  const post = ref<Post | null>(null)
  const loading = ref(true)
  const error = ref('')

  onServerPrefetch(async () => {
    try {
      const fetched = await getBySlug(slugRef.value, locale.value)
      if (!fetched || fetched.status === 'draft') throw new Error('Not found')
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
    try {
      const fetched = await getBySlug(slugRef.value, locale.value)
      if (import.meta.env.DEV) {
        console.debug('[BlogDetail] slug=', slugRef.value, 'locale=', locale.value, 'fetched=', fetched)
      }
      post.value = fetched
      if (!post.value) throw new Error('Not found')
      if (post.value.status === 'draft') throw new Error('Not found')
    } catch (e) {
      console.warn('[BlogDetail] failed to load', slugRef.value, 'locale', locale.value, e)
      if (!post.value) error.value = 'Post not found'
    } finally {
      loading.value = false
    }
  }

  const contentHtml = computed(() => post.value?.contentHtml || post.value?.content?.html || post.value?.excerpt || '')
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

  return { post, loading, error, fetchPost, contentHtml, coverUrl, readingTime, formatDate, toggleLocale }
}
