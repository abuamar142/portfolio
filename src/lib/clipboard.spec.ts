import { describe, expect, it, vi, afterEach } from 'vitest'
import { copyText } from './clipboard'

const original = { clipboard: navigator.clipboard, secure: window.isSecureContext }

function stubLegacy(succeeds: boolean) {
  document.execCommand = vi.fn(() => succeeds)
}

afterEach(() => {
  Object.defineProperty(navigator, 'clipboard', { value: original.clipboard, configurable: true })
  Object.defineProperty(window, 'isSecureContext', { value: original.secure, configurable: true })
  vi.restoreAllMocks()
})

describe('copyText', () => {
  it('uses the async clipboard in a secure context', async () => {
    const writeText = vi.fn(() => Promise.resolve())
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true })

    await expect(copyText('halo')).resolves.toBe(true)
    expect(writeText).toHaveBeenCalledWith('halo')
  })

  it('falls back to execCommand when the clipboard is rejected', async () => {
    const writeText = vi.fn(() => Promise.reject(new Error('denied')))
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true })
    stubLegacy(true)

    await expect(copyText('halo')).resolves.toBe(true)
  })

  it('falls back outside a secure context, where the API is absent', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true })
    Object.defineProperty(window, 'isSecureContext', { value: false, configurable: true })
    stubLegacy(true)

    await expect(copyText('halo')).resolves.toBe(true)
  })

  it('reports failure and leaves no stray textarea behind', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true })
    Object.defineProperty(window, 'isSecureContext', { value: false, configurable: true })
    stubLegacy(false)

    await expect(copyText('halo')).resolves.toBe(false)
    expect(document.querySelectorAll('textarea')).toHaveLength(0)
  })
})
