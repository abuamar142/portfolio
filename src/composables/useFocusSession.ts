/**
 * The single focus session for this tab: one store, one clock, one ticker.
 *
 * It lives at module scope on purpose. Navigating from the pomodoro to the blog
 * and back must not reset a running phase, and the chime has to be able to fire
 * while the visitor is reading something else. A component-scoped store would
 * die with the page.
 *
 * `initFocusSession` is called from the page's `onMounted`, never at import
 * time: `vite-ssg` renders these pages in Node, where `window` and
 * `localStorage` do not exist.
 */

import { reactive, ref } from 'vue'
import {
  countdownProgress,
  isCountdownFinished,
  isCountdownRunning,
  nudgeCountdown,
  pauseCountdown,
  remainingAt,
  resetCountdown,
  setCountdownDuration,
  startCountdown,
} from '@/lib/focus/countdown'
import {
  completePhase,
  clampConfig,
  pausePomodoro,
  phaseDuration,
  resetPomodoro,
  skipPhase,
  startPomodoro,
  bumpDaily,
  type PomodoroConfig,
} from '@/lib/focus/pomodoro'
import {
  lapStopwatch,
  pauseStopwatch,
  resetStopwatch,
  startStopwatch,
} from '@/lib/focus/stopwatch'
import {
  addTask,
  clearDoneTasks,
  removeTask,
  toggleTask,
} from '@/lib/focus/tasks'
import {
  FOCUS_STORAGE_KEY,
  type ClockPrefs,
  type FocusMode,
  type FocusSnapshot,
  emptySnapshot,
  parseSnapshot,
  serializeSnapshot,
} from '@/lib/focus/store'
import { cancelChime, scheduleChime } from '@/composables/useChime'

/** Ticks repaint only; every number is derived from `now` and a deadline. */
const TICK_MS = 250

const snapshot = reactive<FocusSnapshot>(emptySnapshot())

/** Wall-clock reading that drives the display. `0` until the page mounts. */
const now = ref(0)

/** Set when a phase ended while the tab was away; cleared by the next action. */
const noticeKey = ref<string | null>(null)

let started = false
let ticker: number | null = null

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `t-${Math.random().toString(16).slice(2)}-${Date.now().toString(16)}`
}

function persist(): void {
  if (typeof window === 'undefined') return
  // The in-memory `updatedAt` must advance with the write, otherwise this tab
  // permanently looks older than the record on disk and loses every
  // cross-tab adoption race.
  snapshot.updatedAt = Date.now()
  try {
    window.localStorage.setItem(FOCUS_STORAGE_KEY, serializeSnapshot(snapshot, snapshot.updatedAt))
  } catch {
    // Private mode or a full quota: the session still works in memory.
  }
}

/**
 * Schedule the next transition sound on the audio clock.
 *
 * Both runs can be live at once (a five-minute timer while a pomodoro counts
 * down), so the soonest one is scheduled; the other is picked up when the
 * first completes.
 */
function syncChime(): void {
  if (typeof window === 'undefined') return

  const at = Date.now()
  const candidates: { inMs: number; kind: 'done' | 'phase' }[] = []

  if (isCountdownRunning(snapshot.timer)) {
    candidates.push({ inMs: remainingAt(snapshot.timer, at), kind: 'done' })
  }
  if (isCountdownRunning(snapshot.pomodoro.countdown)) {
    candidates.push({ inMs: remainingAt(snapshot.pomodoro.countdown, at), kind: 'phase' })
  }

  if (candidates.length === 0) {
    cancelChime()
    return
  }

  const soonest = candidates.reduce((first, next) => (next.inMs < first.inMs ? next : first))
  scheduleChime(soonest.inMs, soonest.kind)
}

function finishTimer(endedAt: number, announce: boolean): void {
  if (!isCountdownFinished(snapshot.timer, endedAt)) return
  snapshot.timer = { durationMs: snapshot.timer.durationMs, endsAt: null, remainingMs: 0 }
  noticeKey.value = 'focus.notice.timerEnded'
  if (announce) syncChime()
  persist()
}

function finishPomodoroPhase(endedAt: number, announce: boolean): void {
  const countdown = snapshot.pomodoro.countdown
  if (!isCountdownFinished(countdown, endedAt)) return

  const wasFocus = snapshot.pomodoro.phase === 'focus'
  const autoStart = snapshot.pomodoro.autoStart

  // On restore, never cascade: the visitor may have been away for an hour, and
  // banking phases they never sat through would be a lie. One transition,
  // paused, then they decide.
  const next = announce
    ? completePhase(snapshot.pomodoro, snapshot.config, endedAt)
    : { ...completePhase({ ...snapshot.pomodoro, autoStart: false }, snapshot.config, endedAt), autoStart }

  snapshot.pomodoro = next
  if (wasFocus) snapshot.daily = bumpDaily(snapshot.daily, endedAt)

  noticeKey.value = wasFocus ? 'focus.notice.focusEnded' : 'focus.notice.breakEnded'
  if (announce) syncChime()
  persist()
}

/** Restore what the last visit left behind, including a run that expired. */
function restore(): void {
  if (typeof window === 'undefined') return

  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(FOCUS_STORAGE_KEY)
  } catch {
    raw = null
  }

  const saved = parseSnapshot(raw, Date.now())
  if (saved) Object.assign(snapshot, saved)

  const at = Date.now()
  // These are silent on purpose: a sound from a session abandoned hours ago is
  // startling, and the notice already explains what happened.
  if (isCountdownFinished(snapshot.timer, at)) finishTimer(at, false)
  if (isCountdownFinished(snapshot.pomodoro.countdown, at)) finishPomodoroPhase(at, false)
}

