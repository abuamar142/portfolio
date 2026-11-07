<template>
  <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
    <div class="panel p-6 md:p-8">
      <div class="flex flex-col items-center gap-8">
        <ProgressRing :progress="progress" :tone="pomodoro.phase === 'focus' ? 'focus' : 'break'">
          <p class="label">{{ phaseLabel }}</p>
          <p class="mt-2 font-mono text-[clamp(2.5rem,9vw,4rem)] leading-none tabular-nums">
            {{ display }}
          </p>
          <p class="data mt-3 text-xs text-ink-3">
            {{ t('focus.pomodoro.today', { n: todayCount }) }}
          </p>
        </ProgressRing>

        <div class="flex items-center gap-2" :aria-label="t('focus.pomodoro.cycle')" role="img">
          <span
            v-for="dot in config.longEvery"
            :key="dot"
            class="size-2"
            :class="dot <= cycleInSet ? 'bg-base-content' : 'bg-base-300'"
          />
          <span class="ml-2 data text-xs text-ink-3">
            {{ t('focus.pomodoro.cycleCount', { done: cycleInSet, total: config.longEvery }) }}
          </span>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3">
          <BaseButton @click="toggle">
            {{ running ? t('focus.common.pause') : t('focus.common.start') }}
          </BaseButton>
          <BaseButton variant="outline" @click="focusSession.skipPomodoroPhase()">
            {{ t('focus.common.skip') }}
          </BaseButton>
          <BaseButton variant="ghost" @click="focusSession.resetPomodoroRun()">
            {{ t('focus.common.reset') }}
          </BaseButton>
        </div>
      </div>

      <details class="mt-10 border-t border-base-300 pt-6">
        <summary class="label cursor-pointer">{{ t('focus.pomodoro.settings') }}</summary>

        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <label v-for="field in durationFields" :key="field.key" class="flex flex-col gap-2">
            <span class="label">{{ field.label }}</span>
            <input
              :value="field.value"
              type="number"
              inputmode="numeric"
              :min="1"
              :max="120"
              class="input input-bordered w-full font-mono text-sm"
              @change="onDurationChange(field.key, $event)"
            />
          </label>

          <label class="flex flex-col gap-2">
            <span class="label">{{ t('focus.pomodoro.longEvery') }}</span>
            <input
              :value="config.longEvery"
              type="number"
              inputmode="numeric"
              min="2"
              max="8"
              class="input input-bordered w-full font-mono text-sm"
              @change="onLongEveryChange"
            />
          </label>
        </div>

        <label class="mt-5 flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            class="checkbox checkbox-sm"
            :checked="pomodoro.autoStart"
            @change="onAutoStartChange"
          />
          <span>{{ t('focus.pomodoro.autoStart') }}</span>
        </label>
      </details>
    </div>

    <TaskChecklist />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  countdownProgress,
  isCountdownRunning,
  remainingAt,
} from '@/lib/focus/countdown'
import { formatDuration } from '@/lib/focus/format'
import { dailyFocusCount, phaseDuration, type PomodoroConfig } from '@/lib/focus/pomodoro'
import { focusSession } from '@/composables/useFocusSession'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProgressRing from '@/components/focus/ProgressRing.vue'
import TaskChecklist from '@/components/focus/TaskChecklist.vue'

const props = defineProps<{ now: number }>()

const { t } = useI18n()
const { snapshot } = focusSession

const pomodoro = computed(() => snapshot.pomodoro)
const config = computed(() => snapshot.config)

const running = computed(() => isCountdownRunning(pomodoro.value.countdown))
const remaining = computed(() =>
  props.now
    ? remainingAt(pomodoro.value.countdown, props.now)
    : pomodoro.value.countdown.remainingMs,
)
const progress = computed(() =>
  props.now ? countdownProgress(pomodoro.value.countdown, props.now) : 0,
)

const display = computed(() =>
  formatDuration(
    props.now ? remaining.value : phaseDuration(config.value, pomodoro.value.phase),
  ),
)

const phaseLabel = computed(() => {
  if (pomodoro.value.phase === 'short') return t('focus.pomodoro.phaseShort')
  if (pomodoro.value.phase === 'long') return t('focus.pomodoro.phaseLong')
  return t('focus.pomodoro.phaseFocus')
})

/** Position inside the current set of `longEvery` focus phases. */
const cycleInSet = computed(() => {
  const every = config.value.longEvery
  const done = pomodoro.value.cycle % every
  return done === 0 && pomodoro.value.cycle > 0 ? every : done
})

const todayCount = computed(() => dailyFocusCount(snapshot.daily, props.now || Date.now()))

const durationFields = computed<
  { key: 'focusMs' | 'shortMs' | 'longMs'; label: string; value: number }[]
>(() => [
  {
    key: 'focusMs',
    label: t('focus.pomodoro.focusLength'),
    value: Math.round(config.value.focusMs / 60_000),
  },
  {
    key: 'shortMs',
    label: t('focus.pomodoro.shortLength'),
    value: Math.round(config.value.shortMs / 60_000),
  },
  {
    key: 'longMs',
    label: t('focus.pomodoro.longLength'),
    value: Math.round(config.value.longMs / 60_000),
  },
])

function toggle(): void {
  if (running.value) focusSession.pausePomodoro()
  else focusSession.startPomodoro()
}

function onDurationChange(key: 'focusMs' | 'shortMs' | 'longMs', event: Event): void {
  const target = event.target as HTMLInputElement
  const minutes = Number(target.value)
  if (!Number.isFinite(minutes) || minutes <= 0) return
  focusSession.setPomodoroConfig({ [key]: minutes * 60_000 } as Partial<PomodoroConfig>)
}

function onLongEveryChange(event: Event): void {
  const target = event.target as HTMLInputElement
  const every = Number(target.value)
  if (!Number.isFinite(every) || every < 2) return
  focusSession.setPomodoroConfig({ longEvery: every })
}

function onAutoStartChange(event: Event): void {
  const target = event.target as HTMLInputElement
  focusSession.setPomodoroAutoStart(target.checked)
}
</script>
