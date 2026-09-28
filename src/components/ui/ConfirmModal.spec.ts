import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import id from '@/locales/id'

/**
 * ConfirmModal replaced window.confirm() on every destructive action. What
 * matters for the tests: it renders through the shared dialog shell (so focus
 * and Escape behave like every other modal), it can show a busy state while the
 * delete is in flight, and it never performs the action on its own — the parent
 * owns the request lifecycle.
 */
/**
 * BaseModal renders through <Teleport to="body">, so the component's own
 * wrapper stays empty — assertions read from document.body after mounting
 * with attachTo, which is also how the dialog behaves in the app.
 */
// Teleported dialogs accumulate in document.body across tests; clearing
// between cases keeps `dialog()` pointing at the one just mounted.
afterEach(() => {
  document.body.innerHTML = ''
})

function mountConfirm(props: Record<string, unknown>) {
  const i18n = createI18n({ legacy: false, locale: 'id', messages: { id } })
  const host = document.createElement('div')
  document.body.appendChild(host)
  const wrapper = mount(ConfirmModal, {
    props: { open: true, title: 'Hapus kutipan ini?', ...props },
    global: { plugins: [i18n] },
    attachTo: host,
  })
  return wrapper
}

function dialog() {
  const all = document.body.querySelectorAll('dialog')
  return all[all.length - 1]!
}

function buttons(): HTMLButtonElement[] {
  return [...dialog().querySelectorAll('button')]
}

describe('ConfirmModal', () => {
  it('renders the title and both actions', () => {
    mountConfirm({})
    expect(dialog().textContent).toContain('Hapus kutipan ini?')
    const labels = buttons().map((b) => b.textContent?.trim())
    expect(labels).toContain('Batal')
    expect(labels).toContain('Hapus')
  })

  it('emits confirm when the destructive action is pressed', async () => {
    const wrapper = mountConfirm({})
    buttons().find((b) => b.textContent?.includes('Hapus'))!.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
  })

  it('emits cancel when the cancel action is pressed', async () => {
    const wrapper = mountConfirm({})
    buttons().find((b) => b.textContent?.includes('Batal'))!.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })

  it('exposes a busy state while the request runs', () => {
    mountConfirm({ busy: true })
    const confirmBtn = buttons().find((b) => b.textContent?.includes('Hapus'))!
    // BaseButton marks the busy control for assistive tech and blocks clicks.
    expect(confirmBtn.getAttribute('aria-busy')).toBe('true')
    expect(confirmBtn.disabled).toBe(true)
  })

  it('renders an optional explanatory message', () => {
    mountConfirm({ message: 'Tindakan ini tidak bisa dibatalkan.' })
    expect(dialog().textContent).toContain('Tindakan ini tidak bisa dibatalkan.')
  })

  it('uses the shared dialog shell with an accessible name', () => {
    mountConfirm({})
    const dlg = dialog()
    expect(dlg.getAttribute('aria-modal')).toBe('true')
    expect(dlg.getAttribute('aria-labelledby')).toBeTruthy()
  })
})
