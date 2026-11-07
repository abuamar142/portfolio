import { describe, expect, it } from 'vitest'
import {
  clockParts,
  formatDuration,
  formatStopwatch,
  pad2,
  parseDurationInput,
  zoneOffsetLabel,
} from '@/lib/focus/format'

describe('pad2', () => {
  it('pads to two digits and never emits a sign', () => {
    expect(pad2(0)).toBe('00')
    expect(pad2(7)).toBe('07')
    expect(pad2(42)).toBe('42')
    expect(pad2(123)).toBe('123')
  })
})

describe('formatDuration', () => {
  it('truncates instead of rounding, so the last second never lies', () => {
    expect(formatDuration(0)).toBe('00:00')
    expect(formatDuration(999)).toBe('00:00')
    expect(formatDuration(1000)).toBe('00:01')
    expect(formatDuration(1999)).toBe('00:01')
  })

  it('switches to hours only when there is one', () => {
    expect(formatDuration(59 * 60_000 + 59_000)).toBe('59:59')
    expect(formatDuration(60 * 60_000)).toBe('1:00:00')
    expect(formatDuration(2 * 3_600_000 + 5 * 60_000 + 9_000)).toBe('2:05:09')
  })

  it('clamps negative input rather than printing a minus sign', () => {
    expect(formatDuration(-5000)).toBe('00:00')
  })
})

describe('formatStopwatch', () => {
  it('keeps hundredths visible at zero and after a second', () => {
    expect(formatStopwatch(0)).toBe('00:00.00')
    expect(formatStopwatch(1234)).toBe('00:01.23')
    expect(formatStopwatch(59_999)).toBe('00:59.99')
  })

  it('adds hours when the run passes one', () => {
    expect(formatStopwatch(3_600_000)).toBe('1:00:00.00')
  })
})

describe('parseDurationInput', () => {
  it('reads bare minutes and mm:ss', () => {
    expect(parseDurationInput('5')).toBe(300_000)
    expect(parseDurationInput('05:30')).toBe(330_000)
    expect(parseDurationInput('1:02:03')).toBe(3_723_000)
  })

  it('rejects impossible or empty values', () => {
    expect(parseDurationInput('')).toBeNull()
    expect(parseDurationInput('0')).toBeNull()
    expect(parseDurationInput('5:99')).toBeNull()
    expect(parseDurationInput('abc')).toBeNull()
    expect(parseDurationInput('1:2:3:4')).toBeNull()
  })
})

describe('clockParts', () => {
  const instant = Date.UTC(2026, 8, 25, 14, 5, 9)

  it('renders 24-hour time with the seconds split out', () => {
    const parts = clockParts(instant, { locale: 'id', hour12: false, timeZone: 'UTC' })
    expect(parts.time).toBe('14:05')
    expect(parts.seconds).toBe('09')
    expect(parts.meridiem).toBe('')
  })

  it('renders a 12-hour clock with a meridiem', () => {
    const parts = clockParts(instant, { locale: 'en', hour12: true, timeZone: 'UTC' })
    expect(parts.time).toContain('02:05')
    expect(parts.meridiem).toBe('PM')
  })

  it('follows the requested zone, not the machine zone', () => {
    const parts = clockParts(instant, { locale: 'id', hour12: false, timeZone: 'Asia/Jakarta' })
    expect(parts.time).toBe('21:05')
  })

  it('falls back to the local zone instead of throwing on an unknown zone', () => {
    const parts = clockParts(instant, {
      locale: 'id',
      hour12: false,
      timeZone: 'Mars/Olympus',
    })
    expect(parts.time).toMatch(/^\d{2}:\d{2}$/)
    expect(parts.date.length).toBeGreaterThan(0)
  })
})

describe('zoneOffsetLabel', () => {
  it('labels the offsets the zone selector shows', () => {
    const instant = Date.UTC(2026, 8, 25, 14, 5, 9)
    expect(zoneOffsetLabel(instant, 'UTC')).toContain('GMT')
    expect(zoneOffsetLabel(instant, 'Asia/Jakarta')).toBe('GMT+7')
    expect(zoneOffsetLabel(instant, 'Asia/Jayapura')).toBe('GMT+9')
  })

  it('returns an empty label rather than throwing on a bad zone', () => {
    expect(zoneOffsetLabel(Date.now(), 'Not/AZone')).toBe('')
  })
})
