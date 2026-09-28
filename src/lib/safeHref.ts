/**
 * Scheme allow-list for URLs that come from the API/CMS.
 *
 * Vue binds `:href` verbatim — it does not strip `javascript:` the way some
 * frameworks do — so any href sourced from server data is a potential script
 * URL. Server-side validation exists for the public feedback path, but a
 * stored `javascript:`/`data:` value (compromised record, future endpoint,
 * hand-edited row) would still become a live link here.
 *
 * Usage: `:href="safeHref(project.liveUrl)"` — returns '#' when the value is
 * missing or its scheme is not allowed, so the anchor stays inert.
 */
const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:']

export function safeHref(value?: string | null): string {
  if (!value) return '#'
  const trimmed = value.trim()
  if (!trimmed) return '#'
  try {
    const url = new URL(trimmed)
    return ALLOWED_PROTOCOLS.includes(url.protocol) ? trimmed : '#'
  } catch {
    // Relative links ('/quotes') and bare fragments are fine; anything that
    // cannot be parsed is not a URL we want in an href.
    return trimmed.startsWith('/') || trimmed.startsWith('#') ? trimmed : '#'
  }
}
