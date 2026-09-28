import { describe, expect, it } from 'vitest'
import { safeHref } from '@/lib/safeHref'

/**
 * safeHref is the guard between API/CMS data and every dynamic :href in the
 * app — Vue binds those verbatim, so a `javascript:` value would be a live
 * script URL. These cases are the ones the audit found exposed.
 */
describe('safeHref', () => {
  it('passes http and https URLs through', () => {
    expect(safeHref('https://example.com/a?b=1')).toBe('https://example.com/a?b=1')
    expect(safeHref('http://example.com')).toBe('http://example.com')
  })

  it('allows mailto and tel', () => {
    expect(safeHref('mailto:hi@example.com')).toBe('mailto:hi@example.com')
    expect(safeHref('tel:+6285117692402')).toBe('tel:+6285117692402')
  })

  it('rejects javascript: URLs', () => {
    expect(safeHref('javascript:alert(document.domain)')).toBe('#')
    expect(safeHref('JaVaScRiPt:alert(1)')).toBe('#')
    expect(safeHref('  javascript:alert(1)  ')).toBe('#')
  })

  it('rejects other executable or unknown schemes', () => {
    expect(safeHref('data:text/html,<script>alert(1)</script>')).toBe('#')
    expect(safeHref('vbscript:msgbox(1)')).toBe('#')
    expect(safeHref('file:///etc/passwd')).toBe('#')
  })

  it('keeps in-app relative paths and fragments', () => {
    expect(safeHref('/quotes')).toBe('/quotes')
    expect(safeHref('#section')).toBe('#section')
  })

  it('returns an inert href for empty or missing values', () => {
    expect(safeHref('')).toBe('#')
    expect(safeHref('   ')).toBe('#')
    expect(safeHref(null)).toBe('#')
    expect(safeHref(undefined)).toBe('#')
  })
})
