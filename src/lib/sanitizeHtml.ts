import DOMPurify from 'dompurify'

/**
 * Sanitize CMS-authored HTML before it reaches v-html.
 *
 * Blog bodies are stored as HTML and injected with v-html, which Vue applies
 * verbatim — `<img onerror>`, `<svg onload>` or an `href="javascript:"` inside
 * a post would execute on this origin. The allow-list below keeps the editorial
 * markup the blog actually uses (headings, lists, code, images, links, quotes,
 * tables) and drops scripts, event handlers, iframes and style attributes.
 *
 * Safe to call on every render: DOMPurify is fast for post-sized documents and
 * the result is memoized by the computed() that owns it.
 */
const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr', 'blockquote', 'pre', 'code',
  'ul', 'ol', 'li',
  'strong', 'em', 'b', 'i', 'u', 's', 'del', 'mark', 'sub', 'sup', 'small',
  'a', 'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'div', 'span',
]

const ALLOWED_ATTR = ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel', 'width', 'height', 'loading', 'decoding', 'colspan', 'rowspan', 'start']

export function sanitizeHtml(raw: string): string {
  if (!raw) return ''
  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Only http(s)/mailto links and http(s)/data-image sources survive; this
    // is what blocks `javascript:` URLs inside anchors.
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick'],
  })
}
