import { ref } from 'vue'
import axios from 'axios'

const BACKEND_API = import.meta.env.VITE_BACKEND_URL || 'https://backend.abuamar.online'

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
      const { data } = await axios.get(`${BACKEND_API}/api/v1/personal/posts`, {
        params,
      })
      const raw = data.data
      const posts = Array.isArray(raw) ? raw : (raw?.posts || [])
      const total = data.total ?? raw?.total ?? posts.length
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
      const { data: body } = await axios.get(`${BACKEND_API}/api/v1/personal/posts`, {
        params,
      })
      // Defensive: backend list = { success, data: [...] } but detail by slug = { success, data: {...single} }
      // Handle all known shapes: data.data array | data.data.posts | data.posts | data itself (single object)
      const raw = (body as Record<string, unknown>)?.data ?? body
      if (!raw) return null
      if (Array.isArray(raw)) return (raw[0] as Post) ?? null
      if (Array.isArray((raw as Record<string, unknown>)?.posts)) {
        return ((raw as Record<string, unknown>).posts as Post[])[0] ?? null
      }
      if (Array.isArray((body as Record<string, unknown>)?.posts)) {
        return ((body as Record<string, unknown>).posts as Post[])[0] ?? null
      }
      // raw is single post object (has slug/id/title)
      if (typeof raw === 'object' && ((raw as Post).slug || (raw as Post).id || (raw as Post).title)) {
        return raw as Post
      }
      // nested fallback
      const nested = (raw as Record<string, unknown>)?.data
      if (Array.isArray(nested)) return (nested[0] as Post) ?? null
      if (Array.isArray((nested as Record<string, unknown>)?.posts)) {
        return ((nested as Record<string, unknown>).posts as Post[])[0] ?? null
      }
      return null
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
