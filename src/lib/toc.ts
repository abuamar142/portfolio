/**
 * Blog bodies arrive as one HTML string. To give readers a table of contents
 * the headings need stable ids to link to, and the same list has to be built
 * from the same pass — deriving it twice (once for anchors, once for the list)
 * is how the two drift apart.
 *
 * Runs on the server too: the SSG pass prerenders the anchors and the list, so
 * crawlers see real links rather than markup that only appears after hydration.
 */

export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

export interface AnchoredContent {
  html: string
  toc: TocItem[]
}

const HEADING_RE = /<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi
const ID_ATTR_RE = /id\s*=\s*["']([^"']+)["']/i

/**
 * Slug from heading text. Deliberately ASCII-only: ids end up in URLs and
 * fragments, where non-ASCII gets percent-encoded into something unreadable.
 * Diacritics are folded rather than dropped so "Ringkasan Éksekutif" keeps its
 * words instead of collapsing.
 */
export function slugifyHeading(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
    .replace(/^-|-$/g, '')
}

function textOf(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Give every h2/h3 an id and collect them in document order.
 *
 * An id already present on the heading is kept — the CMS author may have
 * linked to it — but is still deduplicated, because two identical ids make the
 * second anchor unreachable.
 */
export function addHeadingAnchors(html: string): AnchoredContent {
  const toc: TocItem[] = []
  if (!html) return { html, toc }

  const used = new Set<string>()

  const anchored = html.replace(HEADING_RE, (match, tag: string, attrs: string, inner: string) => {
    const text = textOf(inner)
    // An empty heading would produce an unreachable anchor and a blank row.
    if (!text) return match

    const existing = ID_ATTR_RE.exec(attrs)?.[1]
    const base = existing ? slugifyHeading(existing) || existing : slugifyHeading(text)
    if (!base) return match

    let id = base
    let n = 2
    while (used.has(id)) id = `${base}-${n++}`
    used.add(id)

    const nextAttrs = existing
      ? attrs.replace(ID_ATTR_RE, `id="${id}"`)
      : `${attrs} id="${id}"`

    toc.push({ id, text, level: tag.toLowerCase() === 'h2' ? 2 : 3 })
    return `<${tag}${nextAttrs}>${inner}</${tag}>`
  })

  return { html: anchored, toc }
}
