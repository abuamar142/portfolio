import { describe, expect, it } from 'vitest'
import { linkify } from '@/lib/linkify'

/**
 * linkify is what lets a hand-written achievement description carry a working
 * PR and release link without v-html. These cases pin the boundary: which
 * characters end a URL, and that surrounding prose survives untouched.
 */
describe('linkify', () => {
  it('returns a single text segment when there is no URL', () => {
    expect(linkify('Merged a feature')).toEqual([
      { type: 'text', value: 'Merged a feature' },
    ])
  })

  it('returns nothing for empty input', () => {
    expect(linkify('')).toEqual([])
  })

  it('splits prose around a URL', () => {
    expect(linkify('See https://example.com for details')).toEqual([
      { type: 'text', value: 'See ' },
      { type: 'link', value: 'https://example.com' },
      { type: 'text', value: ' for details' },
    ])
  })

  it('handles several URLs in one description', () => {
    const segments = linkify(
      'PR https://github.com/a/b/pull/230 shipped in https://github.com/a/b/releases/tag/v2.1.0',
    )

    expect(segments.filter((s) => s.type === 'link')).toEqual([
      { type: 'link', value: 'https://github.com/a/b/pull/230' },
      { type: 'link', value: 'https://github.com/a/b/releases/tag/v2.1.0' },
    ])
  })

  it('leaves a trailing full stop out of the link', () => {
    expect(linkify('Shipped in https://example.com/releases/v2.1.0.')).toEqual([
      { type: 'text', value: 'Shipped in ' },
      { type: 'link', value: 'https://example.com/releases/v2.1.0' },
      { type: 'text', value: '.' },
    ])
  })

  it('leaves a trailing comma out of the link', () => {
    expect(linkify('Opened at https://example.com/pr, then merged')).toEqual([
      { type: 'text', value: 'Opened at ' },
      { type: 'link', value: 'https://example.com/pr' },
      { type: 'text', value: ', then merged' },
    ])
  })

  it('keeps balanced brackets inside the URL', () => {
    expect(linkify('See https://example.com/wiki/Foo_(bar) now')).toEqual([
      { type: 'text', value: 'See ' },
      { type: 'link', value: 'https://example.com/wiki/Foo_(bar)' },
      { type: 'text', value: ' now' },
    ])
  })

  it('trims an unbalanced closing bracket', () => {
    expect(linkify('(see https://example.com/pr)')).toEqual([
      { type: 'text', value: '(see ' },
      { type: 'link', value: 'https://example.com/pr' },
      { type: 'text', value: ')' },
    ])
  })

  it('keeps query strings and fragments intact', () => {
    expect(linkify('https://example.com/a?b=1&c=2#frag')).toEqual([
      { type: 'link', value: 'https://example.com/a?b=1&c=2#frag' },
    ])
  })

  it('ignores bare domains and other schemes', () => {
    expect(linkify('example.com and mailto:a@b.c and ftp://x.y')).toEqual([
      { type: 'text', value: 'example.com and mailto:a@b.c and ftp://x.y' },
    ])
  })

  it('links a URL that is the entire description', () => {
    expect(linkify('https://example.com')).toEqual([
      { type: 'link', value: 'https://example.com' },
    ])
  })
})
