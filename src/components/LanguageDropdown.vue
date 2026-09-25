<template>
  <div class="flex items-center gap-3.5">
    <button
      v-for="lang in languages"
      :key="lang.code"
      type="button"
      class="label flex min-h-11 items-center px-1.5 transition-colors"
      :class="locale === lang.code ? 'text-base-content underline underline-offset-4 decoration-1' : 'text-ink-4 hover:text-voltage-ink'"
      :aria-current="locale === lang.code ? 'true' : undefined"
      @click="switchLang(lang.code)"
    >
      {{ lang.code.toUpperCase() }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const languages = [
  { code: 'id', name: 'Indonesia' },
  { code: 'en', name: 'English' },
]

function switchLang(langCode: string) {
  locale.value = langCode
  localStorage.setItem('portfolio-language', langCode)
}

onMounted(() => {
  const savedLanguage = localStorage.getItem('portfolio-language')
  if (savedLanguage && languages.some((lang) => lang.code === savedLanguage)) {
    locale.value = savedLanguage
  }
})
</script>
