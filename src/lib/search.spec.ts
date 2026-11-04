import { describe, expect, it } from 'vitest'
import { groupByKind, highlightParts, rankItems, tokenize, type SearchItem } from '@/lib/search'

/**
 * The ranking is the whole product here: results are fetched per source and
 * merged, so a bad scorer shows up as "the thing I typed is not the first
 * result". These cases pin the ordering rules and the two easy mistakes —
 * matching any term instead of all of them, and letting a body hit outrank a
 * title hit.
 */

function item(overrides: Partial<SearchItem> & { id: string }): SearchItem {
  return {
    kind: 'post',
    title: 'Untitled',
    subtitle: '',
    to: `/${overrides.id}`,
    body: '',
    ...overrides,
  }
}

const corpus: SearchItem[] = [
  item({ id: 'vue-title', title: 'Vue Router in practice', body: 'nested routes and guards' }),
  item({ id: 'vue-body', title: 'Notes on state', body: 'how vue handles reactivity' }),
  item({ id: 'router-title', title: 'Router guards deep dive', body: 'navigation lifecycle' }),
  item({
    id: 'tagged',
    title: 'Unrelated title',
    body: 'nothing to see',
    tags: ['Vue', 'Router'],
  }),
  item({ id: 'no-match', title: 'Probably not', body: 'golang and postgres' }),
]

const ids = (hits: { id: string }[]) => hits.map((hit) => hit.id)

describe('tokenize', () => {
  it('splits on whitespace and lowercases', () => {
    expect(tokenize('Vue  Router')).toEqual(['vue', 'router'])
  })

  it('keeps a quoted phrase as one term', () => {
    expect(tokenize('"vue router" guards')).toEqual(['vue router', 'guards'])
  })

  it('drops empty input', () => {
    expect(tokenize('   ')).toEqual([])
    expect(tokenize('')).toEqual([])
  })
})

describe('rankItems', () => {
  it('returns nothing for an empty query', () => {
    expect(rankItems(corpus, '')).toEqual([])
  })

  it('requires every term, not any of them', () => {
    // "vue router" must match both words; vue-body only has "vue".
    expect(ids(rankItems(corpus, 'vue router'))).not.toContain('vue-body')
  })

  it('ranks a title match above a body match', () => {
    const hits = ids(rankItems(corpus, 'vue'))
    expect(hits.indexOf('vue-title')).toBeLessThan(hits.indexOf('vue-body'))
  })

  it('counts tag matches', () => {
    const hits = ids(rankItems(corpus, 'vue router'))
    expect(hits).toContain('tagged')
  })

  it('rewards a prefix over a mid-word hit', () => {
    const items = [
      item({ id: 'mid', title: 'The router thing' }),
      item({ id: 'prefix', title: 'Router things' }),
    ]
    expect(ids(rankItems(items, 'router'))[0]).toBe('prefix')
  })

  it('breaks score ties on recency, newest first', () => {
    const items = [
      item({ id: 'old', title: 'Same title', date: '2020-01-01' }),
      item({ id: 'new', title: 'Same title', date: '2024-01-01' }),
      item({ id: 'none', title: 'Same title' }),
    ]
    expect(ids(rankItems(items, 'same title'))).toEqual(['new', 'old', 'none'])
  })

  it('respects the limit', () => {
    const many = Array.from({ length: 50 }, (_, i) => item({ id: `i${i}`, title: `vue ${i}` }))
    expect(rankItems(many, 'vue', 5)).toHaveLength(5)
  })

  it('is case-insensitive and reports highlight ranges on the title', () => {
    const hits = rankItems(corpus, 'VUE')
    const hit = hits.find((h) => h.id === 'vue-title')
    expect(hit?.highlights[0]).toEqual({ start: 0, end: 3 })
  })
})

describe('highlightParts', () => {
  it('returns the whole string when nothing matched', () => {
    expect(highlightParts('Hello', [])).toEqual([{ text: 'Hello', match: false }])
  })

  it('splits around the matched range', () => {
    expect(highlightParts('Vue Router', [{ start: 0, end: 3 }])).toEqual([
      { text: 'Vue', match: true },
      { text: ' Router', match: false },
    ])
  })

  it('handles a match at the end and multiple ranges', () => {
    expect(highlightParts('a vue vue', [
      { start: 2, end: 5 },
      { start: 6, end: 9 },
    ])).toEqual([
      { text: 'a ', match: false },
      { text: 'vue', match: true },
      { text: ' ', match: false },
      { text: 'vue', match: true },
    ])
  })

  it('does not corrupt output when ranges overlap', () => {
    expect(highlightParts('vue router', [
      { start: 0, end: 3 },
      { start: 2, end: 6 },
    ])).toEqual([
      { text: 'vue', match: true },
      { text: ' router', match: false },
    ])
  })
})

describe('groupByKind', () => {
  it('groups in a stable kind order and drops empty groups', () => {
    const hits = rankItems(
      [
        item({ id: 'q', kind: 'quote', title: 'vue quote' }),
        item({ id: 'p', kind: 'post', title: 'vue post' }),
        item({ id: 'l', kind: 'link', title: 'vue link' }),
      ],
      'vue',
    )
    expect(groupByKind(hits).map((group) => group.kind)).toEqual(['post', 'quote', 'link'])
  })
})
