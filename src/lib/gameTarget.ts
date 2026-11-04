/**
 * Win condition, as the service computes it.
 *
 * This is duplicated logic on purpose — the server stays the authority — but it
 * lives here rather than inline in the page so the rule can be tested against
 * the documented behaviour. The lobby shows a preview built from it, and a
 * preview that disagrees with the server is worse than no preview: the host
 * would set up a five-round game and get eight.
 */

/** Target used when the host leaves it on automatic. */
export const MIN_TARGET = 5

/**
 * Resolves the number of words needed to win.
 *
 * An explicit target wins. Otherwise the room scales to twice its players with
 * a floor of five: with five words and eight players, most of a race-only room
 * finishes on zero points.
 */
export function resolveTarget(explicit: number, players: number): number {
  if (explicit > 0) return explicit
  return Math.max(MIN_TARGET, players * 2)
}
