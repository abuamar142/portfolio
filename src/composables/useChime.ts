/**
 * The end-of-phase sound.
 *
 * Two decisions here are load-bearing:
 *
 * 1. No audio file. An oscillator needs no request, no cache entry, and no
 *    asset licence, and it still works offline on a cold load.
 * 2. The note is scheduled on the Web Audio clock, not with `setTimeout`.
 *    Browsers throttle hidden tabs to roughly one timer callback per minute,
 *    so a 25-minute pomodoro would announce itself up to a minute late — the
 *    exact situation a pomodoro exists for.
 *
 * The context is created on the first click (`primeChime`), because an
 * AudioContext built before a user gesture starts suspended and stays silent.
 */

export type ChimeKind = 'done' | 'phase'

interface Note {
  /** Seconds from the start of the pattern. */
  at: number
  /** Hz. */
  frequency: number
  duration: number
}

const PATTERNS: Record<ChimeKind, Note[]> = {
  // Rising major arpeggio: unmistakably "this one is over".
  done: [
    { at: 0, frequency: 880, duration: 0.14 },
    { at: 0.2, frequency: 1174.7, duration: 0.14 },
    { at: 0.4, frequency: 1568, duration: 0.22 },
  ],
  // Two softer notes for a phase boundary you are about to walk back from.
  phase: [
    { at: 0, frequency: 660, duration: 0.12 },
    { at: 0.16, frequency: 990, duration: 0.16 },
  ],
}

let context: AudioContext | null = null
let scheduled: OscillatorNode[] = []
let fallbackTimer: number | null = null
/** The run we are waiting to announce, so it can be re-armed once audio unlocks. */
let pending: { atMs: number; kind: ChimeKind } | null = null
/** True when the pending chime sits on the audio clock rather than a JS timer. */
let armedOnAudio = false

/** Safari before 14.1 exposes only the prefixed constructor. */
interface LegacyAudioWindow extends Window {
  webkitAudioContext?: typeof AudioContext
}

function audioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (context) return context

  // `webkitAudioContext` is missing from lib.dom; this is the one place that
  // knows about it, so the cast stays bounded.
  const legacyWindow = window as LegacyAudioWindow
  const Ctor = window.AudioContext ?? legacyWindow.webkitAudioContext
  if (!Ctor) return null

  try {
    context = new Ctor()
  } catch {
    context = null
  }
  return context
}

/**
 * Call from a gesture so the context is allowed to make sound.
 *
 * A context created before any gesture starts suspended, and its clock does not
 * advance while it is. Anything scheduled on that frozen clock would fire late
 * by however long the page waited — a restored timer is exactly that case — so
 * the pending announcement is rebuilt on the audio clock once it runs.
 */
export function primeChime(): void {
  const ctx = audioContext()
  if (!ctx || ctx.state === 'running') return
  void ctx.resume().then(() => {
    if (armedOnAudio || !pending) return
    clearScheduled()
    arm()
  })
}

function play(kind: ChimeKind, delaySeconds = 0): void {
  const ctx = audioContext()
  if (!ctx) return

  const start = ctx.currentTime + delaySeconds
  for (const note of PATTERNS[kind]) {
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.value = note.frequency

    // Short attack and exponential decay: a square-edged beep clicks.
    const begins = start + note.at
    gain.gain.setValueAtTime(0.0001, begins)
    gain.gain.exponentialRampToValueAtTime(0.25, begins + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, begins + note.duration)

    oscillator.connect(gain).connect(ctx.destination)
    oscillator.start(begins)
    oscillator.stop(begins + note.duration + 0.02)

    scheduled.push(oscillator)
    oscillator.onended = () => {
      scheduled = scheduled.filter((node) => node !== oscillator)
    }
  }
}

/** Stop whatever is armed; the pending run is left alone. */
function clearScheduled(): void {
  if (fallbackTimer !== null) {
    window.clearTimeout(fallbackTimer)
    fallbackTimer = null
  }
  for (const oscillator of scheduled) {
    try {
      oscillator.stop()
    } catch {
      // Already stopped; nothing to undo.
    }
  }
  scheduled = []
  armedOnAudio = false
}

/**
 * Arm the pending announcement on the best clock available.
 *
 * The audio clock is preferred because it keeps time in a hidden tab, where
 * `setTimeout` is throttled to about one callback a minute. A suspended context
 * cannot provide that — its clock is frozen — so in that case (and where Web
 * Audio is missing entirely) the JS timer remains the honest fallback.
 */
function arm(): void {
  if (!pending || typeof window === 'undefined') return

  const ctx = audioContext()
  const delayMs = Math.max(0, pending.atMs - Date.now())

  if (ctx && ctx.state === 'running') {
    armedOnAudio = true
    play(pending.kind, delayMs / 1000)
    return
  }

  const kind = pending.kind
  fallbackTimer = window.setTimeout(() => {
    fallbackTimer = null
    pending = null
    play(kind)
  }, delayMs)
}

/** Announce a run that ends `atMs` from now. Replaces any previous one. */
export function scheduleChime(atMs: number, kind: ChimeKind): void {
  clearScheduled()
  pending = { atMs: Date.now() + Math.max(0, atMs), kind }
  arm()
}

export function cancelChime(): void {
  pending = null
  clearScheduled()
}
