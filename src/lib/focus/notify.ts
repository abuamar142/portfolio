/**
 * OS notification for a run that ends while the tab is in the background.
 *
 * Shown only when the page is hidden: with the tab in front, the in-page notice
 * already says the same thing and a system popup on top of it is noise.
 *
 * Permission is requested from a gesture (the moment a run starts), never on
 * load — a prompt that arrives before the visitor asked for anything is the
 * kind that gets denied for good. A denial is final here: `requestPermission`
 * returns immediately once the state is not `default`, so the visitor is never
 * asked twice.
 */

/** Whether a notification can actually be shown right now. */
export function canNotify(): boolean {
  return typeof Notification !== 'undefined' && Notification.permission === 'granted'
}

/** Ask once, from a user gesture. Safe to call on every start. */
export function requestNotifyPermission(): void {
  if (typeof Notification === 'undefined' || Notification.permission !== 'default') return
  void Notification.requestPermission().catch(() => {
    // A browser that refuses the call (insecure context, embedded frame) simply
    // leaves the in-page notice as the only announcement.
  })
}

/** Announce a finished run, but only when nobody is looking at the page. */
export function notifyHidden(title: string, body: string): void {
  if (!canNotify()) return
  if (typeof document !== 'undefined' && document.visibilityState === 'visible') return
  try {
    new Notification(title, { body, tag: 'focus-run', icon: '/og-default.png' })
  } catch {
    // Some platforms refuse construction outside a service worker.
  }
}
