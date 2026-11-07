import { describe, expect, it } from 'vitest'
import {
  countdownProgress,
  createCountdown,
  isCountdownFinished,
  isCountdownRunning,
  nudgeCountdown,
  pauseCountdown,
  remainingAt,
  resetCountdown,
  setCountdownDuration,
  startCountdown,
} from '@/lib/focus/countdown'

const MINUTE = 60_000
const T0 = 1_700_000_000_000

describe('countdown', () => {
  it('starts paused at its full duration', () => {
    const countdown = createCountdown(5 * MINUTE)
    expect(countdown.remainingMs).toBe(5 * MINUTE)
    expect(countdown.endsAt).toBeNull()
    expect(isCountdownRunning(countdown)).toBe(false)
    expect(remainingAt(countdown, T0)).toBe(5 * MINUTE)
  })

  it('derives the remaining time from the deadline, so a throttled tab cannot drift', () => {
    const running = startCountdown(createCountdown(5 * MINUTE), T0)

    expect(running.endsAt).toBe(T0 + 5 * MINUTE)
    // No ticks happened in between — only wall-clock time passed.
    expect(remainingAt(running, T0 + 3 * MINUTE)).toBe(2 * MINUTE)
    expect(remainingAt(running, T0 + 5 * MINUTE)).toBe(0)
    expect(remainingAt(running, T0 + 9 * MINUTE)).toBe(0)
  })

  it('banks the remaining time on pause and resumes from it', () => {
    const paused = pauseCountdown(startCountdown(createCountdown(5 * MINUTE), T0), T0 + 2 * MINUTE)

    expect(paused.endsAt).toBeNull()
    expect(paused.remainingMs).toBe(3 * MINUTE)

    const resumed = startCountdown(paused, T0 + 10 * MINUTE)
    expect(resumed.endsAt).toBe(T0 + 13 * MINUTE)
  })

  it('reports finished only for a run that actually reached zero', () => {
    expect(isCountdownFinished(createCountdown(MINUTE), T0)).toBe(false)
    expect(isCountdownFinished(startCountdown(createCountdown(MINUTE), T0), T0 + 30_000)).toBe(false)
    expect(isCountdownFinished(startCountdown(createCountdown(MINUTE), T0), T0 + MINUTE)).toBe(true)
  })

  it('restarts from the full duration when started after finishing', () => {
    const finished = startCountdown(createCountdown(MINUTE), T0)
    const again = startCountdown(finished, T0 + 5 * MINUTE)

    expect(again.endsAt).toBe(T0 + 6 * MINUTE)
    expect(remainingAt(again, T0 + 5 * MINUTE)).toBe(MINUTE)
  })

  it('resets back to a chosen duration', () => {
    const reset = resetCountdown(startCountdown(createCountdown(MINUTE), T0), 10 * MINUTE)
    expect(reset.endsAt).toBeNull()
    expect(reset.durationMs).toBe(10 * MINUTE)
    expect(reset.remainingMs).toBe(10 * MINUTE)
  })

  it('changing the duration always restarts, never keeps the old run', () => {
    const resized = setCountdownDuration(startCountdown(createCountdown(5 * MINUTE), T0), 25 * MINUTE, T0 + MINUTE)
    expect(resized.endsAt).toBeNull()
    expect(resized.remainingMs).toBe(25 * MINUTE)
  })

  it('nudging a running timer moves the deadline and grows the ring denominator', () => {
    const nudged = nudgeCountdown(startCountdown(createCountdown(5 * MINUTE), T0), MINUTE, T0 + MINUTE)

    expect(remainingAt(nudged, T0 + MINUTE)).toBe(5 * MINUTE)
    // 4 minutes were left, one was added: the ring must not overflow.
    expect(nudged.durationMs).toBe(5 * MINUTE)
    expect(countdownProgress(nudged, T0 + MINUTE)).toBeCloseTo(0)

    const grown = nudgeCountdown(createCountdown(MINUTE), 2 * MINUTE, T0)
    expect(grown.remainingMs).toBe(3 * MINUTE)
    expect(countdownProgress(grown, T0)).toBe(0)
  })

  it('nudging below zero stops the timer at zero instead of going negative', () => {
    const stopped = nudgeCountdown(startCountdown(createCountdown(MINUTE), T0), -2 * MINUTE, T0 + 10_000)

    expect(stopped.endsAt).toBeNull()
    expect(stopped.remainingMs).toBe(0)
    expect(isCountdownFinished(stopped, T0 + 10_000)).toBe(false)
  })

  it('draws progress as the elapsed fraction', () => {
    const running = startCountdown(createCountdown(10 * MINUTE), T0)
    expect(countdownProgress(running, T0)).toBeCloseTo(0)
    expect(countdownProgress(running, T0 + 5 * MINUTE)).toBeCloseTo(0.5)
    expect(countdownProgress(running, T0 + 10 * MINUTE)).toBeCloseTo(1)
    expect(countdownProgress(createCountdown(0), T0)).toBe(1)
  })
})
