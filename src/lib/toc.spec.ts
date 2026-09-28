import { describe, expect, it } from 'vitest'
import { addHeadingAnchors, slugifyHeading } from '@/lib/toc'

/**
 * The table of contents and the heading anchors have to come from one pass:
 * the list links to ids that only exist because the same function added them.
 * These cases pin the parts that are easy to get wrong — ids that collide,
 * headings that already carry an id from the CMS, and headings whose text is
 * not plain ASCII.
 */

describe('slugifyHeading', () => {
  it('lowercases and hyphenates', () => {
    expect(slugifyHeading('Kenapa Ini Bekerja?')).toBe('kenapa-ini-bekerja')
  })

  it('folds diacritics instead of dropping the word', () => {
    expect(slugifyHeading('Ringkasan Éksekutif')).toBe('ringkasan-eksekutif')
  })

  it('strips punctuation but keeps digits', () => {
    expect(slugifyHeading('1. Ant Design (antd)')).toBe('1-ant-design-antd')
  })

  it('collapses runs of separators and trims edges', () => {
    expect(slugifyHeading('  Solusi: AI + Custom Styling = Spaghetti  ')).toBe('solusi-ai-custom-styling-spaghetti')
  })

  it('caps length so a long heading does not produce an unusable fragment', () => {
    expect(slugifyHeading('a'.repeat(200)).length).toBeLessThanOrEqual(60)
  })

  it('returns an empty string when nothing usable remains', () => {
    expect(slugifyHeading('— · —')).toBe('')
  })
})

describe('addHeadingAnchors', () => {
  it('gives each h2/h3 an id and collects them in document order', () => {
    const { html, toc } = addHeadingAnchors(
      '<h2>Pertama</h2><p>isi</p><h3>Anak</h3><h2>Kedua</h2>',
    )

    expect(toc.map((t) => [t.text, t.level])).toEqual([
      ['Pertama', 2],
      ['Anak', 3],
      ['Kedua', 2],
    ])
    expect(html).toContain('<h2 id="pertama">')
    expect(html).toContain('<h3 id="anak">')
    expect(html).toContain('<h2 id="kedua">')
  })

  it('leaves h1 and h4+ alone — only h2/h3 are part of the outline', () => {
    const { html, toc } = addHeadingAnchors('<h1>Judul</h1><h2>Bagian</h2><h4>Kecil</h4>')
    expect(html).toContain('<h1>Judul</h1>')
    expect(html).toContain('<h4>Kecil</h4>')
    expect(toc).toHaveLength(1)
  })

  it('deduplicates identical headings so the second anchor is reachable', () => {
    const { html, toc } = addHeadingAnchors('<h2>Tips</h2><h2>Tips</h2>')
    expect(toc.map((t) => t.id)).toEqual(['tips', 'tips-2'])
    expect(html).toContain('id="tips"')
    expect(html).toContain('id="tips-2"')
  })

  it('keeps a CMS-authored id, but still deduplicates it', () => {
    const { html, toc } = addHeadingAnchors(
      '<h2 id="custom">Satu</h2><h2 id="custom">Dua</h2>',
    )
    expect(toc.map((t) => t.id)).toEqual(['custom', 'custom-2'])
    expect(html).toContain('id="custom"')
    expect(html).toContain('id="custom-2"')
  })

  it('reads the heading text through inline markup', () => {
    const { toc } = addHeadingAnchors('<h2>Pakai <code>design system</code> &amp; selesai</h2>')
    expect(toc[0]!.text).toBe('Pakai design system & selesai')
  })

  it('skips headings with no text rather than emitting a blank row', () => {
    const { toc } = addHeadingAnchors('<h2></h2><h2>   </h2><h2>Ada</h2>')
    expect(toc).toHaveLength(1)
    expect(toc[0]!.text).toBe('Ada')
  })

  it('is idempotent — re-running keeps the ids it already assigned', () => {
    const once = addHeadingAnchors('<h2>Bagian</h2><h2>Bagian</h2>')
    const twice = addHeadingAnchors(once.html)
    expect(twice.toc.map((t) => t.id)).toEqual(['bagian', 'bagian-2'])
  })

  it('handles empty input', () => {
    expect(addHeadingAnchors('')).toEqual({ html: '', toc: [] })
  })
})
