// Dark-only — theme toggle removed. Keep composable for compat, always dark.
import { ref } from 'vue'

const theme = ref<'dark'>('dark')

if (typeof window !== 'undefined') {
  document.documentElement.classList.add('dark')
  document.documentElement.style.colorScheme = 'dark'
  try {
    localStorage.setItem('theme', 'dark')
  } catch {}
}

export function useTheme() {
  const toggleTheme = () => {
    // No-op: dark only
    document.documentElement.classList.add('dark')
  }

  return {
    theme,
    toggleTheme,
  }
}
