import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Fullscreen state for the focus page.
 *
 * The target is `document.documentElement` so the entire page goes fullscreen,
 * including the header and navigation. This matches the user's choice to have
 * the header visible while in fullscreen mode.
 *
 * The API requires a user gesture to enter fullscreen, so the state is read-only
 * and cannot be persisted. It is updated only by the native `fullscreenchange`
 * event and by explicit calls to `enter()` or `exit()`.
 */
export function useFocusFullscreen() {
  const isFullscreen = ref(false)

  function update(): void {
    isFullscreen.value = document.fullscreenElement === document.documentElement
  }

  function enter(): void {
    if (document.fullscreenElement) return
    void document.documentElement.requestFullscreen().catch(() => {
      // Permission denied or not supported; no action needed.
    })
  }

  function exit(): void {
    if (!document.fullscreenElement) return
    void document.exitFullscreen().catch(() => {
      // Already exited or not supported; no action needed.
    })
  }

  onMounted(() => {
    document.addEventListener('fullscreenchange', update)
    update()
  })

  onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', update)
  })

  // Expose as an object to avoid reactivity issues with direct ref usage.
  return {
    isFullscreen,
    enter,
    exit,
  }
}
