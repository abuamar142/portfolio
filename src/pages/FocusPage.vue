<template>
  <PageShell id="focus" :title="t('focus.title')" :lead="t('focus.dek')">
    <div class="flex flex-col gap-8">
      <div
        ref="stageRef"
        class="stage"
        :class="{ 'is-fallback': fallback }"
      >
        <header class="flex flex-wrap items-center justify-between gap-4">
          <SegmentedTabs
            :model-value="mode"
            :options="modeOptions"
            :legend="t('focus.tabs.label')"
            @update:model-value="select"
          />
          <button
            type="button"
            class="btn btn-sm btn-outline"
            :aria-label="expanded ? t('focus.common.exitFullscreen') : t('focus.common.enterFullscreen')"
            :aria-pressed="expanded"
            @click="expanded ? exit() : enter()"
          >
            <Minimize2 v-if="expanded" class="size-4" aria-hidden="true" />
            <Maximize2 v-else class="size-4" aria-hidden="true" />
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

        <div class="stage-body">
          <ClockPanel v-if="mode === 'clock'" class="stage-panel" :now="now" />
          <TimerPanel v-else-if="mode === 'timer'" class="stage-panel" :now="now" />
          <StopwatchPanel v-else-if="mode === 'stopwatch'" class="stage-panel" :now="now" />
          <PomodoroPanel v-else class="stage-panel" :now="now" />
        </div>
      </div>

      <p class="data text-xs text-ink-4">{{ t('focus.storageNote') }}</p>
    </div>
  </PageShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { Maximize2, Minimize2, X } from 'lucide-vue-next'
import { FOCUS_MODES, type FocusMode } from '@/lib/focus/store'
import { formatDuration } from '@/lib/focus/format'
import { isCountdownRunning, remainingAt } from '@/lib/focus/countdown'
import { notifyHidden } from '@/lib/focus/notify'
import { focusSession, initFocusSession } from '@/composables/useFocusSession'
import { useFocusFullscreen } from '@/composables/useFocusFullscreen'
import { usePageSeo } from '@/composables/usePageSeo'
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

const stageRef = ref<HTMLDivElement | null>(null)
const { native, fallback, enter, exit } = useFocusFullscreen(stageRef)
const expanded = computed(() => native.value || fallback.value)

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

/**
 * A run that ends while the tab is in the background gets a system
 * notification; the in-page banner covers every other case, so this stays
 * silent when the page is in front. The text is the same key the banner uses,
 * which keeps the two from drifting apart.
 */
watch(noticeKey, (key) => {
  if (key) notifyHidden(t('focus.title'), t(key))
})

usePageSeo({
  title: computed(() => t('head.focus.title')),
  description: computed(() => t('head.focus.dek')),
  ogLabel: 'Tools',
  breadcrumbs: [{ name: t('navigation.explore'), path: '/explore' }],
})
</script>

<style scoped>
.stage {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 0;
}

/**
 * The panel owns the rest of the stage. `flex: 1` is inert in the normal page
 * flow (the stage is only as tall as its content) and becomes the thing that
 * removes the empty band under the timer once the stage is the viewport.
 */
.stage-panel {
  flex: 1;
  min-height: 0;
}

/**
 * In-page the body is just a transparent wrapper: each tab keeps its natural
 * height, which is what the page's own rhythm expects.
 */
.stage-body {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/**
 * In fullscreen the body is the one thing with a height, so switching tabs
 * cannot resize the block. Measured before this existed: clock 337px, timer
 * 641px, stopwatch 469px, pomodoro 564px — the whole column jumped on every tab
 * change. Panels now centre inside a fixed box instead.
 *
 * `flex: 1 0 auto` and no `overflow` of its own: when a panel is taller than
 * the screen the body grows to the content and the stage scrolls once. Letting
 * both scroll produced nested scrollbars, and centring inside a scroller that
 * is also clipped is what made the earlier layout drift.
 */
.stage:fullscreen .stage-body,
.stage.is-fallback .stage-body {
  flex: 1 0 auto;
  justify-content: safe center;
}

.stage:fullscreen .stage-body > .stage-panel,
.stage.is-fallback .stage-body > .stage-panel {
  flex: 0 0 auto;
}

/* Native fullscreen: the browser already sized the element to the screen. */
.stage:fullscreen {
  padding: 1.5rem;
  background: var(--color-base-100);
  overflow-y: auto;
}

/* CSS takeover for browsers without the API: cover the page chrome. */
.stage.is-fallback {
  position: fixed;
  inset: 0;
  z-index: 200;
  height: 100dvh;
  padding: 1.5rem;
  background: var(--color-base-100);
  overflow-y: auto;
}

/**
 * Both fullscreen paths lay out one centred column.
 *
 * The body below is `flex: 1`, so it absorbs every pixel the header does not
 * use: the column always spans the screen and only `align-items` still has
 * work to do.
 */
.stage:fullscreen,
.stage.is-fallback {
  align-items: center;
}

.stage:fullscreen > *,
.stage.is-fallback > * {
  width: 100%;
  max-width: 60rem;
}

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
