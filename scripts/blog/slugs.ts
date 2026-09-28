import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Build-time-only slug reader.
 *
 * `vite.config.ts` runs in plain Node *before* Vite transforms anything, so it
 * cannot use `import.meta.glob` (the helper does not exist yet) and cannot
 * import the runtime loader — that module's glob would be evaluated as a plain
 * function call and throw. This file therefore does the one thing the config
 * needs, with `node:fs`, and nothing else imports it.
 *
 * The runtime loader (`scripts/blog/content.ts`) is the source of truth for
 * what a post *is*; this only needs the file names, and both read the same
 * directory, so they cannot disagree about which posts exist.
 */

const BLOG_DIR = join(process.cwd(), 'content', 'blog')

/** Slugs from the frontmatter of every post, in directory order. */
export function readPostSlugs(): string[] {
  let files: string[]
  try {
    files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))
  } catch {
    // No directory means no posts — a valid state, and failing the build over
    // it would be worse than an empty blog.
    return []
  }

  return files
    .map((file) => {
      const raw = readFileSync(join(BLOG_DIR, file), 'utf8')
      const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)
      if (!match) throw new Error(`${file}: missing frontmatter block`)
      const slugLine = /^slug:\s*(.+)$/m.exec(match[1]!)
      if (!slugLine) throw new Error(`${file}: frontmatter is missing "slug"`)
      return slugLine[1]!.trim().replace(/^["']|["']$/g, '')
    })
    .filter(Boolean)
}
