import { describe, expect, it } from 'vitest'
import { loadPost, loadPosts, loadPostSlugs } from '../../scripts/blog/content'

/**
 * Posts come from Markdown files in `content/blog/`. The loader is the only
 * thing that knows how a file becomes a post, so the cases that matter are the
 * ones a hand-edited file can actually get wrong: frontmatter that does not
 * parse, a slug that collides with another file, and the ordering the list page
 * and sitemap depend on.
 *
 * These run against the real content directory — if a post is added with a
 * broken frontmatter, this suite fails rather than the site rendering blank.
 */

describe('blog content loader', () => {
  it('loads every post in the directory', () => {
    const posts = loadPosts()
    expect(posts.length).toBeGreaterThan(0)
  })

  it('gives each post the fields the pages render', () => {
    for (const p of loadPosts()) {
      expect(p.slug).toBeTruthy()
      expect(p.title).toBeTruthy()
      expect(p.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(p.contentHtml.length).toBeGreaterThan(0)
      expect(p.readingTime).toBeGreaterThanOrEqual(1)
    }
  })

  it('orders posts newest first', () => {
    const dates = loadPosts().map((p) => p.date)
    const sorted = [...dates].sort((a, b) => (a < b ? 1 : -1))
    expect(dates).toEqual(sorted)
  })

  it('renders Markdown into HTML', () => {
    const post = loadPost('kenapa-ai-pakai-design-system')
    expect(post).not.toBeNull()
    expect(post!.contentHtml).toContain('<h2')
    expect(post!.contentHtml).toContain('<p>')
  })

  it('parses the tag list from frontmatter', () => {
    const post = loadPost('kenapa-ai-pakai-design-system')
    expect(post!.tags).toEqual(['Web', 'Tools', 'AI'])
  })

  it('returns null for a slug that does not exist', () => {
    expect(loadPost('slug-yang-tidak-ada')).toBeNull()
  })

  it('exposes slugs without bodies', () => {
    const slugs = loadPostSlugs()
    expect(slugs).toContain('kenapa-ai-pakai-design-system')
    expect(slugs.length).toBe(loadPosts().length)
  })

  it('has no duplicate slugs — two files may not claim the same URL', () => {
    const slugs = loadPostSlugs()
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})
