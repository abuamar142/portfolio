import { describe, expect, it } from 'vitest'
import {
  createStopwatch,
  isStopwatchRunning,
  lapRows,
  lapStopwatch,
  pauseStopwatch,
  resetStopwatch,
  startStopwatch,
  stopwatchElapsed,
} from '@/lib/focus/stopwatch'

const T0 = 1_700_000_000_000

describe('stopwatch', () => {
  it('reads zero when created', () => {
    const watch = createStopwatch()
    expect(stopwatchElapsed(watch, T0)).toBe(0)
    expect(isStopwatchRunning(watch)).toBe(false)
  })

  it('measures elapsed time from the start instant', () => {
    const watch = startStopwatch(createStopwatch(), T0)
    expect(stopwatchElapsed(watch, T0 + 1234)).toBe(1234)
  })

  it('banking time on pause means a reload cannot rewind the run', () => {
    const paused = pauseStopwatch(startStopwatch(createStopwatch(), T0), T0 + 2000)
    expect(paused.accumulatedMs).toBe(2000)
    // Time continues to pass while paused; elapsed must not.
    expect(stopwatchElapsed(paused, T0 + 60_000)).toBe(2000)
  })

  it('resumes on top of the banked time', () => {
    const paused = pauseStopwatch(startStopwatch(createStopwatch(), T0), T0 + 2000)
    const resumed = startStopwatch(paused, T0 + 10_000)
    expect(stopwatchElapsed(resumed, T0 + 13_000)).toBe(5000)
  })

  it('starting twice does not restart the run', () => {
    const first = startStopwatch(createStopwatch(), T0)
    const second = startStopwatch(first, T0 + 5000)
    expect(second.startedAt).toBe(T0)
  })

  it('records laps as absolute splits and ignores a duplicate instant', () => {
    const running = startStopwatch(createStopwatch(), T0)
    const one = lapStopwatch(running, T0 + 1000)
    const duplicate = lapStopwatch(one, T0 + 1000)
    const two = lapStopwatch(duplicate, T0 + 2500)

    expect(one.laps).toEqual([1000])
    expect(duplicate.laps).toEqual([1000])
    expect(two.laps).toEqual([1000, 2500])
  })

  it('cannot lap while paused', () => {
    const paused = pauseStopwatch(startStopwatch(createStopwatch(), T0), T0 + 1000)
    expect(lapStopwatch(paused, T0 + 5000).laps).toEqual([])
  })

  it('resets everything, laps included', () => {
    const running = lapStopwatch(startStopwatch(createStopwatch(), T0), T0 + 1000)
    expect(resetStopwatch()).toEqual(createStopwatch())
    expect(running.laps).toHaveLength(1)
  })
})

describe('lapRows', () => {
  it('turns absolute lap instants into per-lap splits', () => {
    const rows = lapRows([1000, 3000, 3500])

    expect(rows.map((row) => row.splitMs)).toEqual([1000, 2000, 500])
    expect(rows.map((row) => row.totalMs)).toEqual([1000, 3000, 3500])
    expect(rows.map((row) => row.index)).toEqual([1, 2, 3])
  })

  it('marks the fastest and slowest split, not the totals', () => {
    const rows = lapRows([1000, 3000, 3500])
    expect(rows[2].fastest).toBe(true)
    expect(rows[1].slowest).toBe(true)
  })

  it('marks nothing when a single lap has nothing to compare against', () => {
    const rows = lapRows([1000])
    expect(rows[0].fastest).toBe(false)
    expect(rows[0].slowest).toBe(false)
  })
})
