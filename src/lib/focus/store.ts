/**
 * Persistence for the time tools — one versioned snapshot in localStorage.
 *
 * The shape is validated on read rather than trusted. A half-written record, a
 * schema from an older build, or a hand-edited value must degrade to "start
 * clean", never to a page that throws on mount and leaves the visitor staring
 * at an empty screen.
 *
 * Parsing takes `now` so a saved deadline far in the past or far in the future
 * can be bounded; otherwise a corrupted `endsAt` renders a countdown of
 * several years.
 */

import { type Countdown } from './countdown'
import { type Stopwatch } from './stopwatch'
import {
  DEFAULT_POMODORO_CONFIG,
  clampConfig,
  createPomodoro,
  phaseDuration,
  type DailyFocus,
  type Pomodoro,
  type PomodoroConfig,
  type PomodoroPhase,
} from './pomodoro'
import { TASK_MAX_COUNT, normalizeTaskTitle, type FocusTask } from './tasks'

export const FOCUS_STORAGE_KEY = 'portfolio-focus:v1'
export const FOCUS_VERSION = 1

/** A timer longer than this is a corrupt record, not a real session. */
const MAX_COUNTDOWN_MS = 24 * 60 * 60_000

export type FocusMode = 'clock' | 'timer' | 'stopwatch' | 'pomodoro'

export const FOCUS_MODES = ['clock', 'timer', 'stopwatch', 'pomodoro'] as const

export const CLOCK_ZONES = ['local', 'UTC', 'Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura'] as const
export type ClockZone = (typeof CLOCK_ZONES)[number]

export interface ClockPrefs {
  hour12: boolean
  zone: ClockZone
}

export interface FocusSnapshot {
  version: number
  /** Last write, used to let the newest tab win when two are open. */
  updatedAt: number
  mode: FocusMode
  clock: ClockPrefs
  timer: Countdown
  stopwatch: Stopwatch
  pomodoro: Pomodoro
  config: PomodoroConfig
  tasks: FocusTask[]
  daily: DailyFocus | null
}

export const DEFAULT_TIMER_MS = 5 * 60_000

export function emptySnapshot(config: PomodoroConfig = DEFAULT_POMODORO_CONFIG): FocusSnapshot {
  return {
    version: FOCUS_VERSION,
    updatedAt: 0,
    mode: 'clock',
    clock: { hour12: false, zone: 'local' },
    timer: { durationMs: DEFAULT_TIMER_MS, endsAt: null, remainingMs: DEFAULT_TIMER_MS },
    stopwatch: { startedAt: null, accumulatedMs: 0, laps: [] },
    pomodoro: createPomodoro(config),
    config,
    tasks: [],
    daily: null,
  }
}

/**
 * `updatedAt` is passed in rather than read here so the caller can store the
 * same instant it keeps in memory — otherwise the in-memory copy would stay
 * permanently older than the record on disk and lose every cross-tab race.
 */
export function serializeSnapshot(snapshot: FocusSnapshot, updatedAt = Date.now()): string {
  return JSON.stringify({ ...snapshot, updatedAt })
}

type Json = Record<string, unknown>

function asRecord(value: unknown): Json | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Json)
    : null
}

function finiteNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function parseCountdown(raw: unknown, fallbackMs: number, now: number): Countdown {
  const record = asRecord(raw)
  const durationMs = clamp(finiteNumber(record?.durationMs, fallbackMs), 0, MAX_COUNTDOWN_MS)
  const endsAtRaw = record?.endsAt
  const endsAt =
    typeof endsAtRaw === 'number' && Number.isFinite(endsAtRaw) && endsAtRaw > 0
      ? clamp(endsAtRaw, now - MAX_COUNTDOWN_MS, now + MAX_COUNTDOWN_MS)
      : null
  let remainingMs = clamp(finiteNumber(record?.remainingMs, durationMs), 0, MAX_COUNTDOWN_MS)
  // A paused countdown can never hold more than its own length.
  if (endsAt === null) remainingMs = Math.min(remainingMs, durationMs)
  return { durationMs, endsAt, remainingMs }
}

