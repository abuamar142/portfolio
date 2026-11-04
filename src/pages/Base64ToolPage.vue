<template>
  <PageShell id="base64" :title="$t('base64Tool.title')" :lead="$t('base64Tool.dek')">
    <div class="panel p-6 md:p-8">
      <div class="flex flex-col gap-8">
        <!-- Mode + variant. Both are segmented controls: one choice each, and
             the active cell is visible without opening anything. -->
        <div class="flex flex-wrap items-end gap-x-8 gap-y-5">
          <div class="flex flex-col gap-2">
            <span id="b64-mode" class="label">{{ $t('base64Tool.mode') }}</span>
            <div role="group" aria-labelledby="b64-mode" class="flex">
              <button
                v-for="m in modes"
                :key="m.value"
                type="button"
                class="seg"
                :class="{ 'is-active': mode === m.value }"
                :aria-pressed="mode === m.value"
                @click="mode = m.value"
              >
                {{ $t(m.label) }}
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <span id="b64-variant" class="label">{{ $t('base64Tool.variant') }}</span>
            <div role="group" aria-labelledby="b64-variant" class="flex">
              <button
                v-for="v in variants"
                :key="v.value"
                type="button"
                class="seg"
                :class="{ 'is-active': variant === v.value }"
                :aria-pressed="variant === v.value"
                @click="variant = v.value"
              >
                {{ v.label }}
              </button>
            </div>
          </div>
        </div>

        <div>
          <label class="label" for="b64-input">
            <span class="label-text">
              {{ mode === 'encode' ? $t('base64Tool.plainLabel') : $t('base64Tool.encodedLabel') }}
            </span>
          </label>
          <textarea
            id="b64-input"
            v-model="input"
            rows="8"
            spellcheck="false"
            autocapitalize="off"
            autocomplete="off"
            class="textarea textarea-bordered mt-2 w-full resize-y font-mono text-sm leading-relaxed"
            :placeholder="mode === 'encode' ? $t('base64Tool.plainPlaceholder') : $t('base64Tool.encodedPlaceholder')"
            @input="convert"
          />
        </div>

        <!-- File mode: encode a file without leaving the page. -->
        <div v-if="mode === 'encode'" class="flex flex-col gap-3 border-t border-base-300 pt-6">
          <span class="label">{{ $t('base64Tool.fileLabel') }}</span>
          <div class="flex flex-wrap items-center gap-3">
            <BaseButton variant="outline" size="sm" @click="pickFile">
              {{ $t('base64Tool.chooseFile') }}
            </BaseButton>
            <span v-if="fileName" class="data text-sm text-ink-3">{{ fileName }}</span>
          </div>
          <input ref="fileEl" type="file" class="sr-only" @change="onFile" />
        </div>

        <div class="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <p v-if="error" class="data text-sm text-error" role="alert">{{ error }}</p>
          <p v-else-if="output" class="data text-sm text-ink-3" role="status">
            {{ $t('base64Tool.sizes', { inBytes: inBytes, outBytes: outBytes }) }}
          </p>
          <div class="flex flex-wrap gap-3">
            <BaseButton variant="outline" size="sm" :disabled="!output" @click="copyOutput">
              {{ $t('base64Tool.copy') }}
            </BaseButton>
            <BaseButton variant="ghost" size="sm" :disabled="!input && !output" @click="clearAll">
              {{ $t('base64Tool.clear') }}
            </BaseButton>
          </div>
        </div>

        <div>
          <span class="label">{{ $t('base64Tool.outputLabel') }}</span>
          <pre
            tabindex="0"
            class="out panel mt-2 max-h-[28rem] overflow-auto p-4 font-mono text-sm"
            :aria-label="$t('base64Tool.outputLabel')"
          ><code v-if="output">{{ output }}</code><span v-else class="text-ink-4">{{ $t('base64Tool.emptyOutput') }}</span></pre>
        </div>
      </div>
    </div>
  </PageShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageSeo } from '@/composables/usePageSeo'
import { useToast } from '@/composables/useToast'
import {
  base64ByteLength,
  decodeBase64,
  encodeBase64,
  fileToBase64,
  type Base64Variant,
} from '@/lib/base64'
import PageShell from '@/components/layout/PageShell.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const { t } = useI18n()
const toast = useToast()

type Mode = 'encode' | 'decode'

const input = ref('')
const output = ref('')
const error = ref('')
const mode = ref<Mode>('encode')
const variant = ref<Base64Variant>('standard')
const fileName = ref('')
const fileEl = ref<HTMLInputElement | null>(null)

const modes = computed<{ value: Mode; label: string }[]>(() => [
  { value: 'encode', label: 'base64Tool.encode' },
  { value: 'decode', label: 'base64Tool.decode' },
])

const variants: { value: Base64Variant; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'url', label: 'URL-safe' },
]

const inBytes = computed(() =>
  mode.value === 'encode'
    ? new TextEncoder().encode(input.value).length
    : base64ByteLength(input.value),
)
const outBytes = computed(() => new TextEncoder().encode(output.value).length)

/** One path for typing, mode switches and file loads, so state cannot drift. */
function convert() {
  error.value = ''
  if (!input.value) {
    output.value = ''
    return
  }
  if (mode.value === 'encode') {
    output.value = encodeBase64(input.value, variant.value)
    return
  }
  const result = decodeBase64(input.value)
  if (result.ok) output.value = result.value
  else {
    output.value = ''
    error.value = result.error
  }
}

function pickFile() {
  fileEl.value?.click()
}

async function onFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  fileName.value = `${file.name} · ${(file.size / 1024).toFixed(1)} KB`
  error.value = ''
  output.value = await fileToBase64(file)
  // The textarea holds text; the file's base64 lives in the output only.
  input.value = ''
}

async function copyOutput() {
  if (!output.value) return
  try {
    await navigator.clipboard.writeText(output.value)
    toast.success(t('base64Tool.copied'))
  } catch {
    toast.error(t('base64Tool.copyFailed'))
  }
}

function clearAll() {
  input.value = ''
  output.value = ''
  error.value = ''
  fileName.value = ''
  if (fileEl.value) fileEl.value.value = ''
}

usePageSeo({
  title: computed(() => t('head.base64Tool.title')),
  description: computed(() => t('head.base64Tool.dek')),
  ogLabel: 'Tools',
  breadcrumbs: [{ name: t('navigation.explore'), path: '/explore' }],
})
</script>

<style scoped>
.seg {
  min-width: 4.5rem;
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

.out {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
