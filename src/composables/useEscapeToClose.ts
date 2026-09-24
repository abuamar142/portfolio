import { onBeforeUnmount, watch, type MaybeRefOrGetter, toValue } from 'vue'

/**
 * Close a dialog on Escape while it is open.
 *
 * Listens on `document` rather than the dialog element: focus usually stays
 * on the trigger that opened the modal, so a template-level `@keydown.esc`
 * never fires (verified on AuthModal/QuoteModal). The listener only exists
 * while the dialog is open and is removed on close/unmount.
 */
export function useEscapeToClose(open: MaybeRefOrGetter<boolean>, close: () => void) {
  // SSG prerender runs in Node — no document, so no listener there.
  if (typeof document === 'undefined') return

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close()
  }
  watch(
    () => toValue(open),
    (isOpen) => {
      if (isOpen) document.addEventListener('keydown', onKeydown)
      else document.removeEventListener('keydown', onKeydown)
    },
    { immediate: true, flush: 'post' },
  )
  onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
}