function tick(): void {
  now.value = Date.now()
  if (isCountdownFinished(snapshot.timer, now.value)) finishTimer(now.value, true)
  if (isCountdownFinished(snapshot.pomodoro.countdown, now.value)) {
    finishPomodoroPhase(now.value, true)
  }
}

/** Idempotent; safe to call from every mount of the page. */
export function initFocusSession(): void {
  if (started || typeof window === 'undefined') return
  started = true

  restore()
  now.value = Date.now()

  ticker = window.setInterval(tick, TICK_MS)

  // A hidden tab is throttled; catch up the instant it is looked at again.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') tick()
  })

  // Two tabs share one session; the newest write wins.
  window.addEventListener('storage', (event) => {
    if (event.key !== FOCUS_STORAGE_KEY) return
    const incoming = parseSnapshot(event.newValue, Date.now())
    if (incoming && incoming.updatedAt > snapshot.updatedAt) Object.assign(snapshot, incoming)
  })

  syncChime()
}

/** Stop the ticker. Only used by tests and teardown; the page never calls it. */
export function stopFocusSession(): void {
  if (ticker !== null) window.clearInterval(ticker)
  ticker = null
  started = false
}

function commit(): void {
  persist()
  syncChime()
}

export const focusSession = {
  snapshot,
  now,
  noticeKey,

  dismissNotice(): void {
    noticeKey.value = null
  },

  setMode(mode: FocusMode): void {
    snapshot.mode = mode
    persist()
  },

  // ---- clock ---------------------------------------------------------------

  setClockPrefs(patch: Partial<ClockPrefs>): void {
    snapshot.clock = { ...snapshot.clock, ...patch }
    persist()
  },

  // ---- timer ---------------------------------------------------------------

  setTimerDuration(durationMs: number): void {
    snapshot.timer = setCountdownDuration(snapshot.timer, durationMs, Date.now())
    commit()
  },

  startTimer(): void {
    snapshot.timer = startCountdown(snapshot.timer, Date.now())
    commit()
  },

  pauseTimer(): void {
    snapshot.timer = pauseCountdown(snapshot.timer, Date.now())
    commit()
  },

  resetTimer(): void {
    snapshot.timer = resetCountdown(snapshot.timer)
    commit()
  },

  nudgeTimer(deltaMs: number): void {
    snapshot.timer = nudgeCountdown(snapshot.timer, deltaMs, Date.now())
    commit()
  },

  timerRemaining(): number {
    return remainingAt(snapshot.timer, now.value)
  },

  timerProgress(): number {
    return countdownProgress(snapshot.timer, now.value)
  },

  // ---- stopwatch -----------------------------------------------------------

  startWatch(): void {
    snapshot.stopwatch = startStopwatch(snapshot.stopwatch, Date.now())
    persist()
  },

  pauseWatch(): void {
    snapshot.stopwatch = pauseStopwatch(snapshot.stopwatch, Date.now())
    persist()
  },

  lapWatch(): void {
    snapshot.stopwatch = lapStopwatch(snapshot.stopwatch, Date.now())
    persist()
  },

  resetWatch(): void {
    snapshot.stopwatch = resetStopwatch()
    persist()
  },

  // ---- pomodoro ------------------------------------------------------------

  startPomodoro(): void {
    snapshot.pomodoro = startPomodoro(snapshot.pomodoro, Date.now())
    commit()
  },

  pausePomodoro(): void {
    snapshot.pomodoro = pausePomodoro(snapshot.pomodoro, Date.now())
    cancelChime()
    persist()
  },

  skipPomodoroPhase(): void {
    snapshot.pomodoro = skipPhase(snapshot.pomodoro, snapshot.config, Date.now())
    commit()
  },

  resetPomodoroRun(): void {
    snapshot.pomodoro = resetPomodoro(snapshot.pomodoro, snapshot.config)
    cancelChime()
    persist()
  },

  setPomodoroConfig(patch: Partial<PomodoroConfig>): void {
    snapshot.config = clampConfig({ ...snapshot.config, ...patch })

    // A phase that is not running adopts the new length immediately; a live
    // phase keeps its deadline so the minutes already sat through are not lost.
    if (!isCountdownRunning(snapshot.pomodoro.countdown)) {
      const durationMs = phaseDuration(snapshot.config, snapshot.pomodoro.phase)
      snapshot.pomodoro = {
        ...snapshot.pomodoro,
        countdown: { durationMs, endsAt: null, remainingMs: durationMs },
      }
    }
    commit()
  },

  setPomodoroAutoStart(autoStart: boolean): void {
    snapshot.pomodoro = { ...snapshot.pomodoro, autoStart }
    persist()
  },

  // ---- tasks ---------------------------------------------------------------

  addTask(title: string): void {
    snapshot.tasks = addTask(snapshot.tasks, title, Date.now(), newId())
    persist()
  },

  toggleTask(id: string): void {
    snapshot.tasks = toggleTask(snapshot.tasks, id)
    persist()
  },

  removeTask(id: string): void {
    snapshot.tasks = removeTask(snapshot.tasks, id)
    persist()
  },

  clearDoneTasks(): void {
    snapshot.tasks = clearDoneTasks(snapshot.tasks)
    persist()
  },
}
