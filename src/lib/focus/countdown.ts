/**
 * A countdown whose truth is a wall-clock deadline, not a tick counter.
 *
 * Decrementing `remaining` on every `setInterval` looks right and is wrong:
 * browsers throttle hidden tabs to roughly one tick per minute, a sleeping
 * laptop stops the interval entirely, and any drift accumulates for the whole
 * run. Storing `endsAt` means every question — how long is left, did it finish
 * while I was away — is answered by subtracting from the current time.
 *
 * The struct is plain data so it survives JSON persistence and can be compared
 * in tests; `now` is always injected for the same reason.
 */

export interface Countdown {
  /** Full length of the current run; the progress ring divides by it. */
  durationMs: number
  /** Wall-clock instant this run ends. `null` means paused or never started. */
  endsAt: number | null
  /** Time left while paused. Ignored while running (`endsAt` wins). */
  remainingMs: number
}

export function createCountdown(durationMs: number): Countdown {
  const total = Math.max(0, durationMs)
  return { durationMs: total, endsAt: null, remainingMs: total }
}

/** Milliseconds left at `now`; never negative. */
export function remainingAt(countdown: Countdown, now: number): number {
  if (countdown.endsAt === null) return Math.max(0, countdown.remainingMs)
  return Math.max(0, countdown.endsAt - now)
}

export function isCountdownRunning(countdown: Countdown): boolean {
  return countdown.endsAt !== null
}

/** True when a running countdown has reached zero but has not been reset. */
export function isCountdownFinished(countdown: Countdown, now: number): boolean {
  return countdown.endsAt !== null && remainingAt(countdown, now) === 0
}

/**
 * Start, or restart when the previous run already finished — pressing start on
 * `00:00` means "go again", which is what every timer does.
 */
export function startCountdown(countdown: Countdown, now: number): Countdown {
  const remaining = remainingAt(countdown, now)
  if (remaining <= 0) {
    // Restart: a finished run begins again at its full length and is running.
    const durationMs = countdown.durationMs
    return { durationMs, endsAt: now + durationMs, remainingMs: durationMs }
  }
  return { durationMs: countdown.durationMs, endsAt: now + remaining, remainingMs: remaining }
}

export function pauseCountdown(countdown: Countdown, now: number): Countdown {
  if (countdown.endsAt === null) return countdown
  return {
    durationMs: countdown.durationMs,
    endsAt: null,
    remainingMs: remainingAt(countdown, now),
  }
}

export function resetCountdown(countdown: Countdown, durationMs = countdown.durationMs): Countdown {
  return createCountdown(durationMs)
}

/**
 * Change the length. Always restarts: a half-run five-minute timer resized to
 * twenty-five cannot keep its elapsed portion meaningfully.
 */
export function setCountdownDuration(
  countdown: Countdown,
  durationMs: number,
  _now: number,
): Countdown {
  void _now
  return createCountdown(durationMs)
}

/**
 * Add or remove time mid-run (`+1 menit` / `-1 menit`).
 *
 * The duration grows with the new remaining time so the ring stays a truthful
 * fraction: adding a minute to a running timer would otherwise push progress
 * past 1 and draw a full circle for the rest of the run.
 */
export function nudgeCountdown(countdown: Countdown, deltaMs: number, now: number): Countdown {
  const remaining = remainingAt(countdown, now) + deltaMs
  if (remaining <= 0) {
    return { durationMs: countdown.durationMs, endsAt: null, remainingMs: 0 }
  }

  const durationMs = Math.max(countdown.durationMs, remaining)
  return {
    durationMs,
    endsAt: countdown.endsAt === null ? null : now + remaining,
    remainingMs: remaining,
  }
}

/** Elapsed fraction, 0..1 — what the progress ring draws. */
export function countdownProgress(countdown: Countdown, now: number): number {
  if (countdown.durationMs <= 0) return 1
  const elapsed = 1 - remainingAt(countdown, now) / countdown.durationMs
  return Math.min(1, Math.max(0, elapsed))
}
