import { describe, expect, it } from 'vitest'
import {
  DEFAULT_TIMER_MS,
  FOCUS_STORAGE_KEY,
  FOCUS_VERSION,
  emptySnapshot,
  parseSnapshot,
  serializeSnapshot,
} from '@/lib/focus/store'
import { DEFAULT_POMODORO_CONFIG } from '@/lib/focus/pomodoro'

const T0 = 1_700_000_000_000

describe('emptySnapshot', () => {
  it('gives every mode a valid, paused starting point', () => {
    const snapshot = emptySnapshot()

    expect(snapshot.version).toBe(FOCUS_VERSION)
    expect(snapshot.mode).toBe('clock')
    expect(snapshot.timer.remainingMs).toBe(DEFAULT_TIMER_MS)
    expect(snapshot.timer.endsAt).toBeNull()
    expect(snapshot.stopwatch.startedAt).toBeNull()
    expect(snapshot.pomodoro.phase).toBe('focus')
    expect(snapshot.pomodoro.countdown.remainingMs).toBe(DEFAULT_POMODORO_CONFIG.focusMs)
    expect(snapshot.tasks).toEqual([])
    expect(snapshot.daily).toBeNull()
  })

  it('uses a versioned key so a schema change cannot silently misread old data', () => {
    expect(FOCUS_STORAGE_KEY).toBe('portfolio-focus:v1')
  })
})

describe('serialize + parse round trip', () => {
  it('keeps a running timer running across a reload', () => {
    const snapshot = {
      ...emptySnapshot(),
      mode: 'timer' as const,
      timer: { durationMs: 300_000, endsAt: T0 + 120_000, remainingMs: 300_000 },
    }

    const restored = parseSnapshot(serializeSnapshot(snapshot), T0 + 30_000)
    expect(restored?.mode).toBe('timer')
    expect(restored?.timer.endsAt).toBe(T0 + 120_000)
    expect(restored?.timer.durationMs).toBe(300_000)
  })

  it('keeps tasks and their done state', () => {
    const snapshot = {
      ...emptySnapshot(),
      tasks: [
        { id: 'a', title: 'Tulis laporan', done: true, createdAt: T0 },
        { id: 'b', title: 'Balas email', done: false, createdAt: T0 },
      ],
    }

    expect(parseSnapshot(serializeSnapshot(snapshot), T0)?.tasks).toEqual(snapshot.tasks)
  })

  it('stamps a fresh updatedAt so the newest tab can win', () => {
    const snapshot = { ...emptySnapshot(), updatedAt: 1 }
    const parsed = parseSnapshot(serializeSnapshot(snapshot), T0)
    expect(parsed!.updatedAt).toBeGreaterThan(1)
  })
})

describe('parseSnapshot rejects what it cannot trust', () => {
  it('returns null for absent, malformed, or foreign data', () => {
    expect(parseSnapshot(null, T0)).toBeNull()
    expect(parseSnapshot('not json', T0)).toBeNull()
    expect(parseSnapshot('[]', T0)).toBeNull()
    expect(parseSnapshot('null', T0)).toBeNull()
    expect(parseSnapshot(JSON.stringify({ version: 99 }), T0)).toBeNull()
  })

  it('bounds a corrupted deadline instead of rendering a decade-long countdown', () => {
    const raw = JSON.stringify({
      version: FOCUS_VERSION,
      timer: { durationMs: 600_000, endsAt: T0 + 100 * 365 * 24 * 3_600_000, remainingMs: 0 },
    })
    const parsed = parseSnapshot(raw, T0)
    const day = 24 * 3_600_000
    expect(parsed!.timer.endsAt).toBeLessThanOrEqual(T0 + day)
  })

  it('never lets a paused countdown hold more than its own length', () => {
    const raw = JSON.stringify({
      version: FOCUS_VERSION,
      timer: { durationMs: 60_000, endsAt: null, remainingMs: 9_999_999 },
    })
    expect(parseSnapshot(raw, T0)!.timer.remainingMs).toBe(60_000)
  })
})

describe('parseSnapshot repairs individual fields', () => {
  it('falls back to the first phase for an unknown pomodoro phase', () => {
    const raw = JSON.stringify({ version: FOCUS_VERSION, pomodoro: { phase: 'nap' } })
    expect(parseSnapshot(raw, T0)!.pomodoro.phase).toBe('focus')
  })

  it('falls back to the local zone for an unknown zone', () => {
    const raw = JSON.stringify({ version: FOCUS_VERSION, clock: { zone: 'Mars/Olympus' } })
    expect(parseSnapshot(raw, T0)!.clock.zone).toBe('local')
  })

  it('falls back to the clock for an unknown mode', () => {
    expect(parseSnapshot(JSON.stringify({ version: FOCUS_VERSION, mode: 'nope' }), T0)!.mode).toBe('clock')
  })

  it('clamps settings that are outside the supported range', () => {
    const raw = JSON.stringify({
      version: FOCUS_VERSION,
      config: { focusMs: 1, shortMs: 1e12, longMs: 60 * 60_000, longEvery: 1 },
    })
    const config = parseSnapshot(raw, T0)!.config
    expect(config.focusMs).toBe(60_000)
    expect(config.shortMs).toBe(120 * 60_000)
    expect(config.longEvery).toBe(2)
  })

  it('drops bad tasks and duplicate ids but keeps the good rows', () => {
    const raw = JSON.stringify({
      version: FOCUS_VERSION,
      tasks: [
        { id: 'a', title: '  tulis   laporan ', done: false, createdAt: T0 },
        { id: 'a', title: 'duplikat', done: false, createdAt: T0 },
        { id: '', title: 'tanpa id', done: false, createdAt: T0 },
        { id: 'b', title: '   ', done: false, createdAt: T0 },
        { id: 'c', title: 'balas email', done: true, createdAt: T0 },
        'bukan objek',
      ],
    })

    expect(parseSnapshot(raw, T0)!.tasks).toEqual([
      { id: 'a', title: 'tulis laporan', done: false, createdAt: T0 },
      { id: 'c', title: 'balas email', done: true, createdAt: T0 },
    ])
  })

  it('drops a daily record whose day is not a date', () => {
    const raw = JSON.stringify({ version: FOCUS_VERSION, daily: { day: 'kemarin', focus: 3 } })
    expect(parseSnapshot(raw, T0)!.daily).toBeNull()
  })

  it('sorts laps and drops non-numeric entries', () => {
    const raw = JSON.stringify({
      version: FOCUS_VERSION,
      stopwatch: { startedAt: null, accumulatedMs: 5000, laps: [3000, 'x', 1000] },
    })
    expect(parseSnapshot(raw, T0)!.stopwatch.laps).toEqual([1000, 3000])
  })
})
