/**
 * Split plain text into text and URL segments so links can be rendered as
 * anchors.
 *
 * Achievement descriptions are written by hand in the dashboard and stored as
 * plain text, but a contribution is only worth reading if the PR and the
 * release it landed in can be opened. Rendering the whole string with `v-html`
 * would open an XSS hole for a field the API accepts as free text, so the
 * string is split here and each URL becomes an `<a>` whose href still goes
 * through `safeHref`.
 *
 * The URL pattern is deliberately narrow: an explicit scheme followed by
 * non-space characters. Bare domains are left as text, because prose like
 * "Streak 2.1.0" is full of things that look like hostnames.
 */
export interface TextSegment {
  type: 'text'
  value: string
}

export interface LinkSegment {
  type: 'link'
  value: string
}

export type Segment = TextSegment | LinkSegment

// `)` is allowed inside the match so balanced pairs survive; an unbalanced
// trailing one is trimmed below.
const URL_PATTERN = /https?:\/\/[^\s<>"']+/g

/**
 * Trailing punctuation belongs to the sentence, not to the URL:
 * "…releases/tag/v2.1.0." should link the path without the final dot.
 * Closing brackets are only trimmed when the URL does not open one itself,
 * so a Wikipedia-style `/foo_(bar)` survives intact.
 */
function trimTrailingPunctuation(url: string): string {
  let end = url.length
  while (end > 0) {
    const char = url[end - 1]
    if (char === '.' || char === ',' || char === ';' || char === ':') {
      end--
      continue
    }
    if (char === ')') {
      const open = (url.match(/\(/g) || []).length
      const close = (url.match(/\)/g) || []).length
      if (close <= open) break
      end--
      continue
    }
    break
  }
  return url.slice(0, end)
}

export function linkify(text: string): Segment[] {
  if (!text) return []

  const segments: Segment[] = []
  let cursor = 0

  for (const match of text.matchAll(URL_PATTERN)) {
    const start = match.index
    if (start === undefined) continue

    const url = trimTrailingPunctuation(match[0])

    if (start > cursor) {
      segments.push({ type: 'text', value: text.slice(cursor, start) })
    }
    segments.push({ type: 'link', value: url })

    // Punctuation trimmed off the URL is not skipped: the next text segment
    // starts here and picks it up, so "…v2.1.0." keeps its full stop.
    cursor = start + url.length
  }

  if (cursor < text.length) {
    segments.push({ type: 'text', value: text.slice(cursor) })
  }

  return segments
}
