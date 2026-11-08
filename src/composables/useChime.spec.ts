import { afterEach, describe, expect, it, vi } from 'vitest'

/**
 * The chime has one failure mode worth a test: an AudioContext created before
 * any user gesture is suspended, and a suspended context's clock does not
 * advance. A run restored from storage schedules its chime at that moment, so
 * without re-arming after the unlock the note fires late by however long the
 * page sat there — or never.
 */

interface StartedNote {
  when: number
  frequency: number
}

class FakeGain {
  gain = {
    setValueAtTime: () => {},
    exponentialRampToValueAtTime: () => {},
  }
  connect() {
    return { connect: () => {} }
  }
}

class FakeOscillator {
  frequency = { value: 0 }
  type = 'sine'
  onended: (() => void) | null = null
  stopped = false
  constructor(private readonly log: StartedNote[]) {}
  connect() {
    return new FakeGain()
  }
  start(when: number) {
    this.log.push({ when, frequency: this.frequency.value })
  }
  stop() {
    this.stopped = true
  }
}

class FakeAudioContext {
  state: 'suspended' | 'running' = 'suspended'
  currentTime = 0
  destination = {}
  created: StartedNote[] = []
  oscillators: FakeOscillator[] = []
  createOscillator() {
    const osc = new FakeOscillator(this.created)
    this.oscillators.push(osc)
    return osc as unknown as OscillatorNode
  }
  createGain() {
    return new FakeGain() as unknown as GainNode
  }
  resume() {
    this.state = 'running'
    return Promise.resolve()
  }
}

/** A fresh module per test: the context is cached at module scope. */
async function loadChime(context: FakeAudioContext) {
  vi.resetModules()
  vi.stubGlobal('AudioContext', function AudioContextStub() {
    return context
  })
  return import('./useChime')
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('scheduleChime', () => {
  it('takes the audio clock when the context is already running', async () => {
    const ctx = new FakeAudioContext()
    ctx.state = 'running'
    const chime = await loadChime(ctx)

    chime.scheduleChime(1_000, 'done')

    expect(ctx.created).toHaveLength(3)
    expect(ctx.created.map((note) => Math.round(note.frequency))).toEqual([880, 1175, 1568])
  })

  it('stays off a suspended clock and waits on a timer instead', async () => {
    vi.useFakeTimers()
    const ctx = new FakeAudioContext()
    const chime = await loadChime(ctx)

    chime.scheduleChime(1_000, 'done')

    expect(ctx.created).toHaveLength(0)
  })

  it('re-arms on the audio clock once a gesture unlocks audio', async () => {
    const ctx = new FakeAudioContext()
    const chime = await loadChime(ctx)

    chime.scheduleChime(1_000, 'done')
    expect(ctx.created).toHaveLength(0)

    chime.primeChime()
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.state).toBe('running')
    expect(ctx.created).toHaveLength(3)
  })

  it('schedules the note against the time still left, not the frozen clock', async () => {
    const ctx = new FakeAudioContext()
    const chime = await loadChime(ctx)

    chime.scheduleChime(4_000, 'phase')
    chime.primeChime()
    await Promise.resolve()
    await Promise.resolve()

    // The first note lands ~4s out (audio clock is at 0), which is the
    // remaining run time — not 0, which a frozen-clock schedule would give.
    expect(ctx.created[0]!.when).toBeGreaterThan(3.5)
    expect(ctx.created[0]!.when).toBeLessThan(4.5)
  })

  it('replaces a previous announcement instead of stacking them', async () => {
    const ctx = new FakeAudioContext()
    ctx.state = 'running'
    const chime = await loadChime(ctx)

    chime.scheduleChime(60_000, 'done')
    chime.scheduleChime(1_000, 'done')

    // The one-minute pattern is stopped, and only the one-second pattern is
    // left live — otherwise a rescheduled run would be announced twice.
    expect(ctx.oscillators.slice(0, 3).every((osc) => osc.stopped)).toBe(true)
    expect(ctx.created.slice(3)).toHaveLength(3)
    expect(ctx.created[3]!.when).toBeLessThan(2)
  })
})
