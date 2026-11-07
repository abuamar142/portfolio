<template>
  <div class="panel p-6 md:p-8">
    <p class="font-mono text-[clamp(2.75rem,10vw,5rem)] leading-none tabular-nums">
      {{ display }}
    </p>

    <div class="mt-8 flex flex-wrap gap-3">
      <BaseButton @click="toggle">
        {{ running ? t('focus.common.pause') : t('focus.common.start') }}
      </BaseButton>
      <BaseButton variant="outline" :disabled="!running" @click="focusSession.lapWatch()">
        {{ t('focus.stopwatch.lap') }}
      </BaseButton>
      <BaseButton variant="ghost" @click="focusSession.resetWatch()">
        {{ t('focus.common.reset') }}
      </BaseButton>
    </div>

    <div class="mt-10 border-t border-base-300 pt-6">
      <p class="label mb-3">{{ t('focus.stopwatch.laps') }}</p>

      <p v-if="rows.length === 0" class="data text-sm text-ink-3">
        {{ t('focus.stopwatch.empty') }}
      </p>

      <table v-else class="w-full text-left font-mono text-sm tabular-nums">
        <thead>
          <tr class="text-ink-3">
            <th scope="col" class="py-2 font-normal">{{ t('focus.stopwatch.lapNumber') }}</th>
            <th scope="col" class="py-2 font-normal">{{ t('focus.stopwatch.split') }}</th>
            <th scope="col" class="py-2 font-normal">{{ t('focus.stopwatch.total') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.index" class="border-t border-base-300">
            <td class="py-2">{{ row.index }}</td>
            <td class="py-2" :class="{ 'text-voltage-ink': row.fastest, 'text-ink-3': row.slowest }">
              {{ formatStopwatch(row.splitMs) }}
              <span v-if="row.fastest" class="ml-1 text-[0.65rem] uppercase tracking-wider">
                {{ t('focus.stopwatch.fastest') }}
              </span>
              <span v-else-if="row.slowest" class="ml-1 text-[0.65rem] uppercase tracking-wider">
                {{ t('focus.stopwatch.slowest') }}
              </span>
            </td>
            <td class="py-2">{{ formatStopwatch(row.totalMs) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatStopwatch } from '@/lib/focus/format'
import { isStopwatchRunning, lapRows, stopwatchElapsed } from '@/lib/focus/stopwatch'
import { focusSession } from '@/composables/useFocusSession'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps<{ now: number }>()

const { t } = useI18n()
const { snapshot } = focusSession

const running = computed(() => isStopwatchRunning(snapshot.stopwatch))
const elapsed = computed(() =>
  props.now ? stopwatchElapsed(snapshot.stopwatch, props.now) : snapshot.stopwatch.accumulatedMs,
)
const display = computed(() => formatStopwatch(elapsed.value))
const rows = computed(() => lapRows(snapshot.stopwatch.laps).reverse())

function toggle(): void {
  if (running.value) focusSession.pauseWatch()
  else focusSession.startWatch()
}
</script>
