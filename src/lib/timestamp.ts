/**
 * Unix timestamp <-> date parsing.
 *
 * Two things make a timestamp converter quietly wrong:
 *
 * 1. **Seconds vs milliseconds.** `Date` takes milliseconds; a 10-digit value
 *    is seconds. A tool that guesses "10 digits = seconds" is right until
 *    someone pastes a millisecond value from 1970, so the unit is decided from
 *    the digit count *and* reported back, and an explicit unit can override it.
 * 2. **The browser's timezone.** "12:00" means different instants in Jakarta
 *    and Berlin. Both sides are shown: the local rendering and the UTC one,
 *    with the offset spelled out, so the reader never has to guess which one a
 *    value came from.
 */

export type TimestampUnit = 'auto' | 'seconds' | 'milliseconds'

export type ParseResult =
  | { ok: true; date: Date; unit: 'seconds' | 'milliseconds'; source: 'unix' | 'date' }
  | { ok: false; error: string }

/** Digits that make a bare integer a millisecond value rather than seconds. */
const MS_THRESHOLD = 1e11

const NUMERIC_RE = /^-?\d{1,16}(?:\.\d+)?$/

/**
 * Parse whatever the user pasted: a bare unix timestamp (s or ms) or a date
 * string. `auto` decides the unit from the magnitude.
 */
export function parseTimestamp(input: string, unit: TimestampUnit = 'auto'): ParseResult {
  const text = input.trim()
  if (!text) return { ok: false, error: 'Enter a timestamp or a date' }

  if (NUMERIC_RE.test(text)) {
    const value = Number(text)
    if (!Number.isFinite(value)) return { ok: false, error: 'Not a finite number' }

    const resolved: 'seconds' | 'milliseconds' =
      unit === 'auto' ? (Math.abs(value) >= MS_THRESHOLD ? 'milliseconds' : 'seconds') : unit

    const ms = resolved === 'seconds' ? value * 1000 : value
    const date = new Date(ms)
    if (Number.isNaN(date.getTime())) return { ok: false, error: 'This is not a valid date' }
    return { ok: true, date, unit: resolved, source: 'unix' }
  }

  // ISO-ish and human dates. `Date.parse` accepts a lot, including bare years,
  // which is why a numeric-looking string never reaches here.
  const ms = Date.parse(text)
  if (Number.isNaN(ms)) return { ok: false, error: 'This is not a date this browser understands' }
  const date = new Date(ms)
  return { ok: true, date, unit: 'milliseconds', source: 'date' }
}

/** ISO 8601 with milliseconds, in UTC. */
export function toIso(date: Date): string {
  return date.toISOString()
}

/** Seconds since the epoch, floored the way a server would store it. */
export function toUnixSeconds(date: Date): number {
  return Math.floor(date.getTime() / 1000)
}

export function toUnixMilliseconds(date: Date): number {
  return date.getTime()
}

/**
 * `YYYY-MM-DD HH:mm:ss` in the given offset, without relying on the caller's
 * locale — a tool's output must not change when the browser language does.
 */
export function formatInOffset(date: Date, offsetMinutes: number): string {
  const shifted = new Date(date.getTime() + offsetMinutes * 60_000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}` +
    ` ${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}:${pad(shifted.getUTCSeconds())}`
  )
}

/** "+07:00" / "-03:30" — the offset itself, not a city name. */
export function formatOffset(offsetMinutes: number): string {
  const sign = offsetMinutes < 0 ? '-' : '+'
  const abs = Math.abs(offsetMinutes)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
}

/** The browser's current offset for `date`, in minutes east of UTC. */
export function localOffsetMinutes(date: Date): number {
  return -date.getTimezoneOffset()
}

export interface DateTimeParts {
  iso: string
  utc: string
  local: string
  offset: string
  unixSeconds: number
  unixMilliseconds: number
  /** Whole days from now; negative for the past. */
  relativeDays: number
  /** Human duration of the relative offset, e.g. "3 days ago". */
  relative: string
}

/** Everything the page shows, derived once so the rows cannot disagree. */
export function describeDate(date: Date, now: Date = new Date()): DateTimeParts {
  const offset = localOffsetMinutes(date)
  const diffMs = date.getTime() - now.getTime()
  const absDays = Math.floor(Math.abs(diffMs) / 86_400_000)

  return {
    iso: toIso(date),
    utc: formatInOffset(date, 0),
    local: formatInOffset(date, offset),
    offset: formatOffset(offset),
    unixSeconds: toUnixSeconds(date),
    unixMilliseconds: toUnixMilliseconds(date),
    relativeDays: Math.round(diffMs / 86_400_000),
    relative: relativeLabel(diffMs, absDays),
  }
}

function relativeLabel(diffMs: number, absDays: number): string {
  const past = diffMs < 0
  const unit = (n: number, name: string) => `${n} ${name}${n === 1 ? '' : 's'}${past ? ' ago' : ' from now'}`
  // Zero difference is "just now", not "in a moment": both sides of a
  // difference of 0 are the same instant.
  if (Math.abs(diffMs) < 60_000) return diffMs > 0 ? 'in a moment' : 'just now'
  const absMinutes = Math.floor(Math.abs(diffMs) / 60_000)
  if (absMinutes < 60) return unit(absMinutes, 'minute')
  const absHours = Math.floor(absMinutes / 60)
  if (absHours < 24) return unit(absHours, 'hour')
  if (absDays < 30) return unit(absDays, 'day')
  const months = Math.floor(absDays / 30)
  if (months < 12) return unit(months, 'month')
  return unit(Math.floor(months / 12), 'year')
}
