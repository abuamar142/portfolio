/**
 * UUID v4 generation.
 *
 * `crypto.randomUUID()` is the right call when it exists, but it is gated on a
 * secure context, so a page opened over plain http on a LAN IP throws. The
 * fallback builds the same shape from `crypto.getRandomValues`, which is
 * available more widely — and never from `Math.random`, because a UUID that
 * looks random but is not is the failure mode that bites later.
 */

/** RFC 4122 version 4 UUID from the platform RNG. */
export function uuidV4(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()

  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  // version 4
  bytes[6] = (bytes[6]! & 0x0f) | 0x40
  // variant 10xx
  bytes[8] = (bytes[8]! & 0x3f) | 0x80

  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

/** `count` distinct-looking UUIDs; the caller decides how to present them. */
export function uuidBatch(count: number): string[] {
  const safe = Math.min(Math.max(Math.floor(count) || 1, 1), 1000)
  return Array.from({ length: safe }, uuidV4)
}

/** True for a canonical version-4 UUID in any case. */
export function isUuidV4(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value.trim(),
  )
}
