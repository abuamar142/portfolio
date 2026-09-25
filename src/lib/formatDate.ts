/**
 * Locale-aware date formatting.
 *
 * Six call sites previously re-implemented this with the same
 * `locale === 'en' ? 'en-US' : 'id-ID'` ternary — and one drifted to
 * `undefined`, which silently followed the OS locale instead of the site
 * language. Keep the mapping in one place.
 */

/** Map an app locale (`id`/`en`) to a BCP-47 tag. */
export function dateLocaleFor(locale: string): string {
  return locale === 'en' ? 'en-US' : 'id-ID'
}

/** Long form: `25 September 2026` — bylines, detail pages. */
export function formatDateLong(value?: string | null, locale = 'id'): string {
  return formatDate(value, locale, { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Short form: `25 Sep 2026` — list cards, metadata rows. */
export function formatDateShort(value?: string | null, locale = 'id'): string {
  return formatDate(value, locale, { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatDate(
  value: string | null | undefined,
  locale: string,
  options: Intl.DateTimeFormatOptions,
): string {
  if (!value) return ''
  try {
    return new Intl.DateTimeFormat(dateLocaleFor(locale), options).format(new Date(value))
  } catch {
    // Unparseable input: show it verbatim rather than "Invalid Date".
    return String(value)
  }
}
