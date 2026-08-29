<template>
  <div class="relative" ref="dropdown">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-1.5 h-8 px-2.5 rounded-md border text-xs font-medium transition-colors"
      :style="{ background: isOpen ? 'var(--color-surface-raised)' : 'var(--color-surface-raised)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }"
    >
      <span class="w-4 h-3 rounded-sm overflow-hidden border" style="border-color: var(--color-border)">
        <img :src="currentLanguage.flag" :alt="currentLanguage.name" class="w-full h-full object-cover" />
      </span>
      <span>{{ currentLanguage.code.toUpperCase() }}</span>
      <ChevronDown :class="['w-3 h-3 transition-transform duration-200', { 'rotate-180': isOpen }]" />
    </button>

    <transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-44 rounded-xl border shadow-lg overflow-hidden z-50"
        style="background: var(--color-surface-raised); border-color: var(--color-border)"
      >
        <div class="py-1">
          <button
            v-for="language in languages"
            :key="language.code"
            @click="changeLanguage(language.code)"
            class="w-full px-3 py-2.5 flex items-center gap-2.5 text-left transition-colors text-sm"
            :style="currentLanguage.code === language.code ? { background: 'var(--color-accent-subtle)', color: 'var(--color-text-primary)' } : { color: 'var(--color-text-secondary)' }"
          >
            <span class="w-5 h-4 rounded-sm overflow-hidden border" style="border-color: var(--color-border)">
              <img :src="language.flag" :alt="language.name" class="w-full h-full object-cover" />
            </span>
            <span class="flex-1 text-sm">{{ language.name }}</span>
            <Check v-if="currentLanguage.code === language.code" class="w-3.5 h-3.5" style="color: var(--color-accent)" />
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
  { code: 'id', name: 'Indonesia', nativeName: 'Bahasa Indonesia', flag: 'https://flagcdn.com/w20/id.png' },
  { code: 'en', name: 'English', nativeName: 'English', flag: 'https://flagcdn.com/w20/us.png' },
]

const currentLanguage = computed(() => languages.find((lang) => lang.code === locale.value) || languages[0])

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
