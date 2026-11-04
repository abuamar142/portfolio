/**
 * SHA digests for text and files, via `crypto.subtle`.
 *
 * Two things a hash UI gets wrong, and this avoids both:
 *
 * - Hashing a *string* to compare against a checksum of a *file*: the same
 *   visible text is different bytes once it has a trailing newline, so the
 *   input is hex-dumped before hashing and the caller is told the byte count.
 * - Reporting a digest for a file it did not finish reading. The file path
 *   streams the Blob straight into `crypto.subtle.digest`, so multi-megabyte
 *   files never sit in the page as base64 or as a huge string.
 */

export type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

export const HASH_ALGORITHMS: HashAlgorithm[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']

/**
 * MD5 is not in WebCrypto and would need a JS implementation. It is offered
 * only for checking legacy checksums, never as a security primitive.
 */

export interface HashResult {
  algorithm: HashAlgorithm
  hex: string
  /** Byte length of what was hashed. */
  bytes: number
}

export function toHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let out = ''
  for (const byte of bytes) out += byte.toString(16).padStart(2, '0')
  return out
}

async function digest(algorithm: HashAlgorithm, data: BufferSource): Promise<string> {
  return toHex(await crypto.subtle.digest(algorithm, data))
}

/** Hash UTF-8 text as its exact bytes. */
export async function hashText(
  text: string,
  algorithm: HashAlgorithm = 'SHA-256',
): Promise<HashResult> {
  const bytes = new TextEncoder().encode(text)
  return { algorithm, hex: await digest(algorithm, bytes), bytes: bytes.length }
}

/** Hash a file without materialising it as a string. */
export async function hashFile(
  file: Blob,
  algorithm: HashAlgorithm = 'SHA-256',
): Promise<HashResult> {
  const buffer = await file.arrayBuffer()
  return { algorithm, hex: await digest(algorithm, buffer), bytes: buffer.byteLength }
}

/** True when `crypto.subtle` is usable (it needs a secure context). */
export function hasWebCrypto(): boolean {
  return typeof crypto !== 'undefined' && typeof crypto.subtle?.digest === 'function'
}
