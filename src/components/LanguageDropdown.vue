<template>
  <div ref="dropdown" class="relative">
    <button
      type="button"
      class="btn btn-ghost btn-sm min-h-11 gap-1.5 px-2 font-mono text-[11px] uppercase tracking-wider text-ink-3 hover:text-base-content sm:min-h-9"
      :aria-expanded="isOpen"
      aria-haspopup="menu"
      :aria-label="`Language: ${currentLanguage.name}`"
      @click="toggleDropdown"
    >
      <span class="w-4 h-3 overflow-hidden rounded-[2px] border border-base-300">
        <img :src="currentLanguage.flag" :alt="currentLanguage.name" class="h-full w-full object-cover" />
      </span>
      <span>{{ currentLanguage.code.toUpperCase() }}</span>
      <ChevronDown
        :class="['size-3 transition-transform duration-200', { 'rotate-180': isOpen }]"
        aria-hidden="true"
      />
    </button>

    <Transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="panel absolute right-0 z-50 mt-2 w-48 overflow-hidden p-1 shadow-xl shadow-black/40"
        role="menu"
      >
        <button
          v-for="language in languages"
          :key="language.code"
          type="button"
          role="menuitemradio"
          :aria-checked="currentLanguage.code === language.code"
          class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors"
          :class="
            currentLanguage.code === language.code
              ? 'bg-primary/10 text-base-content'
              : 'text-ink-2 hover:bg-base-300/60 hover:text-base-content'
          "
          @click="changeLanguage(language.code)"
        >
          <span class="h-4 w-5 shrink-0 overflow-hidden rounded-[2px] border border-base-300">
            <img :src="language.flag" :alt="language.name" class="h-full w-full object-cover" />
          </span>
          <span class="flex-1">{{ language.name }}</span>
          <Check v-if="currentLanguage.code === language.code" class="size-3.5 text-primary" aria-hidden="true" />
        </button>
      </div>
    </Transition>
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
  { code: 'id', name: 'Indonesia', flag: 'https://flagcdn.com/w20/id.png' },
  { code: 'en', name: 'English', flag: 'https://flagcdn.com/w20/us.png' },
]

const currentLanguage = computed(
  () => languages.find((lang) => lang.code === locale.value) || languages[0],
)

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

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') isOpen.value = false
}

onMounted(() => {
  const savedLanguage = localStorage.getItem('portfolio-language')
  if (savedLanguage && languages.some((lang) => lang.code === savedLanguage)) {
    locale.value = savedLanguage
  }
  document.addEventListener('click', closeDropdown)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
  document.removeEventListener('keydown', onKeydown)
})
</script>
