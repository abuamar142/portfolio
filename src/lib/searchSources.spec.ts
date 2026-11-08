import { describe, expect, it } from 'vitest'
import { staticItems } from '@/lib/searchSources'
import { rankItems } from '@/lib/search'

/**
 * These entries are navigation, not content: the point is that a tool or a
 * section can be found by the word a person would actually type. The cases
 * below are the searches that were impossible before this source existed.
 */

const items = staticItems()

describe('staticItems', () => {
  it('covers every landing section and every page route', () => {
    const routes = items.map((item) => item.to)
    for (const route of [
      '/#about',
      '/#experiences',
      '/#projects',
      '/#skills',
      '/#education',
      '/#achievements',
      '/#contact',
      '/explore',
      '/blogs',
      '/quotes',
      '/snippets',
      '/links',
      '/feedback',
      '/qr',
      '/remove-bg',
      '/json',
      '/base64',
      '/hash',
      '/uuid',
      '/timestamp',
      '/jwt',
    ]) {
      expect(routes).toContain(route)
    }
  })

  it('gives every entry a unique id', () => {
    const ids = items.map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('tags pages and sections distinctly', () => {
    // Counting pages is not the point — that number changes every time a tool
    // ships. What must hold is that the two kinds never blur together.
    const pages = items.filter((item) => item.kind === 'page')
    const sections = items.filter((item) => item.kind === 'section')
    expect(pages.length).toBeGreaterThan(0)
    expect(sections.length).toBeGreaterThan(0)
    for (const page of pages) expect(page.to.startsWith('/')).toBe(true)
    for (const section of sections) expect(section.to.startsWith('/#')).toBe(true)
    expect(new Set(pages.map((p) => p.to)).size).toBe(pages.length)
  })

  it('indexes the game page', () => {
    const game = items.find((item) => item.to === '/tebak-kata')
    expect(game?.kind).toBe('page')
    // The aliases are what make it findable by intent, not by its own name.
    expect(game?.body).toContain('anagram')
    expect(game?.body).toContain('room')
  })

  it('carries the aliases as body text so synonyms can match', () => {
    const hash = items.find((item) => item.to === '/hash')
    expect(hash?.body).toContain('checksum')
    expect(hash?.body).toContain('sha256')
  })
})

describe('finding surfaces by what people type', () => {
  const topTo = (query: string) => rankItems(items, query, 5)[0]?.to

  it('finds each new tool by its name', () => {
    expect(topTo('base64')).toBe('/base64')
    expect(topTo('jwt')).toBe('/jwt')
    expect(topTo('uuid')).toBe('/uuid')
    expect(topTo('timestamp')).toBe('/timestamp')
    expect(topTo('hash')).toBe('/hash')
  })

  it('finds tools by Indonesian and English synonyms', () => {
    expect(rankItems(items, 'checksum').map((h) => h.to)).toContain('/hash')
    expect(rankItems(items, 'token').map((h) => h.to)).toContain('/jwt')
    expect(rankItems(items, 'epoch').map((h) => h.to)).toContain('/timestamp')
    expect(rankItems(items, 'hapus latar').map((h) => h.to)).toContain('/remove-bg')
  })

  it('finds a landing section by its Indonesian name', () => {
    expect(rankItems(items, 'pengalaman').map((h) => h.to)).toContain('/#experiences')
    expect(rankItems(items, 'keahlian').map((h) => h.to)).toContain('/#skills')
    expect(rankItems(items, 'sertifikat').map((h) => h.to)).toContain('/#achievements')
  })

  it('finds the tools hub by "jelajahi"', () => {
    expect(topTo('jelajahi')).toBe('/explore')
  })

  it('opens the requested time tab straight from the palette', () => {
    // Each mode is its own result, so "stopwatch" no longer just lands on the
    // clock tab and leaves the visitor to find the right one.
    expect(topTo('stopwatch')).toBe('/waktu?mode=stopwatch')
    expect(topTo('pomodoro')).toBe('/waktu?mode=pomodoro')
    expect(topTo('jam')).toBe('/waktu?mode=clock')
    expect(topTo('hitung mundur')).toBe('/waktu?mode=timer')
  })

  it('still offers the whole time page by its own name', () => {
    expect(rankItems(items, 'waktu').map((h) => h.to)).toContain('/waktu')
  })
})
