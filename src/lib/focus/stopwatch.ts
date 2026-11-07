/**
 * Stopwatch state, anchored the same way as the countdown: `startedAt` plus
 * time banked from previous runs. Nothing here counts ticks, so a paused
 * stopwatch stays paused across a reload and a running one keeps elapsed time
 * through a backgrounded tab.
 */

export interface Stopwatch {
  /** Wall-clock instant the current run began; `null` while paused. */
  startedAt: number | null
  /** Time from earlier runs, frozen at each pause. */
  accumulatedMs: number
  /** Absolute elapsed time at each lap, in order. */
  laps: number[]
}

export function createStopwatch(): Stopwatch {
  return { startedAt: null, accumulatedMs: 0, laps: [] }
}

export function stopwatchElapsed(watch: Stopwatch, now: number): number {
  const live = watch.startedAt === null ? 0 : Math.max(0, now - watch.startedAt)
  return watch.accumulatedMs + live
}

export function isStopwatchRunning(watch: Stopwatch): boolean {
  return watch.startedAt !== null
}

export function startStopwatch(watch: Stopwatch, now: number): Stopwatch {
  if (watch.startedAt !== null) return watch
  return { ...watch, startedAt: now }
}

export function pauseStopwatch(watch: Stopwatch, now: number): Stopwatch {
  if (watch.startedAt === null) return watch
  return {
    startedAt: null,
    accumulatedMs: stopwatchElapsed(watch, now),
    laps: watch.laps,
  }
}

export function resetStopwatch(): Stopwatch {
  return createStopwatch()
}

/** Record a lap; pressing twice within the same millisecond is a no-op. */
export function lapStopwatch(watch: Stopwatch, now: number): Stopwatch {
  if (watch.startedAt === null) return watch
  const at = stopwatchElapsed(watch, now)
  const last = watch.laps[watch.laps.length - 1]
  if (at <= 0 || at === last) return watch
  return { ...watch, laps: [...watch.laps, at] }
}

export interface LapRow {
  /** 1-based lap number. */
  index: number
  /** Time spent in this lap alone. */
  splitMs: number
  /** Running total when the lap was taken. */
  totalMs: number
  fastest: boolean
  slowest: boolean
}

/**
 * Lap table rows. Fastest/slowest are only marked once there is something to
 * compare against — a single lap being both the best and the worst is noise.
 */
export function lapRows(laps: number[]): LapRow[] {
  const rows: LapRow[] = laps.map((totalMs, index) => ({
    index: index + 1,
    splitMs: totalMs - (index === 0 ? 0 : laps[index - 1]),
    totalMs,
    fastest: false,
    slowest: false,
  }))

  if (rows.length > 1) {
    let fastest = 0
    let slowest = 0
    rows.forEach((row, index) => {
      if (row.splitMs < rows[fastest].splitMs) fastest = index
      if (row.splitMs > rows[slowest].splitMs) slowest = index
    })
    rows[fastest].fastest = true
    rows[slowest].slowest = true
  }

  return rows
}
