import { marked } from 'marked'

/**
 * Blog posts are Markdown files in `content/blog/`.
 *
 * This replaced the Payload CMS: posts used to arrive as Lexical JSON over an
 * HTTP call, which meant an editor UI, a database, a container and a vhost —
 * all to serve three files. Markdown in the repo keeps the writing portable
 * (plain text, diffable, no vendor format), and the prerender reads from the
 * bundle instead of the network, so a CMS outage can no longer fail a build.
 *
 * `import.meta.glob` is what makes this work in both environments: Vite
 * resolves it at build time into a static map, so the same module runs during
 * SSG (Node) and in the browser bundle — no `node:fs`, which would not exist
 * on the client. Posts are inlined as strings, which for a blog is the point:
 * the list page searches titles and bodies without a request.
 *
 * Frontmatter is parsed by hand rather than with a YAML dependency: the shape
 * is five known keys, and a parser would be more surface than the problem
 * deserves. Values are `key: value`; lists are `[a, b]`; strings may be quoted.
 */

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  /** Rendered HTML, safe to inject with v-html. */
  contentHtml: string
  /** Raw Markdown — search reads it, so a body match is findable. */
  markdown: string
  readingTime: number
}

export interface BlogFrontmatter {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
}

/** Words per minute used for the reading-time estimate shown in the UI. */
const WPM = 200

// eager: true — the bodies are needed on first render (SSG writes them into
// HTML), so lazy loading would only add a round trip.
const FILES = import.meta.glob('../../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function parseFrontmatter(raw: string, file: string): { meta: BlogFrontmatter; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!match) throw new Error(`${file}: missing frontmatter block`)

  const meta: Record<string, string> = {}
  for (const line of match[1]!.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue
    const at = line.indexOf(':')
    if (at === -1) continue
    const key = line.slice(0, at).trim()
    let value = line.slice(at + 1).trim()
    // Strip a matching pair of quotes; keep inner escapes literal.
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1).replace(/\\"/g, '"')
    }
    meta[key] = value
  }

  const tags = (meta.tags ?? '')
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  return {
    meta: {
      slug: meta.slug ?? '',
      title: meta.title ?? '',
      date: meta.date ?? '',
      excerpt: meta.excerpt ?? '',
      tags,
    },
    body: raw.slice(match[0].length),
  }
}

function countWords(markdown: string): number {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ') // fenced code is not reading prose
    .replace(/`[^`]*`/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
}

function toPost(raw: string, file: string): BlogPost {
  const { meta, body } = parseFrontmatter(raw, file)
  if (!meta.slug) throw new Error(`${file}: frontmatter is missing "slug"`)
  if (!meta.title) throw new Error(`${file}: frontmatter is missing "title"`)

  return {
    ...meta,
    markdown: body.trim(),
    // `async: false` keeps marked synchronous — both callers render immediately.
    contentHtml: marked.parse(body, { async: false, gfm: true, breaks: false }) as string,
    readingTime: Math.max(1, Math.ceil(countWords(body) / WPM)),
  }
}

let cache: BlogPost[] | null = null

/** Every post, newest first — the order both the list page and sitemap want. */
export function loadPosts(): BlogPost[] {
  if (cache) return cache

  const posts = Object.entries(FILES).map(([file, raw]) => toPost(raw, file))

  const seen = new Set<string>()
  for (const p of posts) {
    if (seen.has(p.slug)) throw new Error(`duplicate post slug: ${p.slug}`)
    seen.add(p.slug)
  }

  cache = posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  return cache
}

export function loadPost(slug: string): BlogPost | null {
  return loadPosts().find((p) => p.slug === slug) ?? null
}

export function loadPostSlugs(): string[] {
  return loadPosts().map((p) => p.slug)
}
