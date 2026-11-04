/**
 * Global search: scoring and result shaping.
 *
 * The sources are heterogeneous — markdown posts, quotes, snippets, links — and
 * only some of them are searchable server-side, so the app fetches a page of
 * each and ranks here. That makes the ranking the only thing standing between
 * the user and noise, hence it is pure, testable, and independent of Vue.
 *
 * Scoring is deliberately simple and explainable:
 *   title match beats body match, a prefix beats a mid-word hit, and every
 *   matched term adds to the score. Ties break on recency, then title.
 */

export type SearchKind = 'post' | 'snippet' | 'quote' | 'link' | 'achievement' | 'section' | 'page'

export interface SearchItem {
  id: string
  kind: SearchKind
  title: string
  /** Secondary line: excerpt, author, language, url… */
  subtitle: string
  /** Where a click goes. */
  to: string
  /** Text the query is matched against, beyond `title`. */
  body: string
  /** ISO date used for recency; may be empty. */
  date?: string
  /** Tags, matched too — a tag hit is a strong signal. */
  tags?: string[]
}

export interface SearchHit extends SearchItem {
  score: number
  /** Title with the matched range marked, for highlighting. */
  highlights: { start: number; end: number }[]
}

const TITLE_WEIGHT = 6
const TAG_WEIGHT = 4
const BODY_WEIGHT = 1
const PREFIX_BONUS = 3
const WORD_START_BONUS = 2

/** Split a query into lowercase terms; quoted phrases stay together. */
export function tokenize(query: string): string[] {
  const terms: string[] = []
  const re = /"([^"]+)"|(\S+)/g
  let match: RegExpExecArray | null
  while ((match = re.exec(query)) !== null) {
    const term = (match[1] ?? match[2] ?? '').trim().toLowerCase()
    if (term) terms.push(term)
  }
  return terms
}

interface FieldScore {
  score: number
  highlights: { start: number; end: number }[]
}

/**
 * Words that mean the same thing to a reader but not to a substring search.
 *
 * Scope is deliberately narrow: tool and domain vocabulary ("kode"/"code",
 * "checksum"/"hash"), not section names — those already carry aliases on the
 * static entries, and expanding them here would make every experience item
 * match the word "pengalaman".
 */
const SYNONYMS: Record<string, string[]> = {
  kode: ['code', 'snippet'],
  code: ['kode', 'snippet'],
  cuplikan: ['snippet', 'code'],
  snippet: ['cuplikan', 'code'],
  kutipan: ['quote'],
  quote: ['kutipan'],
  tautan: ['link', 'url'],
  link: ['tautan', 'url'],
  token: ['jwt'],
  jwt: ['token'],
  checksum: ['hash', 'digest'],
  hash: ['checksum', 'digest'],
  // No `tanggal`/`date` pair on purpose: "date" is a substring of "update" and
  // "validate", so the synonym matched every post containing either word. The
  // Timestamp page still answers "tanggal" through its own alias.
  foto: ['image', 'photo'],
  gambar: ['image'],
  image: ['gambar', 'foto'],
}

/**
 * Turn terms into variant groups: `['kode']` becomes
 * `[['kode', 'code', 'snippet']]`.
 *
 * The original term stays first, so a literal hit is still preferred — the
 * expansion only adds alternatives, it never replaces what the user typed.
 */
export function expandTerms(terms: string[]): string[][] {
  return terms.map((term) => [term, ...(SYNONYMS[term] ?? [])])
}

/** Score one field for every term group; 0 when any group has no variant. */
function scoreField(field: string, groups: string[][], weight: number): FieldScore {
  if (!field) return { score: 0, highlights: [] }
  const haystack = field.toLowerCase()
  let score = 0
  const highlights: { start: number; end: number }[] = []

  for (const group of groups) {
    // First variant that occurs wins, and the literal term is tried first.
    let at = -1
    let matched = group[0]!
    for (const variant of group) {
      const index = haystack.indexOf(variant)
      if (index !== -1) {
        at = index
        matched = variant
        break
      }
    }
    // Every group must match somewhere for the field to count: searching
    // "vue router" should not rank a page that only says "vue".
    if (at === -1) return { score: 0, highlights: [] }

    score += weight
    if (at === 0) score += PREFIX_BONUS
    else if (haystack[at - 1] === ' ' || haystack[at - 1] === '-' || haystack[at - 1] === '/') {
      score += WORD_START_BONUS
    }
    // Longer terms are more specific.
    score += Math.min(matched.length, 12) / 4
    highlights.push({ start: at, end: at + matched.length })
  }

  return { score, highlights }
}

/** Rank items against a query. An empty query yields no hits. */
export function rankItems(items: SearchItem[], query: string, limit = 20): SearchHit[] {
  const terms = tokenize(query)
  if (terms.length === 0) return []
  const groups = expandTerms(terms)

  const hits: SearchHit[] = []
  for (const item of items) {
    const title = scoreField(item.title, groups, TITLE_WEIGHT)
    // Tags are one joined field, not one field per tag: "vue router" is two
    // terms that may live in two different tags.
    const tagField = (item.tags ?? []).join(' ')
    const tagScore = scoreField(tagField, groups, TAG_WEIGHT).score
    const body = scoreField(item.body, groups, BODY_WEIGHT)

    // A title or tag hit is enough; otherwise the body must match every term.
    const score = title.score + tagScore + body.score
    if (score === 0) continue

    hits.push({ ...item, score, highlights: title.highlights })
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    // Recency: newer first. An item without a date sorts last among equals.
    const at = a.date ? Date.parse(a.date) : 0
    const bt = b.date ? Date.parse(b.date) : 0
    if (bt !== at) return bt - at
    return a.title.localeCompare(b.title)
  })

  return hits.slice(0, limit)
}

export interface HighlightPart {
  text: string
  match: boolean
}

/**
 * Split a title into plain and matched parts for rendering. Ranges come from
 * `rankItems` (already lowercased indices of the *lowercased* title, which has
 * the same length as the original for every case folding this app sees).
 */
export function highlightParts(title: string, ranges: { start: number; end: number }[]): HighlightPart[] {
  if (ranges.length === 0) return [{ text: title, match: false }]

  const sorted = [...ranges].sort((a, b) => a.start - b.start)
  const parts: HighlightPart[] = []
  let cursor = 0

  for (const range of sorted) {
    if (range.start < cursor) continue
    if (range.start > cursor) parts.push({ text: title.slice(cursor, range.start), match: false })
    parts.push({ text: title.slice(range.start, range.end), match: true })
    cursor = range.end
  }
  if (cursor < title.length) parts.push({ text: title.slice(cursor), match: false })
  return parts
}

/** Group hits by kind, preserving rank order inside each group. */
export function groupByKind(hits: SearchHit[]): { kind: SearchKind; hits: SearchHit[] }[] {
  // Navigation first: someone typing a tool name wants the tool, not the post
  // that mentions it. Content follows, longest-form last.
  const order: SearchKind[] = [
    'page',
    'section',
    'post',
    'snippet',
    'quote',
    'achievement',
    'link',
  ]
  return order
    .map((kind) => ({ kind, hits: hits.filter((hit) => hit.kind === kind) }))
    .filter((group) => group.hits.length > 0)
}
