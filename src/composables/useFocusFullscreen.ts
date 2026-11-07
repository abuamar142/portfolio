import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/**
 * Fullscreen for the focus stage.
 *
 * Fullscreening the stage element rather than `document.documentElement` is
 * what removes the page title, the lead, the storage note and the site footer:
 * the browser paints only the fullscreened subtree, so the rest of the
 * document is gone without us hiding anything by hand.
 *
 * Browsers without the API (or that refuse it) get a CSS takeover: the same
 * element is pinned to the viewport with an opaque background, which covers the
 * page chrome identically. Both paths end in one `expanded` boolean, so the
 * page never has to reason about which one is running.
 */
export function useFocusFullscreen(stage: Ref<HTMLElement | null>) {
  const native = ref(false)
  const fallback = ref(false)

  function sync(): void {
    const element = stage.value
    native.value = element !== null && document.fullscreenElement === element
  }

  async function enter(): Promise<void> {
    if (native.value || fallback.value) return

    const element = stage.value
    if (!element || typeof element.requestFullscreen !== 'function') {
      fallback.value = true
      return
    }

    try {
      await element.requestFullscreen()
    } catch {
      // Denied by policy or unsupported: the takeover still fills the view.
      fallback.value = true
    }
    sync()
  }

  async function exit(): Promise<void> {
    fallback.value = false
    if (document.fullscreenElement !== null) {
      try {
        await document.exitFullscreen()
      } catch {
        // Already out.
      }
    }
    sync()
  }

  function onKeydown(event: KeyboardEvent): void {
    // Native fullscreen handles Escape itself; the CSS takeover needs a way out.
    if (event.key === 'Escape' && fallback.value) void exit()
  }

  onMounted(() => {
    document.addEventListener('fullscreenchange', sync)
    document.addEventListener('keydown', onKeydown)
    sync()
  })

  onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', sync)
    document.removeEventListener('keydown', onKeydown)
    // The browser drops fullscreen when the element unmounts, but these flags
    // (and the scroll lock) would otherwise follow us to the next route.
    fallback.value = false
    native.value = false
    if (document.fullscreenElement !== null) void document.exitFullscreen().catch(() => {})
  })

  return { native, fallback, enter, exit }
}
