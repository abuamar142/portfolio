import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest'
import { canNotify, notifyHidden, requestNotifyPermission } from './notify'

interface FakeNotification {
  title: string
  options?: NotificationOptions
}

const shown: FakeNotification[] = []
let permission: NotificationPermission = 'default'
let requestResult: Promise<NotificationPermission> = Promise.resolve('granted')

/** Minimal stand-in for the browser Notification constructor. */
class StubNotification {
  static get permission(): NotificationPermission {
    return permission
  }
  static requestPermission(): Promise<NotificationPermission> {
    return requestResult
  }
  constructor(title: string, options?: NotificationOptions) {
    shown.push({ title, options })
  }
}

function setVisibility(state: 'visible' | 'hidden'): void {
  Object.defineProperty(document, 'visibilityState', { value: state, configurable: true })
}

beforeEach(() => {
  shown.length = 0
  permission = 'default'
  requestResult = Promise.resolve('granted')
  vi.stubGlobal('Notification', StubNotification)
})

afterEach(() => {
  vi.unstubAllGlobals()
  setVisibility('visible')
})

describe('notifyHidden', () => {
  it('stays quiet while the page is in front', () => {
    permission = 'granted'
    setVisibility('visible')
    notifyHidden('Waktu', 'Timer selesai.')
    expect(shown).toHaveLength(0)
  })

  it('announces a run that ended in a background tab', () => {
    permission = 'granted'
    setVisibility('hidden')
    notifyHidden('Waktu', 'Timer selesai.')
    expect(shown).toEqual([{ title: 'Waktu', options: expect.objectContaining({ body: 'Timer selesai.' }) }])
  })

  it('does nothing without permission', () => {
    permission = 'denied'
    setVisibility('hidden')
    notifyHidden('Waktu', 'Timer selesai.')
    expect(shown).toHaveLength(0)
  })

  it('survives a browser that refuses to construct one', () => {
    permission = 'granted'
    setVisibility('hidden')
    vi.stubGlobal(
      'Notification',
      class {
        static permission: NotificationPermission = 'granted'
        static requestPermission = () => Promise.resolve<NotificationPermission>('granted')
        constructor() {
          throw new Error('not allowed here')
        }
      },
    )
    expect(() => notifyHidden('Waktu', 'Timer selesai.')).not.toThrow()
  })
})

describe('requestNotifyPermission', () => {
  it('asks once, while the state is still undecided', () => {
    const request = vi.spyOn(StubNotification, 'requestPermission')
    requestNotifyPermission()
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('never asks again after a decision', () => {
    permission = 'denied'
    const request = vi.spyOn(StubNotification, 'requestPermission')
    requestNotifyPermission()
    expect(request).not.toHaveBeenCalled()
  })

  it('reports whether a notification can be shown', () => {
    expect(canNotify()).toBe(false)
    permission = 'granted'
    expect(canNotify()).toBe(true)
  })
})
