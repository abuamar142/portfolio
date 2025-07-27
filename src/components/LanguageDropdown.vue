<template>
  <div class="relative" ref="dropdown">
    <!-- Dropdown Trigger -->
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 h-8 sm:h-9 lg:h-10 px-3 sm:px-3 lg:px-4 bg-dracula-selection/80 backdrop-blur-sm border border-dracula-purple/30 rounded-lg text-dracula-foreground hover:border-dracula-purple/50 transition-all duration-300 hover:bg-dracula-purple/10"
    >
      <div class="w-4 h-4 sm:w-5 sm:h-5 rounded-sm overflow-hidden border border-purple-500/30">
        <img
          :src="currentLanguage.flag"
          :alt="currentLanguage.name"
          class="w-full h-full object-cover"
        />
      </div>
      <span class="text-xs sm:text-sm font-medium text-purple-300 font-mono">{{
        currentLanguage.code.toUpperCase()
      }}</span>
      <svg
        :class="[
          'w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200',
          { 'rotate-180': isOpen },
        ]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 bg-dracula-current-line/95 backdrop-blur-sm border border-dracula-purple/30 rounded-lg shadow-lg shadow-dracula-purple/10 overflow-hidden z-50"
      >
        <div class="py-1">
          <button
            v-for="language in languages"
            :key="language.code"
            @click="changeLanguage(language.code)"
            :class="[
              'w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-dracula-purple/10 transition-colors duration-150',
              currentLanguage.code === language.code
                ? 'bg-dracula-purple/20 text-dracula-purple'
                : 'text-dracula-comment hover:text-dracula-foreground',
            ]"
          >
            <div class="w-6 h-6 rounded-sm overflow-hidden border border-dracula-purple/30">
              <img :src="language.flag" :alt="language.name" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <div class="text-sm font-medium">{{ language.name }}</div>
              <div class="text-xs text-dracula-comment">{{ language.nativeName }}</div>
            </div>
            <svg
              v-if="currentLanguage.code === language.code"
              class="w-4 h-4 text-dracula-purple"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const isOpen = ref(false)
const dropdown = ref<HTMLElement>()

const languages = [
  {
    code: 'id',
    name: 'Indonesia',
    nativeName: 'Bahasa Indonesia',
    flag: 'https://flagcdn.com/w20/id.png',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: 'https://flagcdn.com/w20/us.png',
  },
]

const currentLanguage = computed(() => {
  return languages.find((lang) => lang.code === locale.value) || languages[0]
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const changeLanguage = (langCode: string) => {
  locale.value = langCode
  localStorage.setItem('portfolio-language', langCode)
  isOpen.value = false
}

const closeDropdown = (event: Event) => {
  if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  // Load saved language preference
  const savedLanguage = localStorage.getItem('portfolio-language')
  if (savedLanguage && languages.some((lang) => lang.code === savedLanguage)) {
    locale.value = savedLanguage
  }

  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>
