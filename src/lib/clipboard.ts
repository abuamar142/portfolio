/**
 * Copy text to the clipboard, with a fallback that works outside a secure
 * context.
 *
 * `navigator.clipboard` only exists in a secure context, so the tool pages
 * over plain http (a LAN IP, a file:// preview) and older browsers throw. The
 * deprecated `execCommand('copy')` path still works there, and having it in one
 * place beats the ten hand-rolled copies this replaced — eight of which had no
 * fallback at all.
 *
 * Returns whether the text actually landed, so each caller can pick its own
 * feedback: a toast, a two-second label swap, or nothing.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Denied permission or a hostile iframe — try the old path below.
  }

  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  try {
    area.select()
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    document.body.removeChild(area)
  }
}
