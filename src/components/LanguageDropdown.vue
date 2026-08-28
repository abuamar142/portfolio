<template>
  <div class="relative" ref="dropdown">
    <!-- Dropdown Trigger -->
    <button
      @click="toggleDropdown"
      class="flex items-center gap-1.5 h-8 px-2.5 bg-surface-overlay border border-border rounded-md text-text-muted hover:text-text-primary hover:border-text-muted transition-all duration-200 text-sm"
    >
      <div class="w-4 h-3 rounded-sm overflow-hidden">
        <img
          :src="currentLanguage.flag"
          :alt="currentLanguage.name"
          class="w-full h-full object-cover"
        />
      </div>
      <span class="text-xs font-medium">{{ currentLanguage.code.toUpperCase() }}</span>
      <ChevronDown
        :class="[
          'w-3 h-3 transition-transform duration-200',
          { 'rotate-180': isOpen },
        ]"
      />
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
        class="absolute right-0 mt-2 w-44 bg-surface-raised border border-border rounded-lg shadow-lg overflow-hidden z-50"
      >
        <div class="py-1">
          <button
            v-for="language in languages"
            :key="language.code"
            @click="changeLanguage(language.code)"
            :class="[
              'w-full px-3 py-2.5 flex items-center gap-2.5 text-left hover:bg-surface-overlay transition-colors duration-150',
              currentLanguage.code === language.code
                ? 'bg-accent-subtle text-accent'
                : 'text-text-secondary hover:text-text-primary',
            ]"
          >
            <div class="w-5 h-4 rounded-sm overflow-hidden">
              <img :src="language.flag" :alt="language.name" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <div class="text-sm">{{ language.name }}</div>
            </div>
            <Check
              v-if="currentLanguage.code === language.code"
              class="w-3.5 h-3.5 text-accent"
            />
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronDown, Check } from 'lucide-vue-next'

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