function parseStopwatch(raw: unknown, now: number): Stopwatch {
  const record = asRecord(raw)
  const startedAtRaw = record?.startedAt
  const startedAt =
    typeof startedAtRaw === 'number' && Number.isFinite(startedAtRaw) && startedAtRaw > 0
      ? clamp(startedAtRaw, now - MAX_COUNTDOWN_MS, now)
      : null
  const accumulatedMs = clamp(
    finiteNumber(record?.accumulatedMs, 0),
    0,
    MAX_COUNTDOWN_MS,
  )

  const laps = Array.isArray(record?.laps)
    ? record.laps
        .filter((lap): lap is number => typeof lap === 'number' && Number.isFinite(lap))
        .map((lap) => clamp(lap, 0, MAX_COUNTDOWN_MS))
        .sort((a, b) => a - b)
        .slice(-500)
    : []

  return { startedAt, accumulatedMs, laps }
}

function parseConfig(raw: unknown): PomodoroConfig {
  const record = asRecord(raw)
  return clampConfig({
    focusMs: finiteNumber(record?.focusMs, DEFAULT_POMODORO_CONFIG.focusMs),
    shortMs: finiteNumber(record?.shortMs, DEFAULT_POMODORO_CONFIG.shortMs),
    longMs: finiteNumber(record?.longMs, DEFAULT_POMODORO_CONFIG.longMs),
    longEvery: finiteNumber(record?.longEvery, DEFAULT_POMODORO_CONFIG.longEvery),
  })
}

function parsePhase(value: unknown): PomodoroPhase {
  return value === 'short' || value === 'long' ? value : 'focus'
}

function parsePomodoro(raw: unknown, config: PomodoroConfig, now: number): Pomodoro {
  const record = asRecord(raw)
  const phase = parsePhase(record?.phase)
  return {
    phase,
    cycle: clamp(Math.trunc(finiteNumber(record?.cycle, 0)), 0, 999),
    countdown: parseCountdown(record?.countdown, phaseDuration(config, phase), now),
    autoStart: record?.autoStart === true,
  }
}

function parseTasks(raw: unknown): FocusTask[] {
  if (!Array.isArray(raw)) return []

  const tasks: FocusTask[] = []
  const seen = new Set<string>()

  for (const entry of raw) {
    if (tasks.length >= TASK_MAX_COUNT) break
    const record = asRecord(entry)
    const id = typeof record?.id === 'string' ? record.id : ''
    const title = typeof record?.title === 'string' ? normalizeTaskTitle(record.title) : ''
    if (!id || !title || seen.has(id)) continue
    seen.add(id)
    tasks.push({
      id,
      title,
      done: record?.done === true,
      createdAt: clamp(finiteNumber(record?.createdAt, 0), 0, Number.MAX_SAFE_INTEGER),
    })
  }

  return tasks
}

function parseDaily(raw: unknown): DailyFocus | null {
  const record = asRecord(raw)
  const day = typeof record?.day === 'string' ? record.day : ''
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null
  return { day, focus: clamp(Math.trunc(finiteNumber(record?.focus, 0)), 0, 10_000) }
}

function parseClock(raw: unknown): ClockPrefs {
  const record = asRecord(raw)
  const zone = record?.zone
  return {
    hour12: record?.hour12 === true,
    zone: CLOCK_ZONES.includes(zone as ClockZone) ? (zone as ClockZone) : 'local',
  }
}

function parseMode(raw: unknown): FocusMode {
  return FOCUS_MODES.includes(raw as FocusMode) ? (raw as FocusMode) : 'clock'
}

/** `null` means "nothing usable saved" — the caller starts from an empty run. */
export function parseSnapshot(raw: string | null, now: number): FocusSnapshot | null {
  if (!raw) return null

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }

  const record = asRecord(parsed)
  if (!record || record.version !== FOCUS_VERSION) return null

  const config = parseConfig(record.config)

  return {
    version: FOCUS_VERSION,
    updatedAt: finiteNumber(record.updatedAt, 0),
    mode: parseMode(record.mode),
    clock: parseClock(record.clock),
    timer: parseCountdown(record.timer, DEFAULT_TIMER_MS, now),
    stopwatch: parseStopwatch(record.stopwatch, now),
    pomodoro: parsePomodoro(record.pomodoro, config, now),
    config,
    tasks: parseTasks(record.tasks),
    daily: parseDaily(record.daily),
  }
}
