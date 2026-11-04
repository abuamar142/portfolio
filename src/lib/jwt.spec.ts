import { describe, expect, it } from 'vitest'
import { decodeJwt, judgeExpiry, looksLikeJwt, prettyJson } from '@/lib/jwt'

/**
 * These vectors are built by hand (base64url of literal JSON) instead of being
 * produced by an encoder, so a change in the encoder cannot make a broken
 * decoder look correct.
 */

const HEADER = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' // {"alg":"HS256","typ":"JWT"}
const PAYLOAD = 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFidSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDAzNjAwfQ'
const TOKEN = `${HEADER}.${PAYLOAD}.sig`

// 2023-11-14T22:13:20Z — inside the token's window.
const NOW = new Date(1_700_000_000_000)

describe('decodeJwt', () => {
  it('decodes header, claims and the raw segments', () => {
    const result = decodeJwt(TOKEN, NOW)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.header).toEqual({ alg: 'HS256', typ: 'JWT' })
    expect(result.claims.sub).toBe('1234567890')
    expect(result.claims.name).toBe('Abu')
    expect(result.segments.header).toBe(HEADER)
    expect(result.segments.signature).toBe('sig')
    expect(result.unsigned).toBe(false)
  })

  it('strips a Bearer prefix and surrounding whitespace', () => {
    const result = decodeJwt(`  Bearer ${TOKEN}  `, NOW)
    expect(result.ok).toBe(true)
  })

  it('reports the segment that failed, not just "invalid"', () => {
    const badHeader = decodeJwt(`!!!.${PAYLOAD}.sig`, NOW)
    expect(badHeader).toMatchObject({ ok: false, segment: 'header' })

    const badPayload = decodeJwt(`${HEADER}.!!!.sig`, NOW)
    expect(badPayload).toMatchObject({ ok: false, segment: 'payload' })
  })

  it('rejects a segment that decodes to valid base64 but not JSON', () => {
    // "bm90IGpzb24" is the text "not json".
    const result = decodeJwt(`bm90IGpzb24.${PAYLOAD}.sig`, NOW)
    expect(result).toMatchObject({ ok: false, error: 'The header is not JSON' })
  })

  it('rejects JSON that is not an object', () => {
    // "MTIz" is the text "123".
    expect(decodeJwt(`MTIz.${PAYLOAD}.sig`, NOW)).toMatchObject({
      ok: false,
      error: 'The header is not a JSON object',
    })
  })

  it('counts the segments instead of guessing', () => {
    expect(decodeJwt(`${HEADER}.${PAYLOAD}`, NOW)).toMatchObject({
      ok: false,
      error: 'A JWT has 3 dot-separated segments; this has 2',
    })
    expect(decodeJwt('', NOW)).toMatchObject({ ok: false, error: 'Paste a JWT first' })
  })

  it('marks an empty signature segment as unsigned', () => {
    // {"alg":"none"} . {"sub":"x"} .
    const result = decodeJwt('eyJhbGciOiJub25lIn0.eyJzdWIiOiJ4In0.', NOW)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.unsigned).toBe(true)
    expect(result.header.alg).toBe('none')
  })

  it('accepts a payload without padding, as base64url allows', () => {
    const result = decodeJwt(`${HEADER}.eyJzdWIiOiJ4In0.sig`, NOW)
    expect(result.ok && result.claims.sub).toBe('x')
  })
})

describe('judgeExpiry', () => {
  const now = new Date(1_700_000_000_000) // 1700000000

  it('reports a valid window with seconds remaining', () => {
    expect(judgeExpiry({ exp: 1_700_003_600 }, now)).toMatchObject({
      state: 'valid',
      remainingSeconds: 3600,
    })
  })

  it('reports expiry, including exactly at the boundary', () => {
    expect(judgeExpiry({ exp: 1 }, now)).toMatchObject({ state: 'expired' })
    expect(judgeExpiry({ exp: 1_700_000_000 }, now).state).toBe('expired')
    expect(judgeExpiry({ exp: 1_700_000_001 }, now).state).toBe('valid')
  })

  it('reports a token that is not valid yet', () => {
    expect(judgeExpiry({ nbf: 1_900_000_000 }, now)).toMatchObject({
      state: 'not-yet-valid',
      remainingSeconds: 200_000_000,
    })
  })

  it('calls out a token with no exp claim', () => {
    expect(judgeExpiry({}, now)).toMatchObject({ state: 'none' })
    expect(judgeExpiry({ nbf: 1_600_000_000 }, now)).toMatchObject({ state: 'valid' })
  })

  it('ignores non-numeric exp values rather than coercing them', () => {
    expect(judgeExpiry({ exp: '1700003600' as unknown as number }, now).state).toBe('none')
  })
})

describe('looksLikeJwt', () => {
  it('is a cheap shape check', () => {
    expect(looksLikeJwt(TOKEN)).toBe(true)
    expect(looksLikeJwt('a.b')).toBe(false)
    expect(looksLikeJwt('a.b.c.d')).toBe(false)
  })
})

describe('prettyJson', () => {
  it('keeps key order and indents', () => {
    expect(prettyJson({ b: 1, a: 2 })).toBe('{\n  "b": 1,\n  "a": 2\n}')
  })
})
