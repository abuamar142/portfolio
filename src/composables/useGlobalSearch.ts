import { ref } from 'vue'
import { usePosts } from '@/composables/usePosts'
import { fetchQuotes } from '@/services/quote'
import { fetchSnippets } from '@/services/snippet'
import { fetchLinks } from '@/services/link'
import { fetchAchievements } from '@/services/achievement'
import { usePortfolio } from '@/composables/usePortfolio'
import { staticItems } from '@/lib/searchSources'
import type { SearchItem } from '@/lib/search'

/**
 * One place that knows how to build the searchable corpus.
 *
 * Everything is loaded **once**, in full, and ranked on the client:
 *
 * - The API sources are small enough to hold (32 links, 8 quotes, 9 snippets,
 *   24 achievements ≈ 43 KB in total), so the previous per-keystroke
 *   server-search was solving a problem this site does not have — and it had a
 *   real cost. The server only matches title/tag for links and
 *   title/description for snippets, so a word that appears in a link's
 *   description or inside a snippet's code was unfindable, and a page size cap
 *   silently dropped results past the limit.
 * - Posts are markdown files, already local, and are searched in full.
 * - Sections, tools and pages are static: they need no network at all.
 *
 * Loading happens on first open, not per keystroke, so typing never waits on a
 * request and the ranking always sees the whole corpus.
 */

/** Generous upper bound; the live corpus is far below it. */
const FETCH_LIMIT = 100

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

async function postItems(): Promise<SearchItem[]> {
  const { listPublished } = usePosts()
  // No `search`: take every post, and let the local ranking do the filtering.
  const { posts } = await listPublished({ limit: 100 })
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

async function quoteItems(): Promise<SearchItem[]> {
  const { quotes } = await fetchQuotes({ limit: FETCH_LIMIT })
  return quotes.map((quote) => ({
    id: `quote-${quote.id}`,
    kind: 'quote' as const,
    title: quote.content.slice(0, 90),
    subtitle: quote.author_name ? `— ${quote.author_name}` : '',
    to: `/quotes/${quote.id}`,
    body: `${quote.content} ${quote.author_name ?? ''}`,
    date: quote.created_at,
    tags: quote.tags,
  }))
}

async function snippetItems(): Promise<SearchItem[]> {
  const { snippets } = await fetchSnippets({ limit: FETCH_LIMIT })
  return snippets.map((snippet) => ({
    id: `snippet-${snippet.id}`,
    kind: 'snippet' as const,
    title: snippet.title,
    subtitle: snippet.language,
    to: `/snippets/${snippet.id}`,
    // The code is part of the body: searching for a function name is exactly
    // what a snippet vault is for, and the server never indexed it.
    body: `${snippet.description} ${snippet.code}`,
    date: snippet.created_at,
    tags: snippet.tags,
  }))
}

async function linkItems(): Promise<SearchItem[]> {
  const { links } = await fetchLinks({ limit: FETCH_LIMIT })
  return links.map((link) => ({
    id: `link-${link.id}`,
    kind: 'link' as const,
    title: link.title,
    subtitle: link.url,
    // The archive page is a single surface with anchors; every entry lands
    // there rather than on a detail route that does not exist.
    to: '/links',
    body: `${link.description} ${link.url}`,
    date: link.created_at,
    tags: link.tags,
  }))
}

async function achievementItems(): Promise<SearchItem[]> {
  const achievements = await fetchAchievements()
  return achievements.map((achievement) => ({
    id: `achievement-${achievement.id}`,
    kind: 'achievement' as const,
    title: achievement.title,
    subtitle: [achievement.organizer, achievement.type].filter(Boolean).join(' · '),
    to: '/#achievements',
    body: [achievement.description, achievement.participant_as, achievement.certificate_number]
      .filter(Boolean)
      .join(' '),
    date: achievement.date,
  }))
}

/**
 * Landing-page copy that is worth finding: the section headings and the
 * identity block. Read from the portfolio store when it has loaded, so the
 * search reflects what the page actually says.
 */
function portfolioItems(): SearchItem[] {
  const { portfolio } = usePortfolio()
  const data = portfolio.value
  if (!data) return []

  const items: SearchItem[] = [
    {
      id: 'portfolio-about',
      kind: 'section',
      title: data.personalInfo.fullname,
      subtitle: data.personalInfo.title ?? '',
      to: '/#about',
      body: data.about,
    },
  ]

  for (const project of data.projects) {
    items.push({
      id: `project-${project.title}`,
      kind: 'section',
      title: project.title,
      subtitle: project.technologies.join(' · '),
      to: '/#projects',
      body: project.description,
      tags: project.technologies,
    })
  }

  for (const experience of data.experiences) {
    items.push({
      id: `experience-${experience.company}-${experience.position}`,
      kind: 'section',
      title: `${experience.position} — ${experience.company}`,
      subtitle: experience.duration,
      to: '/#experiences',
      body: experience.description.join(' '),
      tags: experience.technologies ?? [],
    })
  }

  for (const skill of data.skills) {
    items.push({
      id: `skill-${skill.name}`,
      kind: 'section',
      title: skill.name,
      subtitle: skill.category,
      to: '/#skills',
      body: `${skill.category} ${skill.level}`,
    })
  }

  return items
}

export function useGlobalSearch() {
  const items = ref<SearchItem[]>([])
  const loading = ref(false)
  const failed = ref<string[]>([])
  /** The corpus is loaded once per session; `null` means "not yet". */
  let corpus: Promise<SearchItem[]> | null = null

  async function loadCorpus(): Promise<SearchItem[]> {
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

    const [posts, quotes, snippets, links, achievements] = await Promise.all([
      settle('blog', postItems),
      settle('quotes', quoteItems),
      settle('snippets', snippetItems),
      settle('links', linkItems),
      settle('achievements', achievementItems),
    ])

    loading.value = false
    failed.value = failures
    items.value = [
      ...staticItems(),
      ...portfolioItems(),
      ...posts,
      ...quotes,
      ...snippets,
      ...links,
      ...achievements,
    ]
    return items.value
  }

  /** The whole corpus, loading it on first use. Never fetches per keystroke. */
  async function search(): Promise<SearchItem[]> {
    corpus ??= loadCorpus()
    return corpus
  }

  /** Drop the cache (e.g. after a create/update elsewhere in the app). */
  function invalidate() {
    corpus = null
    items.value = []
  }

  return { items, loading, failed, search, invalidate }
}
