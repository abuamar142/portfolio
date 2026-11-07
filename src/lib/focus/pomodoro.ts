/**
 * Pomodoro phases: focus, short break, and a long break every Nth focus.
 *
 * The cadence is driven by `cycle`, the number of *completed* focus phases, so
 * skipping a break never shifts the next long break, and skipping a focus
 * phase deliberately does not count as work done.
 */

import { createCountdown, startCountdown, type Countdown } from './countdown'

export type PomodoroPhase = 'focus' | 'short' | 'long'

export interface PomodoroConfig {
  focusMs: number
  shortMs: number
  longMs: number
  /** A long break replaces the short one after every Nth focus. */
  longEvery: number
}

export const DEFAULT_POMODORO_CONFIG: PomodoroConfig = {
  focusMs: 25 * 60_000,
  shortMs: 5 * 60_000,
  longMs: 15 * 60_000,
  longEvery: 4,
}

export interface Pomodoro {
  phase: PomodoroPhase
  /** Completed focus phases in this run; resets with the run. */
  cycle: number
  countdown: Countdown
  /** When true, finishing a phase starts the next one instead of waiting. */
  autoStart: boolean
}

export interface DailyFocus {
  /** Local calendar day, `YYYY-MM-DD`. */
  day: string
  focus: number
}

export const MIN_DURATION_MS = 60_000
export const MAX_DURATION_MS = 120 * 60_000

/** Keep host-provided settings inside a range the UI can actually render. */
export function clampConfig(config: PomodoroConfig): PomodoroConfig {
  const clamp = (value: number, min: number, max: number): number =>
    Math.min(max, Math.max(min, Math.round(value)))
  return {
    focusMs: clamp(config.focusMs, MIN_DURATION_MS, MAX_DURATION_MS),
    shortMs: clamp(config.shortMs, MIN_DURATION_MS, MAX_DURATION_MS),
    longMs: clamp(config.longMs, MIN_DURATION_MS, MAX_DURATION_MS),
    longEvery: clamp(config.longEvery, 2, 8),
  }
}

export function phaseDuration(config: PomodoroConfig, phase: PomodoroPhase): number {
  if (phase === 'short') return config.shortMs
  if (phase === 'long') return config.longMs
  return config.focusMs
}

export function createPomodoro(config: PomodoroConfig = DEFAULT_POMODORO_CONFIG): Pomodoro {
  return {
    phase: 'focus',
    cycle: 0,
    countdown: createCountdown(config.focusMs),
    autoStart: false,
  }
}

/** Which phase follows the current one once `cycle` focus phases are done. */
export function nextPhaseOf(
  phase: PomodoroPhase,
  cycle: number,
  config: PomodoroConfig,
): PomodoroPhase {
  if (phase !== 'focus') return 'focus'
  return cycle > 0 && cycle % config.longEvery === 0 ? 'long' : 'short'
}

function enterPhase(
  pomodoro: Pomodoro,
  config: PomodoroConfig,
  now: number,
  cycle: number,
): Pomodoro {
  const phase = nextPhaseOf(pomodoro.phase, cycle, config)
  const countdown = createCountdown(phaseDuration(config, phase))
  return {
    phase,
    cycle,
    autoStart: pomodoro.autoStart,
    countdown: pomodoro.autoStart
      ? { ...countdown, endsAt: now + countdown.remainingMs }
      : countdown,
  }
}

/** The running phase reached zero: count the focus work and move on. */
export function completePhase(
  pomodoro: Pomodoro,
  config: PomodoroConfig,
  now: number,
): Pomodoro {
  const cycle = pomodoro.phase === 'focus' ? pomodoro.cycle + 1 : pomodoro.cycle
  return enterPhase(pomodoro, config, now, cycle)
}

/** The user pressed skip: move on without counting the focus phase. */
export function skipPhase(pomodoro: Pomodoro, config: PomodoroConfig, now: number): Pomodoro {
  return enterPhase(pomodoro, config, now, pomodoro.cycle)
}

export function startPomodoro(pomodoro: Pomodoro, now: number): Pomodoro {
  if (pomodoro.countdown.endsAt !== null) return pomodoro
  return { ...pomodoro, countdown: startCountdown(pomodoro.countdown, now) }
}

export function pausePomodoro(pomodoro: Pomodoro, now: number): Pomodoro {
  if (pomodoro.countdown.endsAt === null) return pomodoro
  return {
    ...pomodoro,
    countdown: {
      durationMs: pomodoro.countdown.durationMs,
      endsAt: null,
      remainingMs: Math.max(0, pomodoro.countdown.endsAt - now),
    },
  }
}

/** Back to the first focus phase, cycle cleared. Settings are kept. */
export function resetPomodoro(
  pomodoro: Pomodoro,
  config: PomodoroConfig,
): Pomodoro {
  return {
    phase: 'focus',
    cycle: 0,
    countdown: createCountdown(config.focusMs),
    autoStart: pomodoro.autoStart,
  }
}

/** `YYYY-MM-DD` in the viewer's own calendar, not UTC. */
export function dayKey(at: number): string {
  const date = new Date(at)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function bumpDaily(daily: DailyFocus | null, at: number): DailyFocus {
  const day = dayKey(at)
  if (!daily || daily.day !== day) return { day, focus: 1 }
  return { day, focus: daily.focus + 1 }
}

/** Yesterday's count reads as zero — the summary is always "today". */
export function dailyFocusCount(daily: DailyFocus | null, at: number): number {
  return daily && daily.day === dayKey(at) ? daily.focus : 0
}
