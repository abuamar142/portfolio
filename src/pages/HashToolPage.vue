<template>
  <PageShell id="hash" :title="$t('hashTool.title')" :lead="$t('hashTool.dek')">
    <div class="panel p-6 md:p-8">
      <div class="flex flex-col gap-8">
        <div class="flex flex-col gap-2">
          <span id="hash-algo" class="label">{{ $t('hashTool.algorithm') }}</span>
          <div role="group" aria-labelledby="hash-algo" class="flex flex-wrap">
            <button
              v-for="algo in HASH_ALGORITHMS"
              :key="algo"
              type="button"
              class="seg"
              :class="{ 'is-active': algorithm === algo }"
              :aria-pressed="algorithm === algo"
              @click="selectAlgorithm(algo)"
            >
              {{ algo }}
            </button>
          </div>
          <p class="data mt-1 text-xs text-ink-4">{{ $t('hashTool.sha1Warn') }}</p>
        </div>

        <div>
          <label class="label" for="hash-input">
            <span class="label-text">{{ $t('hashTool.inputLabel') }}</span>
          </label>
          <textarea
            id="hash-input"
            v-model="input"
            rows="8"
            spellcheck="false"
            autocapitalize="off"
            autocomplete="off"
            class="textarea textarea-bordered mt-2 w-full resize-y font-mono text-sm leading-relaxed"
            :placeholder="$t('hashTool.placeholder')"
            @input="run"
          />
        </div>

        <div class="flex flex-wrap items-center gap-3 border-t border-base-300 pt-6">
          <span class="label">{{ $t('hashTool.fileLabel') }}</span>
          <BaseButton variant="outline" size="sm" @click="pickFile">{{ $t('hashTool.chooseFile') }}</BaseButton>
          <span v-if="fileName" class="data text-sm text-ink-3">{{ fileName }}</span>
          <button
            v-if="fileName"
            type="button"
            class="link text-sm text-ink-3 hover:text-base-content"
            @click="clearFile"
          >
            {{ $t('hashTool.clearFile') }}
          </button>
          <input ref="fileEl" type="file" class="sr-only" @change="onFile" />
        </div>

        <p v-if="!supported" class="data text-error" role="alert">{{ $t('hashTool.insecure') }}</p>
        <p v-else-if="error" class="data text-error" role="alert">{{ error }}</p>

        <!-- Results: one row per algorithm, so a checksum can be compared
             without re-running the tool. -->
        <div v-if="results.length" class="flex flex-col gap-3">
          <div class="flex items-baseline justify-between gap-4">
            <span class="label">{{ $t('hashTool.outputLabel') }}</span>
            <span class="data text-xs text-ink-4">
              {{ fileBytes !== null
                ? $t('hashTool.fileSizes', { bytes: fileBytes })
                : $t('hashTool.textSizes', { bytes: bytes, chars: input.length }) }}
            </span>
          </div>
          <ul class="flex flex-col divide-y divide-base-300 border-y border-base-300">
            <li
              v-for="result in results"
              :key="result.algorithm"
              class="grid gap-2 py-3 md:grid-cols-[90px_minmax(0,1fr)_auto] md:items-center md:gap-4"
            >
              <span class="label">{{ result.algorithm }}</span>
              <code class="min-w-0 break-all font-mono text-xs leading-relaxed text-base-content">{{
                result.hex
              }}</code>
              <button
                type="button"
                class="btn btn-ghost btn-xs justify-self-start md:justify-self-end"
                :aria-label="$t('hashTool.copyAlgo', { algorithm: result.algorithm })"
                @click="copy(result.hex)"
              >
                {{ $t('hashTool.copy') }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </PageShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageSeo } from '@/composables/usePageSeo'
import { useToast } from '@/composables/useToast'
import { HASH_ALGORITHMS, hashFile, hashText, hasWebCrypto, type HashAlgorithm } from '@/lib/hash'
import PageShell from '@/components/layout/PageShell.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { copyText } from '@/lib/clipboard'

const { t } = useI18n()
const toast = useToast()

const input = ref('')
const results = ref<{ algorithm: HashAlgorithm; hex: string }[]>([])
const algorithm = ref<HashAlgorithm>('SHA-256')
const error = ref('')
const fileName = ref('')
const fileBytes = ref<number | null>(null)
const file = ref<File | null>(null)
const fileEl = ref<HTMLInputElement | null>(null)
const supported = ref(true)

const bytes = computed(() => new TextEncoder().encode(input.value).length)

onMounted(() => {
  supported.value = hasWebCrypto()
})

/** Recompute every algorithm at once when hashing text; one when hashing a file. */
async function run() {
  error.value = ''
  if (file.value) return
  fileBytes.value = null
  if (!input.value) {
    results.value = []
    return
  }
  try {
    results.value = await Promise.all(
      HASH_ALGORITHMS.map(async (algo) => ({ algorithm: algo, hex: (await hashText(input.value, algo)).hex })),
    )
  } catch {
    error.value = t('hashTool.failed')
    results.value = []
  }
}

async function selectAlgorithm(algo: HashAlgorithm) {
  algorithm.value = algo
  if (!file.value) return
  // A file hash is per-algorithm: hashing four times on every click would stall
  // the page on a large file.
  try {
    const result = await hashFile(file.value, algo)
    results.value = [{ algorithm: algo, hex: result.hex }]
    fileBytes.value = result.bytes
  } catch {
    error.value = t('hashTool.failed')
  }
}

function pickFile() {
  fileEl.value?.click()
}

async function onFile(event: Event) {
  const picked = (event.target as HTMLInputElement).files?.[0]
  if (!picked) return
  file.value = picked
  fileName.value = picked.name
  error.value = ''
  await selectAlgorithm(algorithm.value)
}

function clearFile() {
  file.value = null
  fileName.value = ''
  fileBytes.value = null
  results.value = []
  if (fileEl.value) fileEl.value.value = ''
  void run()
}

async function copy(text: string) {
  if (await copyText(text)) toast.success(t('hashTool.copied'))
  else toast.error(t('hashTool.copyFailed'))
}

usePageSeo({
  title: computed(() => t('head.hashTool.title')),
  description: computed(() => t('head.hashTool.dek')),
  ogLabel: 'Tools',
  breadcrumbs: [{ name: t('navigation.explore'), path: '/explore' }],
})
</script>

<style scoped>
.seg {
  min-width: 5.5rem;
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
