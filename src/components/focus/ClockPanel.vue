<template>
  <div class="panel p-6 md:p-8">
    <div class="flex flex-col gap-2">
      <p class="label">{{ t('focus.clock.now') }}</p>
      <p class="font-mono tabular-nums leading-none">
        <template v-if="parts">
          <span class="text-[clamp(3rem,11vw,6.5rem)] tracking-tight">{{ parts.time }}</span>
          <span class="text-[clamp(1.25rem,3vw,2rem)] text-ink-3">:{{ parts.seconds }}</span>
          <span v-if="parts.meridiem" class="ml-2 align-top text-sm tracking-[0.2em] text-ink-3">
            {{ parts.meridiem }}
          </span>
        </template>
        <span v-else class="text-[clamp(3rem,11vw,6.5rem)] tracking-tight text-ink-4">--:--</span>
      </p>
      <p class="data text-sm text-ink-3">{{ parts?.date ?? '\u00a0' }}</p>
    </div>

    <div class="mt-8 flex flex-wrap items-end gap-x-8 gap-y-5 border-t border-base-300 pt-6">
      <label class="flex flex-col gap-2">
        <span class="label">{{ t('focus.clock.zone') }}</span>
        <select
          :value="clock.zone"
          class="input input-bordered font-mono text-sm"
          @change="onZoneChange"
        >
          <option v-for="zone in zones" :key="zone.value" :value="zone.value">
            {{ zone.label }}
          </option>
        </select>
      </label>

      <div class="flex flex-col gap-2">
        <span class="label">{{ t('focus.clock.format') }}</span>
        <SegmentedTabs
          :model-value="clock.hour12 ? '12' : '24'"
          :options="formatOptions"
          :legend="t('focus.clock.format')"
          @update:model-value="setHour12($event === '12')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { clockParts, zoneOffsetLabel } from '@/lib/focus/format'
import { CLOCK_ZONES, type ClockZone } from '@/lib/focus/store'
import { focusSession } from '@/composables/useFocusSession'
import SegmentedTabs from '@/components/focus/SegmentedTabs.vue'

const props = defineProps<{ now: number }>()

const { t, locale } = useI18n()
const { snapshot, setClockPrefs } = focusSession
const clock = computed(() => snapshot.clock)

const parts = computed(() => {
  // `0` is the server render: showing the build-time clock in the prerendered
  // HTML would be wrong twice over, so the face holds a placeholder and fills
  // in on mount.
  if (!props.now) return null
  return clockParts(props.now, {
    locale: locale.value,
    hour12: clock.value.hour12,
    timeZone: clock.value.zone === 'local' ? undefined : clock.value.zone,
  })
})

const zoneLabels = computed<Record<ClockZone, string>>(() => ({
  local: t('focus.clock.zoneLocal'),
  UTC: 'UTC',
  'Asia/Jakarta': `WIB ${zoneOffsetLabel(props.now, 'Asia/Jakarta')}`,
  'Asia/Makassar': `WITA ${zoneOffsetLabel(props.now, 'Asia/Makassar')}`,
  'Asia/Jayapura': `WIT ${zoneOffsetLabel(props.now, 'Asia/Jayapura')}`,
}))

const zones = computed(() =>
  CLOCK_ZONES.map((zone) => ({ value: zone, label: zoneLabels.value[zone] })),
)

const formatOptions = computed(() => [
  { value: '24', label: '24h' },
  { value: '12', label: '12h' },
])

function setHour12(hour12: boolean): void {
  setClockPrefs({ hour12 })
}

function onZoneChange(event: Event): void {
  const target = event.target as HTMLSelectElement
  setClockPrefs({ zone: target.value as ClockZone })
}
</script>
