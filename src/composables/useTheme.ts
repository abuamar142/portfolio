import { ref, watchEffect } from 'vue'

const theme = ref<'light' | 'dark'>('dark')

// Initialize from localStorage or system preference
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
  if (stored) {
    theme.value = stored
  } else {
    theme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
}

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', theme.value)
  }

  // Apply theme to document
  watchEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme.value === 'dark')
    }
  })

  return {
    theme,
    toggleTheme,
  }
}
