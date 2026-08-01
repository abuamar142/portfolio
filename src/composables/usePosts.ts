import { ref } from 'vue'
import axios from 'axios'

const BACKEND_API = import.meta.env.VITE_BACKEND_URL || 'https://backend.abuamar.online'

const loading = ref(false)
const errorMsg = ref<string | null>(null)

export function usePosts() {
  async function listPublished({ search, limit = 20 }: { search?: string; limit?: number } = {}) {
    loading.value = true
    errorMsg.value = null
    try {
      const { data } = await axios.get(`${BACKEND_API}/api/v1/personal/posts`, {
        params: { limit },
      })
      const posts = data.data?.posts || []
      if (search && search.trim()) {
        const q = search.toLowerCase()
        return posts.filter((p: any) =>
          p.title?.toLowerCase().includes(q) || p.excerpt?.toLowerCase().includes(q)
        )
      }
      return posts
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
