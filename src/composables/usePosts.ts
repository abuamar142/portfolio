import { ref } from 'vue'
import { loadPosts, type BlogPost } from '../../scripts/blog/content'

/**
 * Blog posts come from Markdown files in `content/blog/` — see the loader for
 * why that replaced the CMS. The loader resolves at build time via
 * `import.meta.glob`, so these functions work identically during SSG and in the
 * browser; nothing here touches the network.
 */

export interface PostTag {
  tag?: string
}

export interface Post {
  slug: string
  title: string
  excerpt?: string
  /** ISO date (YYYY-MM-DD). */
  publishedAt?: string
  contentHtml?: string
  tags?: PostTag[]
}

interface PostsEnvelope {
  posts: Post[]
  total: number
}

function toPost(p: BlogPost): Post {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: p.date,
    contentHtml: p.contentHtml,
    tags: p.tags.map((tag) => ({ tag })),
  }
}

export function usePosts() {
  const loading = ref(false)
  const errorMsg = ref<string | null>(null)

  async function listPublished({
    search,
    limit = 20,
    offset = 0,
  }: { locale?: string; search?: string; limit?: number; offset?: number } = {}): Promise<PostsEnvelope> {
    loading.value = true
    errorMsg.value = null
    try {
      let posts = loadPosts()

      const needle = search?.trim().toLowerCase()
      if (needle) {
        posts = posts.filter(
          (p) =>
            p.title.toLowerCase().includes(needle) ||
            p.excerpt.toLowerCase().includes(needle) ||
            p.markdown.toLowerCase().includes(needle) ||
            p.tags.some((t) => t.toLowerCase().includes(needle)),
        )
      }

      // The list page paginates in the browser, so slice here rather than
      // returning everything and trimming at the call site.
      return { posts: posts.slice(offset, offset + limit).map(toPost), total: posts.length }
    } catch (e) {
      errorMsg.value = e instanceof Error ? e.message : String(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function getBySlug(slug: string): Promise<Post | null> {
    loading.value = true
    errorMsg.value = null
    try {
      const found = loadPosts().find((p) => p.slug === slug)
      return found ? toPost(found) : null
    } catch (e) {
      errorMsg.value = e instanceof Error ? e.message : String(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, errorMsg, listPublished, getBySlug }
}
