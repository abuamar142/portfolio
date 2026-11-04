import { ref } from 'vue'
import { usePosts } from '@/composables/usePosts'
import { fetchQuotes } from '@/services/quote'
import { fetchSnippets } from '@/services/snippet'
import { fetchLinks } from '@/services/link'
import type { SearchItem } from '@/lib/search'

/**
 * One place that knows how to turn a query into searchable items.
 *
 * Posts are local markdown, so they are searched in full; the three API-backed
 * sources are fetched with the server's own `search` parameter (a page each)
 * and then re-ranked locally. That means a result can be missing because the
 * server's page did not include it — hence the page size, and why the fetch
 * failures are surfaced instead of being swallowed into an empty result list.
 */

/** How many rows each API asks for. Enough to re-rank, small enough to be fast. */
const PER_SOURCE = 20

export interface SearchSources {
  items: SearchItem[]
  /** Sources that failed, so the UI can say the list is partial. */
  failed: string[]
}

async function searchPosts(query: string): Promise<SearchItem[]> {
  const { listPublished } = usePosts()
  const { posts } = await listPublished({ search: query, limit: 50 })
  return posts.map((post) => ({
    id: `post-${post.slug}`,
    kind: 'post' as const,
    title: post.title,
    subtitle: post.excerpt ?? '',
    to: `/blogs/${post.slug}`,
    body: stripHtml(post.contentHtml ?? ''),
    date: post.publishedAt,
    tags: (post.tags ?? []).map((tag) => tag.tag ?? '').filter(Boolean),
  }))
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

export function useGlobalSearch() {
  const items = ref<SearchItem[]>([])
  const loading = ref(false)
  const failed = ref<string[]>([])

  /** Runs every source in parallel; a failing source does not cancel the rest. */
  async function search(query: string): Promise<SearchItem[]> {
    const q = query.trim()
    if (!q) {
      items.value = []
      failed.value = []
      return []
    }

    loading.value = true
    const failures: string[] = []

    const settle = async <T>(name: string, run: () => Promise<T[]>): Promise<T[]> => {
      try {
        return await run()
      } catch {
        failures.push(name)
        return []
      }
    }

    const [posts, quotes, snippets, links] = await Promise.all([
      settle('blog', () => searchPosts(q)),
      settle('quotes', async () =>
        (await fetchQuotes({ search: q, limit: PER_SOURCE })).quotes.map<SearchItem>((quote) => ({
          id: `quote-${quote.id}`,
          kind: 'quote',
          title: quote.content.slice(0, 80),
          subtitle: quote.author_name ? `— ${quote.author_name}` : '',
          to: `/quotes/${quote.id}`,
          body: quote.content,
          date: quote.created_at,
          tags: quote.tags,
        })),
      ),
      settle('snippets', async () =>
        (await fetchSnippets({ search: q, limit: PER_SOURCE })).snippets.map<SearchItem>((snippet) => ({
          id: `snippet-${snippet.id}`,
          kind: 'snippet',
          title: snippet.title,
          subtitle: snippet.language,
          to: `/snippets/${snippet.id}`,
          body: `${snippet.description} ${snippet.code.slice(0, 400)}`,
          date: snippet.created_at,
          tags: snippet.tags,
        })),
      ),
      settle('links', async () =>
        (await fetchLinks({ search: q, limit: PER_SOURCE })).links.map<SearchItem>((link) => ({
          id: `link-${link.id}`,
          kind: 'link',
          title: link.title,
          subtitle: link.url,
          to: '/links',
          body: `${link.description} ${link.url}`,
          date: link.created_at,
          tags: link.tags,
        })),
      ),
    ])

    loading.value = false
    failed.value = failures
    items.value = [...posts, ...quotes, ...snippets, ...links]
    return items.value
  }

  return { items, loading, failed, search }
}
