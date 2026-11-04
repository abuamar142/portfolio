import { afterEach, describe, expect, it, vi } from 'vitest'
import { isUuidV4, uuidBatch, uuidV4 } from '@/lib/uuid'

/**
 * The fallback path is the reason this file exists: `crypto.randomUUID` is
 * unavailable outside a secure context, so a UUID tool opened over http must
 * still produce real version-4 UUIDs rather than something that merely looks
 * like one.
 */

const CANONICAL = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe('uuidV4', () => {
  afterEach(() => {
    // `restoreAllMocks` does not undo `stubGlobal` — the deterministic RNG
    // installed below would leak into every later test in this file.
    vi.unstubAllGlobals()
  })

  it('produces a canonical v4 uuid through the platform RNG', () => {
    expect(uuidV4()).toMatch(CANONICAL)
  })

  it('produces the right shape without crypto.randomUUID', () => {
    vi.stubGlobal('crypto', {
      getRandomValues: (bytes: Uint8Array) => {
        for (let i = 0; i < bytes.length; i++) bytes[i] = i
        return bytes
      },
    })
    const uuid = uuidV4()
    expect(uuid).toBe('00010203-0405-4607-8809-0a0b0c0d0e0f')
    expect(uuid).toMatch(CANONICAL)
  })

  it('always sets the version and variant bits in the fallback', () => {
    let call = 0
    vi.stubGlobal('crypto', {
      getRandomValues: (bytes: Uint8Array) => {
        for (let i = 0; i < bytes.length; i++) bytes[i] = (call++ * 37) & 0xff
        return bytes
      },
    })
    for (let i = 0; i < 50; i++) expect(uuidV4()).toMatch(CANONICAL)
  })

})

describe('uuidBatch (real RNG)', () => {
  it('does not repeat itself', () => {
    expect(new Set(uuidBatch(200)).size).toBe(200)
  })
})

describe('uuidBatch', () => {
  it('returns the requested count', () => {
    expect(uuidBatch(5)).toHaveLength(5)
    expect(uuidBatch(1)).toHaveLength(1)
  })

  it('clamps nonsense counts instead of allocating forever', () => {
    expect(uuidBatch(0)).toHaveLength(1)
    expect(uuidBatch(-4)).toHaveLength(1)
    expect(uuidBatch(999_999)).toHaveLength(1000)
    expect(uuidBatch(Number.NaN)).toHaveLength(1)
  })
})

describe('isUuidV4', () => {
  it('accepts canonical v4 uuids in any case', () => {
    expect(isUuidV4('00010203-0405-4607-8809-0a0b0c0d0e0f')).toBe(true)
    expect(isUuidV4('  0F8E3C1A-2B4D-4E6F-8A9B-0C1D2E3F4A5B  ')).toBe(true)
  })

  it('rejects other versions and malformed values', () => {
    // v1
    expect(isUuidV4('c232ab00-9414-11ec-b3c8-9f6bdec6ff2c')).toBe(false)
    expect(isUuidV4('not-a-uuid')).toBe(false)
    expect(isUuidV4('')).toBe(false)
  })
})
