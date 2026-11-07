import { describe, expect, it } from 'vitest'
import {
  DEFAULT_POMODORO_CONFIG,
  bumpDaily,
  clampConfig,
  completePhase,
  createPomodoro,
  dailyFocusCount,
  dayKey,
  nextPhaseOf,
  pausePomodoro,
  phaseDuration,
  resetPomodoro,
  skipPhase,
  startPomodoro,
} from '@/lib/focus/pomodoro'
import { remainingAt } from '@/lib/focus/countdown'

const T0 = Date.UTC(2026, 8, 25, 9, 0, 0)
const config = DEFAULT_POMODORO_CONFIG

describe('pomodoro phases', () => {
  it('opens on a paused focus phase with the configured length', () => {
    const pomodoro = createPomodoro(config)
    expect(pomodoro.phase).toBe('focus')
    expect(pomodoro.cycle).toBe(0)
    expect(pomodoro.countdown.remainingMs).toBe(config.focusMs)
    expect(pomodoro.countdown.endsAt).toBeNull()
  })

  it('moves to a short break after an ordinary focus session', () => {
    const next = completePhase(createPomodoro(config), config, T0)
    expect(next.phase).toBe('short')
    expect(next.cycle).toBe(1)
    expect(next.countdown.durationMs).toBe(config.shortMs)
  })

  it('replaces the short break with a long one every fourth focus', () => {
    let pomodoro = createPomodoro(config)
    const phases: string[] = []

    for (let index = 0; index < 8; index += 1) {
      // Finish the current phase, then skip back into focus to keep counting.
      pomodoro = completePhase(pomodoro, config, T0)
      phases.push(pomodoro.phase)
      if (pomodoro.phase !== 'focus') pomodoro = skipPhase(pomodoro, config, T0)
    }

    expect(phases).toEqual([
      'short',
      'short',
      'short',
      'long',
      'short',
      'short',
      'short',
      'long',
    ])
    expect(pomodoro.cycle).toBe(8)
  })

  it('counts only completed focus phases, so skipping work does not advance the cycle', () => {
    const skipped = skipPhase(startPomodoro(createPomodoro(config), T0), config, T0 + 1000)

    expect(skipped.phase).toBe('short')
    expect(skipped.cycle).toBe(0)
  })

  it('skipping a break returns to focus with the cycle untouched', () => {
    const onBreak = completePhase(createPomodoro(config), config, T0)
    const back = skipPhase(onBreak, config, T0)
    expect(back.phase).toBe('focus')
    expect(back.cycle).toBe(1)
  })

  it('auto-start chains the next phase only when enabled', () => {
    const manual = completePhase(createPomodoro(config), config, T0)
    expect(manual.countdown.endsAt).toBeNull()

    const auto = completePhase({ ...createPomodoro(config), autoStart: true }, config, T0)
    expect(auto.countdown.endsAt).toBe(T0 + config.shortMs)
  })

  it('start and pause keep the same deadline contract as a plain countdown', () => {
    const started = startPomodoro(createPomodoro(config), T0)
    expect(remainingAt(started.countdown, T0 + 60_000)).toBe(config.focusMs - 60_000)

    const paused = pausePomodoro(started, T0 + 60_000)
    expect(paused.countdown.endsAt).toBeNull()
    expect(paused.countdown.remainingMs).toBe(config.focusMs - 60_000)
  })

  it('reset returns to the first focus phase and clears the cycle', () => {
    let pomodoro = createPomodoro(config)
    for (let index = 0; index < 3; index += 1) {
      pomodoro = skipPhase(completePhase(pomodoro, config, T0), config, T0)
    }
    pomodoro = { ...pomodoro, autoStart: true }

    const reset = resetPomodoro(pomodoro, config)
    expect(reset.phase).toBe('focus')
    expect(reset.cycle).toBe(0)
    expect(reset.countdown.remainingMs).toBe(config.focusMs)
    expect(reset.autoStart).toBe(true)
  })
})

describe('nextPhaseOf', () => {
  it('chooses by the completed cycle, not by the previous phase', () => {
    expect(nextPhaseOf('focus', 1, config)).toBe('short')
    expect(nextPhaseOf('focus', 3, config)).toBe('short')
    expect(nextPhaseOf('focus', 4, config)).toBe('long')
    expect(nextPhaseOf('focus', 8, config)).toBe('long')
    expect(nextPhaseOf('short', 4, config)).toBe('focus')
    expect(nextPhaseOf('long', 4, config)).toBe('focus')
  })

  it('treats a zero cycle as an ordinary break', () => {
    expect(nextPhaseOf('focus', 0, config)).toBe('short')
  })
})

describe('config clamping', () => {
  it('keeps durations inside a range the UI can render', () => {
    const clamped = clampConfig({ focusMs: 0, shortMs: 999 * 60_000, longMs: -5, longEvery: 99 })
    expect(clamped.focusMs).toBe(60_000)
    expect(clamped.shortMs).toBe(120 * 60_000)
    expect(clamped.longMs).toBe(60_000)
    expect(clamped.longEvery).toBe(8)
  })

  it('rounds fractional minutes and resolves each phase duration', () => {
    const clamped = clampConfig({ ...config, focusMs: 25.4 * 60_000 })
    expect(clamped.focusMs).toBe(Math.round(25.4 * 60_000))

    expect(phaseDuration(config, 'focus')).toBe(config.focusMs)
    expect(phaseDuration(config, 'short')).toBe(config.shortMs)
    expect(phaseDuration(config, 'long')).toBe(config.longMs)
  })
})

describe('daily focus count', () => {
  it('counts per local calendar day', () => {
    const first = bumpDaily(null, T0)
    expect(first.focus).toBe(1)
    expect(dailyFocusCount(first, T0)).toBe(1)

    const second = bumpDaily(first, T0 + 60_000)
    expect(second.focus).toBe(2)
  })

  it('starts over on the next day instead of accumulating forever', () => {
    const yesterday = bumpDaily({ day: '2026-09-24', focus: 7 }, T0)
    expect(yesterday).toEqual({ day: '2026-09-25', focus: 1 })
    expect(dailyFocusCount(yesterday, T0 + 24 * 3_600_000)).toBe(0)
  })

  it('keys the day in local time, matching what the user sees on the clock', () => {
    const localNoon = new Date(2026, 8, 25, 12, 0, 0).getTime()
    expect(dayKey(localNoon)).toBe('2026-09-25')
    expect(dayKey(new Date(2026, 0, 1, 0, 0, 1).getTime())).toBe('2026-01-01')
  })
})
