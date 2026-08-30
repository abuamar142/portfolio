import { ref } from 'vue'
import axios from 'axios'

const BACKEND_API = import.meta.env.VITE_BACKEND_URL || 'https://backend.abuamar.online'

export function usePosts() {
  const loading = ref(false)
  const errorMsg = ref<string | null>(null)

  async function listPublished({
    locale,
    search,
    limit = 20,
    offset = 0,
  }: { locale?: string; search?: string; limit?: number; offset?: number } = {}) {
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
    } catch (e: any) {
      errorMsg.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function getBySlug(slug: string, locale?: string | { locale?: string }) {
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
      const raw = body?.data ?? body
      if (!raw) return null
      if (Array.isArray(raw)) return raw[0] ?? null
      if (Array.isArray((raw as any)?.posts)) return (raw as any).posts[0] ?? null
      if (Array.isArray((body as any)?.posts)) return (body as any).posts[0] ?? null
      // raw is single post object (has slug/id/title)
      if (typeof raw === 'object' && ((raw as any).slug || (raw as any).id || (raw as any).title)) {
        return raw as any
      }
      // nested fallback
      const nested = (raw as any)?.data
      if (Array.isArray(nested)) return nested[0] ?? null
      if (Array.isArray(nested?.posts)) return nested.posts[0] ?? null
      return null
    } catch (e: any) {
      errorMsg.value = e.message
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
