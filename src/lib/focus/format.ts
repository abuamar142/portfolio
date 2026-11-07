/**
 * Display formatting for the time tools.
 *
 * Everything here is pure and takes the instant as an argument: a formatter
 * that reads `Date.now()` itself cannot be tested without freezing the clock,
 * and these are the functions most likely to be wrong at a boundary
 * (midnight, one hour, ninety-nine hundredths).
 */

/** Zero-pad a non-negative integer to at least two digits. */
export function pad2(value: number): string {
  return String(Math.trunc(Math.abs(value))).padStart(2, '0')
}

/**
 * `MM:SS`, or `H:MM:SS` once the duration reaches an hour.
 *
 * Truncates rather than rounds: a timer with 900 ms left reads `00:00` and is
 * finished, which is what the person watching it expects.
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) return `${hours}:${pad2(minutes)}:${pad2(seconds)}`
  return `${pad2(minutes)}:${pad2(seconds)}`
}

/** `MM:SS.cc` — the stopwatch reads hundredths; laps are decided there. */
export function formatStopwatch(ms: number): string {
  const total = Math.max(0, Math.floor(ms))
  const centiseconds = Math.floor((total % 1000) / 10)
  const totalSeconds = Math.floor(total / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const base =
    hours > 0 ? `${hours}:${pad2(minutes)}:${pad2(seconds)}` : `${pad2(minutes)}:${pad2(seconds)}`
  return `${base}.${pad2(centiseconds)}`
}

/** Parse `mm`, `mm:ss` or `h:mm:ss` into milliseconds; `null` when unusable. */
export function parseDurationInput(raw: string): number | null {
  const text = raw.trim()
  if (!text) return null

  const parts = text.split(':')
  if (parts.length > 3) return null
  if (parts.some((part) => part === '' || !/^\d+$/.test(part))) return null

  const numbers = parts.map(Number)
  let hours = 0
  let minutes = 0
  let seconds = 0
  if (numbers.length === 1) {
    // A bare number is minutes: "5" is the five-minute timer, not five seconds.
    minutes = numbers[0]
  } else if (numbers.length === 2) {
    minutes = numbers[0]
    seconds = numbers[1]
  } else {
    hours = numbers[0]
    minutes = numbers[1]
    seconds = numbers[2]
  }
  if (minutes > 59 || seconds > 59) return null

  const total = hours * 3_600_000 + minutes * 60_000 + seconds * 1000
  return total > 0 ? total : null
}

export interface ClockParts {
  /** `HH:MM` in the chosen zone, already rendered by Intl. */
  time: string
  /** `SS`, kept separate so the ticking digits can be styled apart. */
  seconds: string
  /** `AM`/`PM` (`en`) or empty in 24-hour mode. */
  meridiem: string
  /** Long weekday + date line under the clock. */
  date: string
}

/** BCP-47 tag for an app locale, matching `src/lib/formatDate.ts`. */
function tagFor(locale: string): string {
  return locale === 'en' ? 'en-US' : 'id-ID'
}

/**
 * Split the wall clock into the pieces the face renders.
 *
 * `formatToParts` is used instead of arithmetic on the timestamp because the
 * parts already carry the zone and the 12/24-hour rule; doing that by hand
 * would silently drop DST and half-hour offset zones.
 */
export function clockParts(
  at: number,
  options: { locale: string; hour12: boolean; timeZone?: string },
): ClockParts {
  const tag = tagFor(options.locale)
  const date = new Date(at)

  const partsOf = (formatOptions: Intl.DateTimeFormatOptions): Intl.DateTimeFormatPart[] =>
    new Intl.DateTimeFormat(tag, { ...formatOptions, timeZone: options.timeZone }).formatToParts(date)

  let timeParts: Intl.DateTimeFormatPart[]
  try {
    timeParts = partsOf({
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: options.hour12,
    })
  } catch {
    // An unknown IANA zone throws; fall back to the browser's own zone rather
    // than leaving the clock blank.
    timeParts = new Intl.DateTimeFormat(tag, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: options.hour12,
    }).formatToParts(date)
  }

  const pick = (type: Intl.DateTimeFormatPartTypes): string =>
    timeParts.find((part) => part.type === type)?.value ?? ''

  let dateLine: string
  try {
    dateLine = new Intl.DateTimeFormat(tag, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: options.timeZone,
    }).format(date)
  } catch {
    dateLine = new Intl.DateTimeFormat(tag, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  return {
    time: `${pick('hour')}:${pick('minute')}`,
    seconds: pick('second'),
    meridiem: pick('dayPeriod'),
    date: dateLine,
  }
}

/** `GMT+7` style offset for a zone, used as the label on the zone selector. */
export function zoneOffsetLabel(at: number, timeZone?: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset',
    }).formatToParts(new Date(at))
    return parts.find((part) => part.type === 'timeZoneName')?.value ?? ''
  } catch {
    return ''
  }
}
