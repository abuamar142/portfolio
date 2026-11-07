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

/** Call from a click handler so the context is allowed to make sound. */
export function primeChime(): void {
  const ctx = audioContext()
  if (ctx && ctx.state === 'suspended') void ctx.resume()
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

/**
 * Announce a run that ends `atMs` from now, on the audio clock.
 *
 * A JS fallback runs alongside it for the case where no gesture has ever
 * unlocked audio; whichever fires first is the only one heard because
 * `cancelChime` clears both.
 */
export function scheduleChime(atMs: number, kind: ChimeKind): void {
  cancelChime()

  const ctx = audioContext()
  if (ctx) {
    void ctx.resume()
    play(kind, Math.max(0, atMs) / 1000)
    return
  }

  if (typeof window === 'undefined') return
  fallbackTimer = window.setTimeout(() => {
    fallbackTimer = null
    play(kind)
  }, Math.max(0, atMs))
}

export function cancelChime(): void {
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
}
