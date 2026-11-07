/**
 * JWT decoding — decode, never verify.
 *
 * A decoder is the right tool for "what is in this token"; it is the wrong
 * tool for "is this token trustworthy", and the two get confused constantly.
 * Nothing here touches the signature, `alg` is displayed but never honoured,
 * and `alg: none` is called out rather than accepted. The page says all of this
 * next to the output.
 *
 * Decoding is base64url without padding, and the payload is JSON — but a
 * decoder must survive the malformed tokens people paste while debugging, so
 * every failure carries the segment it happened in.
 */

import { base64ToBytes } from './base64'

export type JwtSegmentName = 'header' | 'payload'

export type JwtError = { ok: false; error: string; segment?: JwtSegmentName }

export interface JwtClaims {
  /** Registered claim, seconds since epoch. */
  exp?: number
  iat?: number
  nbf?: number
  iss?: string
  sub?: string
  aud?: string | string[]
  jti?: string
  [key: string]: unknown
}

export interface DecodedJwt {
  ok: true
  header: Record<string, unknown>
  claims: JwtClaims
  payload: Record<string, unknown>
  /** Raw base64url segments, for display. */
  segments: { header: string; payload: string; signature: string | null }
  /** `exp`/`nbf`/`iat` judgement against `now`. */
  expiry: JwtExpiry
  /** True when the token has no signature segment at all. */
  unsigned: boolean
}

export interface JwtExpiry {
  state: 'none' | 'valid' | 'expired' | 'not-yet-valid'
  /** Seconds until `exp` (negative when already expired). */
  remainingSeconds?: number
  /** Human label for the page, in English so it reads as a fact, not UI copy. */
  detail: string
}

function decodeSegment(segment: string, name: JwtSegmentName): { ok: true; json: unknown } | JwtError {
  if (!segment) return { ok: false, error: `The ${name} segment is empty`, segment: name }
  const bytes = base64ToBytes(segment)
  if (!bytes.ok) return { ok: false, error: `The ${name} is not valid base64url: ${bytes.error}`, segment: name }
  let text: string
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes.bytes)
  } catch {
    return { ok: false, error: `The ${name} is not valid UTF-8 text`, segment: name }
  }
  try {
    return { ok: true, json: JSON.parse(text) }
  } catch {
    return { ok: false, error: `The ${name} is not JSON`, segment: name }
  }
}

/** Is this a JWT-shaped string? Cheap check so the UI can hint early. */
export function looksLikeJwt(token: string): boolean {
  return token.trim().split('.').length === 3
}

/**
 * Decode a JWT. Returns `{ ok: false }` (never throws) for anything that is
 * not a well-formed three-segment token with a JSON header and payload.
 */
export function decodeJwt(token: string, now: Date = new Date()): DecodedJwt | JwtError {
  const trimmed = token.trim().replace(/^Bearer\s+/i, '')
  if (!trimmed) return { ok: false, error: 'Paste a JWT first' }

  const parts = trimmed.split('.')
  if (parts.length !== 3) {
    return {
      ok: false,
      error: `A JWT has 3 dot-separated segments; this has ${parts.length}`,
    }
  }

  const [headerSegment, payloadSegment, signatureSegment] = parts as [string, string, string]

  const header = decodeSegment(headerSegment, 'header')
  if (!header.ok) return header
  const payload = decodeSegment(payloadSegment, 'payload')
  if (!payload.ok) return payload

  if (!header.json || typeof header.json !== 'object' || Array.isArray(header.json)) {
    return { ok: false, error: 'The header is not a JSON object', segment: 'header' }
  }
  if (!payload.json || typeof payload.json !== 'object' || Array.isArray(payload.json)) {
    return { ok: false, error: 'The payload is not a JSON object', segment: 'payload' }
  }

  const claims = payload.json as JwtClaims
  return {
    ok: true,
    header: header.json as Record<string, unknown>,
    payload: payload.json as Record<string, unknown>,
    claims,
    segments: {
      header: headerSegment,
      payload: payloadSegment,
      signature: signatureSegment || null,
    },
    expiry: judgeExpiry(claims, now),
    unsigned: signatureSegment === '',
  }
}

/**
 * `exp`/`nbf` are seconds since the epoch. `exp` in the past means expired;
 * `nbf` in the future means the token is not valid yet.
 */
export function judgeExpiry(claims: JwtClaims, now: Date = new Date()): JwtExpiry {
  const nowSec = Math.floor(now.getTime() / 1000)
  const exp = typeof claims.exp === 'number' ? claims.exp : undefined
  const nbf = typeof claims.nbf === 'number' ? claims.nbf : undefined

  if (nbf !== undefined && nbf > nowSec) {
    return {
      state: 'not-yet-valid',
      remainingSeconds: nbf - nowSec,
      detail: `Not valid before ${new Date(nbf * 1000).toISOString()} (${nbf - nowSec}s from now)`,
    }
  }

  if (exp === undefined) {
    // A token without `exp` never expires — worth saying out loud.
    return nbf !== undefined
      ? { state: 'valid', detail: `Valid (nbf is in the past, no exp claim)` }
      : { state: 'none', detail: 'No exp claim — this token does not expire' }
  }

  const remaining = exp - nowSec
  if (remaining <= 0) {
    return {
      state: 'expired',
      remainingSeconds: remaining,
      detail: `Expired ${new Date(exp * 1000).toISOString()} (${Math.abs(remaining)}s ago)`,
    }
  }
  return {
    state: 'valid',
    remainingSeconds: remaining,
    detail: `Valid until ${new Date(exp * 1000).toISOString()} (${remaining}s left)`,
  }
}

/** Pretty JSON for display; keys keep their source order. */
export function prettyJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

