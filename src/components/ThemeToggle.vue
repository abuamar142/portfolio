<template>
  <button
    type="button"
    class="label flex min-h-11 min-w-11 items-center justify-center text-ink-4 transition-colors hover:text-voltage-ink"
    :aria-label="label"
    :title="label"
    @click="cycle"
  >
    <Monitor v-if="mode === 'system'" class="size-4" aria-hidden="true" />
    <Sun v-else-if="mode === 'light'" class="size-4" aria-hidden="true" />
    <Moon v-else class="size-4" aria-hidden="true" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Monitor, Sun, Moon } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'

const { t } = useI18n()
const { mode, cycle } = useTheme()

const label = computed(() => `${t('theme.label')}: ${t('theme.' + mode.value)}`)
</script>
