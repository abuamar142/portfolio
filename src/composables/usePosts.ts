import { ref } from 'vue'
import axios from 'axios'

const CMS_API = import.meta.env.VITE_CMS_API || 'http://localhost:3000/api'

const loading = ref(false)
const errorMsg = ref<string | null>(null)

export function usePosts() {
  async function listPublished({ search, limit = 20, cursor }: { search?: string; limit?: number; cursor?: string }) {
    loading.value = true
    errorMsg.value = null
    try {
      const params: Record<string, any> = {
        where: { status: { equals: 'published' } },
        limit,
        sort: '-publishedAt',
      }

      if (search && search.trim()) {
        params.where.title = { contains: search }
      }

      const { data } = await axios.get(`${CMS_API}/posts`, { params })
      return data.docs || []
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
      const { data } = await axios.get(`${CMS_API}/posts`, {
        params: {
          where: {
            slug: { equals: slug },
            status: { equals: 'published' },
          },
          limit: 1,
        },
      })
      return data.docs?.[0] || null
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
