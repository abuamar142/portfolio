import { ref } from 'vue'
import axios from 'axios'

const BACKEND_API = import.meta.env.VITE_BACKEND_URL || 'https://backend.abuamar.online'

export function usePosts() {
  const loading = ref(false)
  const errorMsg = ref<string | null>(null)

  async function listPublished({
    search,
    limit = 20,
    offset = 0,
  }: { search?: string; limit?: number; offset?: number } = {}) {
    loading.value = true
    errorMsg.value = null
    try {
      const params: Record<string, string | number> = { limit, offset }
      if (search && search.trim()) {
        params.search = search.trim()
      }
      const { data } = await axios.get(`${BACKEND_API}/api/v1/personal/posts`, {
        params,
      })
      const posts = data.data?.posts || []
      const total = data.data?.total ?? posts.length
      return { posts, total }
    } catch (e: any) {
      errorMsg.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function getBySlug(slug: string) {
    loading.value = true
    errorMsg.value = null
    try {
      const { data } = await axios.get(`${BACKEND_API}/api/v1/personal/posts`, {
        params: { slug },
      })
      return data.data?.posts?.[0] || null
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
