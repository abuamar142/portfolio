import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { renderMarkdownToHtml } from '@/utils/markdown'

export interface PostPayload {
  title: string
  slug: string
  status: 'draft' | 'published'
  tags: string[]
  cover_image_url?: string | null
  content_md?: string | null
}

const loading = ref(false)
const errorMsg = ref<string | null>(null)

export function usePosts() {
  async function listPublished({ search, limit = 20, cursor }: { search?: string; limit?: number; cursor?: string }) {
    let query = supabase
      .from('posts')
      .select('id,title,slug,cover_image_url,published_at,content_html')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)

    if (cursor) query = query.lt('published_at', cursor)
    if (search && search.trim()) {
      // Optional: full text search if configured
      query = query.textSearch('search_tsv', search)
    }
    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  async function getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('posts')
      .select('id,title,slug,status,content_md,content_html,cover_image_url,published_at,updated_at,tags')
      .eq('slug', slug)
      .maybeSingle()
    if (error) throw error
    return data
  }

  async function getById(id: string) {
    const { data, error } = await supabase
      .from('posts')
      .select('id,title,slug,status,content_md,content_html,cover_image_url,published_at,updated_at,tags')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    return data
  }

  async function listAllForAdmin({ search }: { search?: string }) {
    let query = supabase
      .from('posts')
      .select('id,title,slug,status,updated_at,published_at')
      .order('updated_at', { ascending: false })
    if (search && search.trim()) {
      query = query.textSearch('search_tsv', search)
    }
    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  async function createPost(payload: PostPayload) {
    const session = (await supabase.auth.getSession()).data.session
    const author_id = session?.user?.id
    if (!author_id) throw new Error('Not authenticated')

    const content_html = payload.content_md ? renderMarkdownToHtml(payload.content_md) : null
    const body: any = {
      author_id,
      title: payload.title,
      slug: payload.slug,
      status: payload.status,
      tags: payload.tags || [],
      cover_image_url: payload.cover_image_url || null,
      content_md: payload.content_md || null,
      content_html,
      published_at: payload.status === 'published' ? new Date().toISOString() : null,
    }
    const { data, error } = await supabase.from('posts').insert(body).select('id').maybeSingle()
    if (error) throw error
    return data
  }

  async function updatePost(id: string, payload: Partial<PostPayload>) {
    const content_html = payload.content_md !== undefined ? renderMarkdownToHtml(payload.content_md || '') : undefined
    const body: any = {
      ...(payload.title !== undefined ? { title: payload.title } : {}),
      ...(payload.slug !== undefined ? { slug: payload.slug } : {}),
      ...(payload.status !== undefined ? { status: payload.status } : {}),
      ...(payload.tags !== undefined ? { tags: payload.tags } : {}),
      ...(payload.cover_image_url !== undefined ? { cover_image_url: payload.cover_image_url } : {}),
      ...(payload.content_md !== undefined ? { content_md: payload.content_md } : {}),
      ...(content_html !== undefined ? { content_html } : {}),
      updated_at: new Date().toISOString(),
    }
    if (payload.status === 'published') body.published_at = new Date().toISOString()
    if (payload.status === 'draft') body.published_at = null

    const { data, error } = await supabase.from('posts').update(body).eq('id', id)
    if (error) throw error
    return data
  }

  async function deletePost(id: string) {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) throw error
    return true
  }

  async function publishPost(id: string) {
    const { error } = await supabase
      .from('posts')
      .update({ status: 'published', published_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  }

  async function unpublishPost(id: string) {
    const { error } = await supabase
      .from('posts')
      .update({ status: 'draft', published_at: null, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  }

  return {
    loading,
    errorMsg,
    listPublished,
    getBySlug,
    getById,
    listAllForAdmin,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    unpublishPost,
  }
}
