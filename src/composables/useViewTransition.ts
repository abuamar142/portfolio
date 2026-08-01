/**
 * Composable for View Transitions API with graceful degradation.
 *
 * Wraps callbacks in `document.startViewTransition()` when available,
 * falling back to a direct call on unsupported browsers.
 */
export function useViewTransition() {
  /**
   * Wrap a callback in a view transition if the browser supports it.
   * @param callback - Function to execute during the transition.
   */
  function transitionTo(callback: () => void | Promise<void>): void {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      document.startViewTransition(async () => {
        await callback()
      })
    } else {
      callback()
    }
  }

  return { transitionTo }
}
