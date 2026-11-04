/**
 * Base64 for text, bytes and files — UTF-8 safe and strict about its input.
 *
 * `btoa` only accepts Latin-1, so handing it a string with an emoji throws
 * `InvalidCharacterError`. Everything here goes through `TextEncoder`/
 * `TextDecoder` instead, which is also why decoding a document that is not
 * valid UTF-8 fails loudly rather than yielding mojibake.
 *
 * The decoder is deliberately not `atob`-plus-hope: it rejects a length that
 * cannot be base64, characters outside the alphabet, and misplaced padding, and
 * it says which of those happened.
 */

export type Base64Variant = 'standard' | 'url'

export type Base64Result = { ok: true; value: string } | { ok: false; error: string }

export type Base64BytesResult = { ok: true; bytes: Uint8Array } | { ok: false; error: string }

const STANDARD_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

export function bytesToBase64(bytes: Uint8Array): string {
  // Chunked: `String.fromCharCode(...bytes)` blows the call stack past ~100k
  // arguments, which a 200 KB paste reaches easily.
  let binary = ''
  const CHUNK = 0x8000
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  }
  return btoa(binary)
}

/** Decode any base64 spelling (standard or url-safe) into raw bytes. */
export function base64ToBytes(input: string): Base64BytesResult {
  // Only line-wrapping whitespace is ignorable — a space inside the payload is
  // a decode error, not something to silently swallow.
  const text = input.replace(/[\r\n\t]+/g, '').trim()
  if (text.length === 0) return { ok: true, bytes: new Uint8Array() }

  // Accept base64url too: `-`/`_` are unambiguous with `+`/`/`, so a payload
  // copied from a JWT or a URL decodes without the user picking a variant.
  const normalized = text.replace(/-/g, '+').replace(/_/g, '/')
  const withoutPadding = normalized.replace(/={1,2}$/, '')

  if (withoutPadding.includes('=')) {
    return { ok: false, error: 'Padding "=" may only appear at the end' }
  }
  // Character check first: a stray "*" also breaks the length rule, and the
  // character is the actionable fact.
  for (const ch of withoutPadding) {
    if (!STANDARD_ALPHABET.includes(ch)) {
      return { ok: false, error: `Invalid base64 character "${ch}"` }
    }
  }
  if (withoutPadding.length % 4 === 1) {
    return { ok: false, error: 'This cannot be base64: the length is impossible' }
  }

  const padded = withoutPadding + '='.repeat((4 - (withoutPadding.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return { ok: true, bytes }
}

function toUrlSafe(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Encode UTF-8 text. `url` emits the unpadded base64url alphabet. */
export function encodeBase64(text: string, variant: Base64Variant = 'standard'): string {
  const base64 = bytesToBase64(new TextEncoder().encode(text))
  return variant === 'url' ? toUrlSafe(base64) : base64
}

/** Decode to UTF-8 text. Never throws; bad input comes back as `{ ok: false }`. */
export function decodeBase64(input: string): Base64Result {
  const result = base64ToBytes(input)
  if (!result.ok) return result
  try {
    // `fatal` turns invalid UTF-8 into an error instead of U+FFFD, because a
    // decoder that silently substitutes is the wrong tool for decoding data.
    return { ok: true, value: new TextDecoder('utf-8', { fatal: true }).decode(result.bytes) }
  } catch {
    return { ok: false, error: 'The bytes are not valid UTF-8 text — this is binary data' }
  }
}

/** Encode a file's bytes without a FileReader round trip. */
export async function fileToBase64(file: Blob): Promise<string> {
  return bytesToBase64(new Uint8Array(await file.arrayBuffer()))
}

/** Largest byte length `input` could decode to — for the size readout. */
export function base64ByteLength(input: string): number {
  const text = input.replace(/[\r\n\t]+/g, '').trim().replace(/=+$/, '')
  if (text.length % 4 === 1) return 0
  return Math.floor((text.length * 3) / 4)
}
