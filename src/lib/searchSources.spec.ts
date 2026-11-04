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
    expect(items.filter((item) => item.kind === 'page')).toHaveLength(14)
    expect(items.filter((item) => item.kind === 'section')).toHaveLength(7)
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
})
