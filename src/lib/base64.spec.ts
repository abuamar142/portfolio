import { describe, expect, it } from 'vitest'
import {
  base64ByteLength,
  base64ToBytes,
  decodeBase64,
  encodeBase64,
  fileToBase64,
} from '@/lib/base64'

/**
 * The cases here are the ones `btoa`/`atob` get wrong: anything outside
 * Latin-1, padding the user dropped, base64url pasted from a JWT, and payloads
 * too long for a spread call. Each is a real way this tool is used.
 */

describe('encodeBase64', () => {
  it('matches the known encodings', () => {
    expect(encodeBase64('')).toBe('')
    expect(encodeBase64('f')).toBe('Zg==')
    expect(encodeBase64('fo')).toBe('Zm8=')
    expect(encodeBase64('foo')).toBe('Zm9v')
    expect(encodeBase64('Hello, world!')).toBe('SGVsbG8sIHdvcmxkIQ==')
  })

  it('encodes UTF-8 instead of throwing on non-Latin-1', () => {
    // `btoa('héllo')` throws InvalidCharacterError.
    expect(encodeBase64('héllo')).toBe('aMOpbGxv')
    expect(encodeBase64('😀')).toBe('8J+YgA==')
    expect(decodeBase64(encodeBase64('café — 😀'))).toEqual({ ok: true, value: 'café — 😀' })
  })

  it('emits unpadded base64url on request', () => {
    expect(encodeBase64('f', 'url')).toBe('Zg')
    // Text "ûÿ" is UTF-8 C3 BB C3 BF -> "w7vDvw==", not the raw bytes FB FF.
    expect(encodeBase64('\u00fb\u00ff')).toBe('w7vDvw==')
    expect(encodeBase64('\u00fb\u00ff', 'url')).toBe('w7vDvw')
  })

  it('handles a payload past the spread-call limit', () => {
    const big = 'x'.repeat(300_000)
    const encoded = encodeBase64(big)
    expect(encoded.length).toBe(400_000)
    expect(decodeBase64(encoded)).toEqual({ ok: true, value: big })
  })
})

describe('decodeBase64', () => {
  it('round-trips and tolerates missing padding', () => {
    expect(decodeBase64('Zm9v')).toEqual({ ok: true, value: 'foo' })
    expect(decodeBase64('Zm8')).toEqual({ ok: true, value: 'fo' })
    expect(decodeBase64('Zg')).toEqual({ ok: true, value: 'f' })
  })

  it('ignores line wrapping but not a space inside the payload', () => {
    // Wrapping a payload between two encoded groups must not change the bytes.
    expect(decodeBase64('SGVsbG8s\nIHdvcmxkIQ==')).toEqual({ ok: true, value: 'Hello, world!' })
    // A space is not base64: the payload is corrupt, and saying so is the point.
    expect(decodeBase64('Zm 9v')).toMatchObject({ ok: false, error: 'Invalid base64 character " "' })
  })

  it('decodes base64url without being told', () => {
    // 0xFB 0xFF is not UTF-8 text, so the text decoder rejects it; the bytes
    // themselves still decode.
    expect(base64ToBytes('-_8')).toMatchObject({ ok: true })
    const bytes = base64ToBytes('-_8')
    expect(bytes.ok && [...bytes.bytes]).toEqual([0xfb, 0xff])
    // "w7vDvw" is the UTF-8 text "ûÿ"; the decoder accepts the url-safe
    // spelling of a payload that needs no padding.
    expect(decodeBase64('w7vDvw')).toEqual({ ok: true, value: '\u00fb\u00ff' })
  })

  it('rejects an impossible length', () => {
    expect(decodeBase64('Zm9v!')).toMatchObject({ ok: false })
    expect(decodeBase64('Z')).toMatchObject({
      ok: false,
      error: 'This cannot be base64: the length is impossible',
    })
  })

  it('rejects characters outside the alphabet', () => {
    expect(decodeBase64('Zm9v*')).toMatchObject({ ok: false, error: 'Invalid base64 character "*"' })
  })

  it('rejects padding in the middle', () => {
    expect(decodeBase64('Zg==Zg==')).toMatchObject({ ok: false })
  })

  it('rejects valid base64 that is not UTF-8 text', () => {
    // 0xff alone is not a valid UTF-8 sequence.
    const result = decodeBase64('/w==')
    expect(result).toEqual({ ok: false, error: 'The bytes are not valid UTF-8 text. This is binary data' })
  })
})

describe('base64ToBytes', () => {
  it('returns raw bytes so binary payloads stay usable', () => {
    const result = base64ToBytes('/w==')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect([...result.bytes]).toEqual([0xff])
  })

  it('returns an empty array for empty input', () => {
    expect(base64ToBytes('')).toMatchObject({ ok: true })
  })
})

describe('base64ByteLength', () => {
  it('reports the decoded size without decoding', () => {
    expect(base64ByteLength('Zm9v')).toBe(3)
    expect(base64ByteLength('Zg==')).toBe(1)
    expect(base64ByteLength('')).toBe(0)
    expect(base64ByteLength('Z')).toBe(0)
  })
})

describe('fileToBase64', () => {
  it('encodes a blob', async () => {
    const blob = new Blob([new Uint8Array([0x66, 0x6f, 0x6f])])
    expect(await fileToBase64(blob)).toBe('Zm9v')
  })
})
