import { ref, onMounted, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export function useDarkMode() {
  const isDarkMode = useLocalStorage('dark-mode', false)

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
  }

  const setDarkMode = (value: boolean) => {
    isDarkMode.value = value
  }

  watch(
    isDarkMode,
    (newValue) => {
      if (newValue) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    { immediate: true },
  )

  onMounted(() => {
    // Apply the stored theme on mount
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  })

  return {
    isDarkMode,
    toggleDarkMode,
    setDarkMode,
  }
}
