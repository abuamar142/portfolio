import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useToast } from '@/composables/useToast'

/**
 * Toasts are the app's only feedback channel for CRUD and auth, and the
 * container announces them via a live region. The module keeps state in
 * module-level refs, so each test drains it first.
 */
describe('useToast', () => {
  beforeEach(() => {
    const { toasts, dismiss } = useToast()
    for (const t of [...toasts.value]) dismiss(t.id)
    vi.useRealTimers()
  })

  it('queues a message with its type', () => {
    const { toasts, success } = useToast()
    success('Cuplikan dibuat!')
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].message).toBe('Cuplikan dibuat!')
    expect(toasts.value[0].type).toBe('success')
  })

  it('dismisses by id', () => {
    const { toasts, info, dismiss } = useToast()
    info('halo')
    const id = toasts.value[0].id
    dismiss(id)
    expect(toasts.value).toHaveLength(0)
  })

  it('auto-dismisses after the timeout', () => {
    vi.useFakeTimers()
    const { toasts, info } = useToast()
    info('sementara')
    expect(toasts.value).toHaveLength(1)
    vi.advanceTimersByTime(3000)
    expect(toasts.value).toHaveLength(0)
  })

  it('keeps errors on screen longer than info', () => {
    vi.useFakeTimers()
    const { toasts, error, info } = useToast()
    info('info')
    error('gagal')
    vi.advanceTimersByTime(3000)
    // info is gone; the error is still readable at 3s (5s TTL).
    expect(toasts.value.map((t) => t.message)).toEqual(['gagal'])
  })

  it('gives every toast a unique id', () => {
    const { toasts, info } = useToast()
    info('a')
    info('b')
    const [first, second] = toasts.value
    expect(first.id).not.toBe(second.id)
  })
})
