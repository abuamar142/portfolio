<template>
  <PageShell id="focus" :title="t('focus.title')" :lead="t('focus.dek')">
    <div class="flex flex-col gap-8">
      <header class="flex items-center justify-between gap-4">
        <SegmentedTabs
          :model-value="mode"
          :options="modeOptions"
          :legend="t('focus.tabs.label')"
          @update:model-value="select"
        />
        <button
          type="button"
          class="btn btn-sm btn-outline"
          :aria-label="isFullscreen ? t('focus.common.exitFullscreen') : t('focus.common.enterFullscreen')"
          :aria-pressed="isFullscreen"
          @click="isFullscreen ? exit() : enter()"
        >
          <Maximize2 v-if="!isFullscreen" class="size-4" aria-hidden="true" />
          <Minimize2 v-else class="size-4" aria-hidden="true" />
        </button>
      </header>

      <p
        v-if="noticeKey"
        role="status"
        class="data flex items-start gap-3 border border-base-300 bg-base-200 px-4 py-3 text-sm"
      >
        <span class="flex-1">{{ t(noticeKey) }}</span>
        <button
          type="button"
          class="notice-dismiss"
          :aria-label="t('focus.common.dismiss')"
          @click="focusSession.dismissNotice()"
        >
          <X class="size-4" aria-hidden="true" />
        </button>
      </p>

      <ClockPanel v-if="mode === 'clock'" :now="now" />
      <TimerPanel v-else-if="mode === 'timer'" :now="now" />
      <StopwatchPanel v-else-if="mode === 'stopwatch'" :now="now" />
      <PomodoroPanel v-else :now="now" />

      <p class="data text-xs text-ink-4">{{ t('focus.storageNote') }}</p>
    </div>
  </PageShell>
</template>

<script setup lang="ts">
import { computed, onMounted, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { X, Maximize2, Minimize2 } from 'lucide-vue-next'
import { FOCUS_MODES, type FocusMode } from '@/lib/focus/store'
import { formatDuration } from '@/lib/focus/format'
import { isCountdownRunning, remainingAt } from '@/lib/focus/countdown'
import { focusSession, initFocusSession } from '@/composables/useFocusSession'
import { usePageSeo } from '@/composables/usePageSeo'
import { useFocusFullscreen } from '@/composables/useFocusFullscreen'
import PageShell from '@/components/layout/PageShell.vue'
import SegmentedTabs from '@/components/focus/SegmentedTabs.vue'
import ClockPanel from '@/components/focus/ClockPanel.vue'
import TimerPanel from '@/components/focus/TimerPanel.vue'
import StopwatchPanel from '@/components/focus/StopwatchPanel.vue'
import PomodoroPanel from '@/components/focus/PomodoroPanel.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const { snapshot, now, noticeKey } = focusSession
const { isFullscreen, enter, exit } = useFocusFullscreen()

const mode = computed(() => snapshot.mode)

const modeOptions = computed(() =>
  FOCUS_MODES.map((value) => ({ value, label: t(`focus.tabs.${value}`) })),
)

function toMode(value: unknown): FocusMode | null {
  return typeof value === 'string' && FOCUS_MODES.includes(value as FocusMode)
    ? (value as FocusMode)
    : null
}

function select(value: string): void {
  const next = toMode(value)
  if (!next || next === snapshot.mode) return
  focusSession.setMode(next)
  void router.replace({ query: { ...route.query, mode: next } })
}

/**
 * The tab is in the URL so a mode can be linked (`?mode=pomodoro`) and the
 * back button walks between modes. The stored mode is the fallback.
 */
watch(
  () => route.query.mode,
  (value) => {
    const parsed = toMode(value)
    if (parsed && parsed !== snapshot.mode) focusSession.setMode(parsed)
  },
)

onMounted(() => {
  initFocusSession()
  const fromQuery = toMode(route.query.mode)
  if (fromQuery && fromQuery !== snapshot.mode) focusSession.setMode(fromQuery)
})

/**
 * The countdown doubles as the tab title while this page is open, so the
 * remaining time is readable from a background tab without a notification
 * permission. The base title comes from i18n rather than the DOM, so leaving
 * the countdown restores it exactly.
 *
 * Written directly instead of through a second `useHead` registration: two
 * title entries would both claim the tag, and `usePageSeo` owns the head for
 * this page already.
 */
watchEffect(() => {
  if (typeof document === 'undefined') return

  const base = t('head.focus.title')
  const at = now.value
  const running = !at
    ? null
    : isCountdownRunning(snapshot.timer)
      ? remainingAt(snapshot.timer, at)
      : isCountdownRunning(snapshot.pomodoro.countdown)
        ? remainingAt(snapshot.pomodoro.countdown, at)
        : null

  document.title = running === null ? base : `${formatDuration(running)} · ${base}`
})

usePageSeo({
  title: computed(() => t('head.focus.title')),
  description: computed(() => t('head.focus.dek')),
  ogLabel: 'Tools',
  breadcrumbs: [{ name: t('navigation.explore'), path: '/explore' }],
})
</script>

<style scoped>
.notice-dismiss {
  display: inline-grid;
  place-items: center;
  color: var(--color-ink-4);
  cursor: pointer;
}

.notice-dismiss:hover {
  color: var(--color-base-content);
}

.notice-dismiss:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
