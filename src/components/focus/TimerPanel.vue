<template>
  <div class="panel p-6 md:p-8">
    <div class="flex flex-col items-center gap-8">
      <ProgressRing :progress="progress" :tone="finished ? 'done' : 'focus'">
        <p class="font-mono text-[clamp(2.5rem,9vw,4.5rem)] leading-none tabular-nums">
          {{ display }}
        </p>
        <p class="label mt-3">{{ statusLabel }}</p>
      </ProgressRing>

      <div class="flex flex-wrap items-center justify-center gap-3">
        <BaseButton @click="toggle">{{ running ? t('focus.common.pause') : t('focus.common.start') }}</BaseButton>
        <BaseButton variant="outline" @click="nudge(-60_000)">
          {{ t('focus.timer.minusMinute') }}
        </BaseButton>
        <BaseButton variant="outline" @click="nudge(60_000)">
          {{ t('focus.timer.plusMinute') }}
        </BaseButton>
        <BaseButton variant="ghost" @click="focusSession.resetTimer()">
          {{ t('focus.common.reset') }}
        </BaseButton>
      </div>
    </div>

    <div class="mt-10 border-t border-base-300 pt-6">
      <p class="label mb-3">{{ t('focus.timer.presets') }}</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="preset in presets"
          :key="preset"
          type="button"
          class="preset"
          :class="{ 'is-active': activePreset === preset }"
          @click="focusSession.setTimerDuration(preset * 60_000)"
        >
          {{ presetLabel(preset) }}
        </button>
      </div>

      <form class="mt-6 flex flex-wrap items-end gap-3" @submit.prevent="applyCustom">
        <label class="flex flex-col gap-2">
          <span class="label">{{ t('focus.timer.custom') }}</span>
          <input
            v-model="custom"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            spellcheck="false"
            class="input input-bordered w-32 font-mono text-sm"
            :placeholder="t('focus.timer.customPlaceholder')"
            :aria-invalid="customError ? 'true' : undefined"
          />
        </label>
        <BaseButton type="submit" variant="outline" size="sm">{{ t('focus.timer.set') }}</BaseButton>
      </form>
      <p v-if="customError" class="data mt-2 text-sm text-error" role="alert">{{ customError }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  countdownProgress,
  isCountdownRunning,
  remainingAt,
} from '@/lib/focus/countdown'
import { formatDuration, parseDurationInput } from '@/lib/focus/format'
import { focusSession } from '@/composables/useFocusSession'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProgressRing from '@/components/focus/ProgressRing.vue'

const props = defineProps<{ now: number }>()

const { t } = useI18n()
const { snapshot } = focusSession

const presets = [1, 3, 5, 10, 15, 25, 45, 60, 90, 120]
const custom = ref('')
const customError = ref('')

const running = computed(() => isCountdownRunning(snapshot.timer))
const remaining = computed(() => (props.now ? remainingAt(snapshot.timer, props.now) : snapshot.timer.remainingMs))
const finished = computed(() => !running.value && snapshot.timer.remainingMs === 0)
const progress = computed(() => (props.now ? countdownProgress(snapshot.timer, props.now) : 0))

const display = computed(() => (props.now ? formatDuration(remaining.value) : formatDuration(snapshot.timer.durationMs)))

const activePreset = computed(() => {
  const minutes = snapshot.timer.durationMs / 60_000
  return Number.isInteger(minutes) ? minutes : null
})

/** Whole hours read better as `1 jam` than as `60 mnt`. */
function presetLabel(minutes: number): string {
  return minutes % 60 === 0
    ? t('focus.timer.hoursShort', { n: minutes / 60 })
    : t('focus.timer.minutesShort', { n: minutes })
}

const statusLabel = computed(() => {
  if (finished.value) return t('focus.timer.finished')
  if (running.value) return t('focus.timer.running')
  return t('focus.timer.paused')
})

function toggle(): void {
  if (running.value) focusSession.pauseTimer()
  else focusSession.startTimer()
}

function nudge(deltaMs: number): void {
  focusSession.nudgeTimer(deltaMs)
}

function applyCustom(): void {
  const parsed = parseDurationInput(custom.value)
  if (parsed === null) {
    customError.value = t('focus.timer.invalid')
    return
  }
  customError.value = ''
  focusSession.setTimerDuration(parsed)
}
</script>

<style scoped>
.preset {
  min-width: 4.5rem;
  border: 1px solid var(--color-base-300);
  background: transparent;
  padding: 0.4rem 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-ink-3);
  cursor: pointer;
}

.preset:hover {
  color: var(--color-base-content);
  border-color: var(--color-base-content);
}

.preset.is-active {
  border-color: var(--color-base-content);
  color: var(--color-base-content);
}

.preset:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
