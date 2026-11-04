<template>
  <PageShell id="json" :title="$t('jsonTool.title')" :lead="$t('jsonTool.dek')">
    <div class="panel p-6 md:p-8">
      <div class="flex flex-col gap-8">
        <div>
          <label class="label" for="json-input">
            <span class="label-text">{{ $t('jsonTool.inputLabel') }}</span>
          </label>
          <textarea
            id="json-input"
            v-model="input"
            rows="10"
            spellcheck="false"
            autocapitalize="off"
            autocomplete="off"
            class="textarea textarea-bordered mt-2 w-full resize-y font-mono text-sm leading-relaxed"
            :placeholder="$t('jsonTool.placeholder')"
            :aria-invalid="error ? 'true' : undefined"
            :aria-describedby="error ? 'json-status' : undefined"
            @keydown="onKeydown"
          />
        </div>

        <!-- Controls. Indent is a segmented group; the two actions are
             independent because minifying and copying are different intents. -->
        <div class="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <div class="flex flex-col gap-2">
            <span id="json-indent-label" class="label">{{ $t('jsonTool.indent') }}</span>
            <div role="group" aria-labelledby="json-indent-label" class="flex">
              <button
                v-for="option in indentOptions"
                :key="option.value"
                type="button"
                class="indent-btn"
                :class="{ 'is-active': indent === option.value }"
                :aria-pressed="indent === option.value"
                @click="indent = option.value"
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <BaseButton variant="outline" size="sm" @click="format">{{ $t('jsonTool.format') }}</BaseButton>
            <BaseButton variant="outline" size="sm" @click="minify">{{ $t('jsonTool.minify') }}</BaseButton>
            <BaseButton
              variant="outline"
              size="sm"
              :disabled="!output"
              @click="copyOutput"
            >
              {{ $t('jsonTool.copy') }}
            </BaseButton>
            <BaseButton variant="ghost" size="sm" :disabled="!input && !output" @click="clearAll">
              {{ $t('jsonTool.clear') }}
            </BaseButton>
          </div>
        </div>

        <p v-if="error" id="json-status" class="data text-sm text-error" role="alert">
          {{
            $t('jsonTool.errorAt', {
              message: error.message,
              line: error.line,
              column: error.column,
            })
          }}
        </p>
        <p v-else-if="output" id="json-status" class="data text-sm text-ink-3" role="status">
          {{
            $t('jsonTool.valid', {
              kb: (stats.inBytes / 1024).toFixed(1),
              depth: stats.depth,
            })
          }}
        </p>

        <!-- Result. `white-space: pre` in a scroll container: the whole point is
             that the user sees the exact bytes that would be copied. -->
        <div>
          <div class="flex items-center justify-between gap-4">
            <span class="label">{{ $t('jsonTool.outputLabel') }}</span>
            <span v-if="output" class="data text-xs text-ink-4">{{ stats.outBytes }} B</span>
          </div>
          <pre
            tabindex="0"
            class="json-out panel mt-2 max-h-[32rem] overflow-auto p-4 font-mono text-sm"
            :aria-label="$t('jsonTool.outputLabel')"
          ><code v-if="output">{{ output }}</code><span v-else class="text-ink-4">{{ $t('jsonTool.emptyOutput') }}</span></pre>
        </div>
      </div>
    </div>
  </PageShell>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageSeo } from '@/composables/usePageSeo'
import { useToast } from '@/composables/useToast'
import { formatJson, type IndentUnit, type JsonError } from '@/lib/jsonTool'
import PageShell from '@/components/layout/PageShell.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const { t } = useI18n()
const toast = useToast()

const input = ref('')
const output = ref('')
const error = ref<JsonError | null>(null)
const stats = ref({ inBytes: 0, outBytes: 0, depth: 0 })
const indent = ref<IndentUnit>(2)

const indentOptions: { value: IndentUnit; label: string }[] = [
  { value: 2, label: '2' },
  { value: 4, label: '4' },
  { value: 'tab', label: 'Tab' },
]

/** Format/minify share one path so the error state can never disagree. */
function run(minify: boolean) {
  const result = formatJson(input.value, { indent: indent.value, minify })
  if (result.ok) {
    output.value = result.output
    stats.value = result.stats
    error.value = null
    return
  }
  // The stale output is dropped: showing the previous valid document next to a
  // new error reads as if the error belonged to that output.
  output.value = ''
  stats.value = { inBytes: 0, outBytes: 0, depth: 0 }
  error.value = result.error
}

const format = () => run(false)
const minify = () => run(true)

// Re-run on indent change so the visible document already matches the choice.
watch(indent, () => {
  if (output.value) run(false)
})

function clearAll() {
  input.value = ''
  output.value = ''
  error.value = null
  stats.value = { inBytes: 0, outBytes: 0, depth: 0 }
}

/** Paste-then-format is the common path; keep it one keystroke. */
function onKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
    event.preventDefault()
    format()
  }
}

async function copyOutput() {
  if (!output.value) return
  try {
    await navigator.clipboard.writeText(output.value)
    toast.success(t('jsonTool.copied'))
    return
  } catch {
    // Clipboard API needs a secure context and a live user gesture; the
    // fallback keeps the tool usable over plain http and in older browsers.
  }
  const el = document.createElement('textarea')
  el.value = output.value
  el.setAttribute('readonly', '')
  el.style.position = 'fixed'
  el.style.opacity = '0'
  document.body.appendChild(el)
  el.select()
  const copied = document.execCommand('copy')
  document.body.removeChild(el)
  if (copied) toast.success(t('jsonTool.copied'))
  else toast.error(t('jsonTool.copyFailed'))
}

usePageSeo({
  title: computed(() => t('head.jsonTool.title')),
  description: computed(() => t('head.jsonTool.dek')),
  ogLabel: 'Tools',
  breadcrumbs: [{ name: t('navigation.explore'), path: '/explore' }],
})
</script>

<style scoped>
/* Segmented indent control: sharp, hairline, one active cell. */
.indent-btn {
  min-width: 3.25rem;
  border: 1px solid var(--color-base-300);
  background: var(--color-base-200);
  padding: 0.5rem 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--color-ink-3);
  cursor: pointer;
}

.indent-btn + .indent-btn {
  border-left: 0;
}

.indent-btn:hover {
  color: var(--color-base-content);
}

.indent-btn.is-active {
  background: var(--color-base-content);
  color: var(--color-base-200);
}

.indent-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.json-out {
  /* pre keeps the document's own line breaks; the block scrolls instead of
     wrapping so indentation stays meaningful. */
  white-space: pre;
  tab-size: 2;
  overflow-wrap: normal;
}
</style>
