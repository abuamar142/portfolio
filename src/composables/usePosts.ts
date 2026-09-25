import { ref } from 'vue'
import { backendClient } from '@/services/client'

export interface PostTag {
  tag?: string
}

export interface PostCover {
  url?: string
}

export interface PostContent {
  html?: string
}

export interface Post {
  _id?: string
  id?: string
  slug: string
  title: string
  status?: string
  excerpt?: string
  publishedAt?: string
  locale?: string
  contentHtml?: string
  content?: PostContent
  coverImage?: PostCover
  cover?: PostCover
  tags?: PostTag[]
}

interface PostsEnvelope {
  posts: Post[]
  total: number
}

export function usePosts() {
  const loading = ref(false)
  const errorMsg = ref<string | null>(null)

  async function listPublished({
    locale,
    search,
    limit = 20,
    offset = 0,
  }: { locale?: string; search?: string; limit?: number; offset?: number } = {}): Promise<PostsEnvelope> {
    loading.value = true
    errorMsg.value = null
    try {
      const params: Record<string, string | number> = { limit, offset }
      if (locale) params.locale = locale
      if (search && search.trim()) {
        params.search = search.trim()
      }
      const { data: body } = await backendClient.get('/personal/posts', { params })
      // List shape is { success, data: Post[], total, ... }.
      if (!body || typeof body !== 'object' || !('data' in body)) {
        return { posts: [], total: 0 }
      }
      const raw = body.data
      const posts = Array.isArray(raw) ? (raw as Post[]) : []
      const total = 'total' in body && typeof body.total === 'number' ? body.total : posts.length
      return { posts, total }
    } catch (e: unknown) {
      errorMsg.value = e instanceof Error ? e.message : String(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function getBySlug(slug: string, locale?: string | { locale?: string }): Promise<Post | null> {
    loading.value = true
    errorMsg.value = null
    try {
      const normalized = decodeURIComponent(String(slug || '').trim())
      if (!normalized) return null
      const resolvedLocale = typeof locale === 'string' ? locale : locale?.locale
      const params: Record<string, string> = { slug: normalized }
      if (resolvedLocale) params.locale = resolvedLocale
      const { data: body } = await backendClient.get('/personal/posts', { params })
      // The backend answers a slug query with the single matching post:
      // { success, data: {...} }. `data` is only an array on the list endpoint,
      // so tolerate that one case and drop the rest.
      if (!body || typeof body !== 'object' || !('data' in body)) return null
      const raw = body.data
      if (!raw || typeof raw !== 'object') return null
      if (Array.isArray(raw)) return (raw[0] as Post | undefined) ?? null
      return raw as Post
    } catch (e: unknown) {
      errorMsg.value = e instanceof Error ? e.message : String(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    errorMsg,
    listPublished,
    getBySlug,
  }
}
