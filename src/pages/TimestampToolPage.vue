<template>
  <PageShell id="timestamp" :title="$t('timestampTool.title')" :lead="$t('timestampTool.dek')">
    <div class="panel p-6 md:p-8">
      <div class="flex flex-col gap-8">
        <div class="flex flex-wrap items-end gap-x-8 gap-y-5">
          <label class="flex min-w-0 flex-1 flex-col gap-2">
            <span class="label">{{ $t('timestampTool.inputLabel') }}</span>
            <input
              v-model="input"
              type="text"
              inputmode="numeric"
              spellcheck="false"
              autocomplete="off"
              class="input input-bordered w-full font-mono text-sm"
              :placeholder="$t('timestampTool.placeholder')"
              @input="convert"
            />
          </label>

          <div class="flex flex-col gap-2">
            <span id="ts-unit" class="label">{{ $t('timestampTool.unit') }}</span>
            <div role="group" aria-labelledby="ts-unit" class="flex">
              <button
                v-for="u in units"
                :key="u.value"
                type="button"
                class="seg"
                :class="{ 'is-active': unit === u.value }"
                :aria-pressed="unit === u.value"
                @click="selectUnit(u.value)"
              >
                {{ $t(u.label) }}
              </button>
            </div>
          </div>

          <BaseButton variant="outline" size="sm" @click="useNow">{{ $t('timestampTool.now') }}</BaseButton>
        </div>

        <p v-if="error" class="data text-sm text-error" role="alert">{{ error }}</p>

        <template v-else-if="parts">
          <p class="data text-sm text-ink-3" role="status">
            {{ $t('timestampTool.readAs', { unit: $t(unitLabel), relative: parts.relative }) }}
          </p>

          <ul class="flex flex-col divide-y divide-base-300 border-y border-base-300">
            <li v-for="row in rows" :key="row.key" class="grid gap-1 py-3 md:grid-cols-[160px_minmax(0,1fr)_auto] md:items-center md:gap-4">
              <span class="label">{{ $t(row.label) }}</span>
              <code class="min-w-0 break-all font-mono text-sm text-base-content">{{ row.value }}</code>
              <button
                type="button"
                class="btn btn-ghost btn-xs justify-self-start md:justify-self-end"
                :aria-label="$t('timestampTool.copyValue', { label: $t(row.label) })"
                @click="copy(row.value)"
              >
                {{ $t('timestampTool.copy') }}
              </button>
            </li>
          </ul>

          <p class="data text-xs text-ink-4">
            {{ $t('timestampTool.tzNote', { offset: parts.offset }) }}
          </p>
        </template>
      </div>
    </div>
  </PageShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageSeo } from '@/composables/usePageSeo'
import { useToast } from '@/composables/useToast'
import { describeDate, parseTimestamp, type DateTimeParts, type TimestampUnit } from '@/lib/timestamp'
import PageShell from '@/components/layout/PageShell.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { copyText } from '@/lib/clipboard'

const { t } = useI18n()
const toast = useToast()

const input = ref('')
const unit = ref<TimestampUnit>('auto')
const error = ref('')
const parts = ref<DateTimeParts | null>(null)

const units = computed<{ value: TimestampUnit; label: string }[]>(() => [
  { value: 'auto', label: 'timestampTool.unitAuto' },
  { value: 'seconds', label: 'timestampTool.unitSeconds' },
  { value: 'milliseconds', label: 'timestampTool.unitMs' },
])

// The unit actually used, kept from the parse instead of re-deriving it on
// every render.
const resolvedUnit = ref<'seconds' | 'milliseconds'>('seconds')
const unitLabel = computed(() =>
  resolvedUnit.value === 'seconds' ? 'timestampTool.unitSeconds' : 'timestampTool.unitMs',
)

const rows = computed(() => {
  const p = parts.value
  if (!p) return []
  return [
    { key: 'iso', label: 'timestampTool.iso', value: p.iso },
    { key: 'utc', label: 'timestampTool.utc', value: p.utc },
    { key: 'local', label: 'timestampTool.local', value: p.local },
    { key: 'sec', label: 'timestampTool.unixSeconds', value: String(p.unixSeconds) },
    { key: 'ms', label: 'timestampTool.unixMs', value: String(p.unixMilliseconds) },
  ]
})

function convert() {
  error.value = ''
  const result = parseTimestamp(input.value, unit.value)
  if (result.ok) {
    resolvedUnit.value = result.unit
    parts.value = describeDate(result.date)
  }
  else {
    parts.value = null
    // An empty field is the initial state, not an error to shout about.
    error.value = input.value.trim() ? result.error : ''
  }
}

function selectUnit(value: TimestampUnit) {
  unit.value = value
  convert()
}

function useNow() {
  input.value = String(Math.floor(Date.now() / 1000))
  unit.value = 'auto'
  convert()
}

async function copy(value: string) {
  if (await copyText(value)) toast.success(t('timestampTool.copied'))
  else toast.error(t('timestampTool.copyFailed'))
}

onMounted(useNow)

usePageSeo({
  title: computed(() => t('head.timestampTool.title')),
  description: computed(() => t('head.timestampTool.dek')),
  ogLabel: 'Tools',
  breadcrumbs: [{ name: t('navigation.explore'), path: '/explore' }],
})
</script>

<style scoped>
.seg {
  min-width: 5rem;
  border: 1px solid var(--color-base-300);
  background: var(--color-base-200);
  padding: 0.5rem 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--color-ink-3);
  cursor: pointer;
}

.seg + .seg {
  border-left: 0;
}

.seg:hover {
  color: var(--color-base-content);
}

.seg.is-active {
  background: var(--color-base-content);
  color: var(--color-base-200);
}

.seg:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
