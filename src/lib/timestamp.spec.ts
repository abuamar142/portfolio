import { describe, expect, it } from 'vitest'
import {
  describeDate,
  formatInOffset,
  formatOffset,
  parseTimestamp,
  toIso,
  toUnixMilliseconds,
  toUnixSeconds,
} from '@/lib/timestamp'

/**
 * A timestamp tool is wrong in two classic ways: it confuses seconds with
 * milliseconds, and it silently applies the browser's timezone. Both are
 * pinned here. Every date is constructed from an explicit epoch value so the
 * machine running the suite cannot change the result.
 */

const EPOCH_MS = 1_700_000_000_000 // 2023-11-14T22:13:20Z

describe('parseTimestamp', () => {
  it('reads 10-digit values as seconds', () => {
    const result = parseTimestamp('1700000000')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.unit).toBe('seconds')
    expect(result.date.getTime()).toBe(EPOCH_MS)
    expect(result.source).toBe('unix')
  })

  it('reads 13-digit values as milliseconds without being told', () => {
    const result = parseTimestamp('1700000000000')
    expect(result.ok && result.unit).toBe('milliseconds')
    expect(result.ok && result.date.getTime()).toBe(EPOCH_MS)
  })

  it('honours an explicit unit over the digit count', () => {
    const asSeconds = parseTimestamp('1700000000000', 'seconds')
    expect(asSeconds.ok && asSeconds.date.getTime()).toBe(1_700_000_000_000_000)

    const asMs = parseTimestamp('1700000000', 'milliseconds')
    expect(asMs.ok && asMs.date.getTime()).toBe(1_700_000_000)
  })

  it('accepts fractional seconds', () => {
    const result = parseTimestamp('1700000000.5')
    expect(result.ok && result.date.getTime()).toBe(EPOCH_MS + 500)
  })

  it('accepts negative timestamps (before 1970)', () => {
    const result = parseTimestamp('-86400')
    expect(result.ok && result.date.toISOString()).toBe('1969-12-31T00:00:00.000Z')
  })

  it('parses date strings', () => {
    const result = parseTimestamp('2023-11-14T22:13:20Z')
    expect(result.ok && result.date.getTime()).toBe(EPOCH_MS)
    expect(result.ok && result.source).toBe('date')
  })

  it('rejects empty and unparseable input', () => {
    expect(parseTimestamp('')).toEqual({ ok: false, error: 'Enter a timestamp or a date' })
    expect(parseTimestamp('   ')).toMatchObject({ ok: false })
    expect(parseTimestamp('not a date')).toMatchObject({ ok: false })
    expect(parseTimestamp('12345678901234567890')).toMatchObject({ ok: false })
  })
})

describe('formatInOffset', () => {
  it('renders UTC when the offset is zero', () => {
    expect(formatInOffset(new Date(EPOCH_MS), 0)).toBe('2023-11-14 22:13:20')
  })

  it('shifts by the offset without touching the instant', () => {
    const date = new Date(EPOCH_MS)
    expect(formatInOffset(date, 420)).toBe('2023-11-15 05:13:20')
    expect(formatInOffset(date, -180)).toBe('2023-11-14 19:13:20')
    expect(date.getTime()).toBe(EPOCH_MS)
  })

  it('crosses a date boundary correctly', () => {
    // 2023-12-31T23:30:00Z + 07:00 -> 2024-01-01 06:30:00
    const date = new Date('2023-12-31T23:30:00Z')
    expect(formatInOffset(date, 420)).toBe('2024-01-01 06:30:00')
  })
})

describe('formatOffset', () => {
  it('formats positive, negative and half-hour offsets', () => {
    expect(formatOffset(420)).toBe('+07:00')
    expect(formatOffset(-180)).toBe('-03:00')
    expect(formatOffset(330)).toBe('+05:30')
    expect(formatOffset(0)).toBe('+00:00')
    expect(formatOffset(-210)).toBe('-03:30')
  })
})

describe('epoch conversions', () => {
  it('converts both directions', () => {
    const date = new Date(EPOCH_MS)
    expect(toUnixSeconds(date)).toBe(1_700_000_000)
    expect(toUnixMilliseconds(date)).toBe(EPOCH_MS)
    expect(toIso(date)).toBe('2023-11-14T22:13:20.000Z')
  })

  it('floors sub-second values rather than rounding', () => {
    expect(toUnixSeconds(new Date(EPOCH_MS + 999))).toBe(1_700_000_000)
  })
})

describe('describeDate', () => {
  it('derives every row from one instant', () => {
    const parts = describeDate(new Date(EPOCH_MS), new Date(EPOCH_MS + 3 * 86_400_000))
    expect(parts.iso).toBe('2023-11-14T22:13:20.000Z')
    expect(parts.utc).toBe('2023-11-14 22:13:20')
    expect(parts.unixSeconds).toBe(1_700_000_000)
    expect(parts.unixMilliseconds).toBe(EPOCH_MS)
    expect(parts.relativeDays).toBe(-3)
    expect(parts.relative).toBe('3 days ago')
  })

  it('labels sub-minute, minute, hour, month and year distances', () => {
    const base = EPOCH_MS
    // Negative delta puts `now` before the date (the date is in the future).
    const at = (delta: number) => describeDate(new Date(base), new Date(base + delta)).relative
    expect(at(0)).toBe('just now')
    expect(at(-120_000)).toBe('2 minutes from now')
    expect(at(3 * 3_600_000)).toBe('3 hours ago')
    expect(at(300 * 86_400_000)).toBe('10 months ago')
    expect(at(400 * 86_400_000)).toBe('1 year ago')
  })
})
