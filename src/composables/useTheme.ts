import { ref, onMounted } from 'vue'

const isClient = typeof window !== 'undefined'

export type ThemeMode = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'portfolio-theme'
const VALID_MODES: ThemeMode[] = ['light', 'dark', 'system']
const DARK_ATTR = 'portfolio-dark'
const LIGHT_BG = '#f3f4ef'
const DARK_BG = '#14161a'

/** Shared across every component that mounts a toggle (module singleton). */
const mode = ref<ThemeMode>('system')
let watching = false

function isDark(): boolean {
  return (
    mode.value === 'dark' ||
    (mode.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  )
}

/** Paint resolved theme: <html data-theme>, color-scheme, prep bg var, metas. */
function apply(): void {
  if (!isClient) return
  const dark = isDark()
  const root = document.documentElement
  if (dark) root.setAttribute('data-theme', DARK_ATTR)
  else root.removeAttribute('data-theme')
  root.style.colorScheme = dark ? 'dark' : 'light'
  root.style.setProperty('--prep-bg', dark ? DARK_BG : LIGHT_BG)
  document
    .querySelector('meta[name="color-scheme"]')
    ?.setAttribute('content', dark ? 'dark' : 'light')
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', dark ? DARK_BG : LIGHT_BG)
}

/** Cycle system -> light -> dark -> system, persisting the choice. */
function cycle(): void {
  mode.value = mode.value === 'system' ? 'light' : mode.value === 'light' ? 'dark' : 'system'
  try {
    localStorage.setItem(STORAGE_KEY, mode.value)
  } catch {}
  apply()
}

export function useTheme() {
  // Storage is read after mount (not at setup) so server-rendered markup
  // hydrates cleanly — same pattern as LanguageDropdown.
  onMounted(() => {
    if (!watching) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored && VALID_MODES.includes(stored as ThemeMode)) mode.value = stored as ThemeMode
      } catch {}
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', () => mode.value === 'system' && apply())
      watching = true
    }
    apply()
  })

  return { mode, cycle }
}
