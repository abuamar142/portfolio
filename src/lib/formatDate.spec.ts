import { describe, expect, it } from 'vitest'
import { formatDateLong, formatDateShort } from '@/lib/formatDate'

/**
 * Six call sites once re-implemented this with their own locale ternary and one
 * drifted to `undefined` (silently following the OS locale instead of the site
 * language). These cases pin the two supported locales.
 */
describe('formatDate', () => {
  it('formats long dates per locale', () => {
    expect(formatDateLong('2026-09-25T00:00:00Z', 'id')).toMatch(/25 September 2026/)
    expect(formatDateLong('2026-09-25T00:00:00Z', 'en')).toMatch(/September 25, 2026/)
  })

  it('formats short dates per locale', () => {
    expect(formatDateShort('2026-09-25T00:00:00Z', 'id')).toMatch(/25 Sep 2026/)
    expect(formatDateShort('2026-09-25T00:00:00Z', 'en')).toMatch(/Sep 25, 2026/)
  })

  it('defaults to the Indonesian locale', () => {
    expect(formatDateLong('2026-09-25T00:00:00Z')).toMatch(/September 2026/)
  })

  it('returns an empty string for missing values', () => {
    expect(formatDateLong(null)).toBe('')
    expect(formatDateLong(undefined)).toBe('')
    expect(formatDateShort('')).toBe('')
  })

  it('shows unparseable input verbatim instead of "Invalid Date"', () => {
    expect(formatDateLong('bukan-tanggal')).toBe('bukan-tanggal')
  })
})
