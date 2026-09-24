<template>
  <section id="remove-bg" class="page-top">
    <div class="wrap pb-20 md:pb-28">
      <SectionHeader level="h1" :title="$t('removeBg.title')" :lead="$t('removeBg.dek')" />

      <div class="panel p-6 md:p-8">
        <!-- Idle: dropzone -->
        <div
          v-if="phase === 'idle'"
          class="flex flex-col items-center gap-3 border border-base-300 px-6 py-14 text-center"
          @dragover.prevent
          @drop.prevent="onDrop"
          @click="pickFile"
        >
          <p class="label">{{ $t('removeBg.dropHint') }}</p>
          <p class="data text-ink-3">{{ $t('removeBg.orPaste') }}</p>
          <BaseButton variant="primary" class="mt-2" @click.stop="pickFile">
            {{ $t('removeBg.choose') }}
          </BaseButton>
          <p class="data mt-2 text-ink-3">{{ $t('removeBg.formats') }}</p>
          <p v-if="!webgpu" class="label text-voltage-ink">{{ $t('removeBg.wasmHint') }}</p>
          <p class="data mt-2 max-w-[46ch] text-ink-4">{{ $t('removeBg.firstRun') }}</p>
        </div>

        <!-- Working: source preview + progress -->
        <template v-else-if="phase === 'working'">
          <img
            v-if="sourceUrl"
            :src="sourceUrl"
            :alt="$t('removeBg.compareAsli')"
            class="mb-6 max-h-80 w-full object-contain"
          />
          <div class="flex items-baseline justify-between gap-4">
            <span class="label">{{ stageLabel }}</span>
            <span class="data">{{ progressPct }}%</span>
          </div>
          <div
            class="mt-2 h-1.5 w-full bg-base-300"
            role="progressbar"
            :aria-valuenow="progressPct"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-label="stageLabel"
          >
            <div
              class="h-full bg-primary transition-[width] duration-200"
              :style="{ width: Math.max(progressPct, 1) + '%' }"
            ></div>
          </div>
        </template>

        <!-- Done: compare + actions -->
        <template v-else-if="phase === 'done'">
          <figure class="relative overflow-hidden border border-base-300 select-none">
            <img :src="resultUrl" :alt="$t('removeBg.compareHasil')" class="block w-full" />
            <img
              v-if="sourceOk && sourceUrl"
              :src="sourceUrl"
              :alt="$t('removeBg.compareAsli')"
              class="absolute inset-0 h-full w-full"
              :style="{ clipPath: `inset(0 ${100 - split}% 0 0)` }"
              @error="sourceOk = false"
            />
            <input
              v-if="sourceOk && sourceUrl"
              v-model.number="split"
              type="range"
              min="0"
              max="100"
              class="absolute right-4 bottom-3 left-4"
              :aria-label="$t('removeBg.compareSlider')"
            />
            <figcaption
              class="pointer-events-none absolute top-2 right-3 left-3 flex justify-between"
            >
              <span class="label">{{ $t('removeBg.compareAsli') }}</span>
              <span class="label">{{ $t('removeBg.compareHasil') }}</span>
            </figcaption>
          </figure>

          <p v-if="resultMeta" class="data mt-4 text-ink-3">
            {{ resultMeta.provider }} · {{ resultMeta.quality }} · {{ resultMeta.durationMs }}ms
          </p>

          <div class="mt-6 flex flex-wrap gap-3">
            <BaseButton variant="primary" @click="download">{{ $t('removeBg.download') }}</BaseButton>
            <BaseButton variant="outline" @click="reset">{{ $t('removeBg.reset') }}</BaseButton>
          </div>
        </template>

        <!-- Failed -->
        <template v-else>
          <img
            v-if="sourceUrl"
            :src="sourceUrl"
            :alt="$t('removeBg.compareAsli')"
            class="mb-6 max-h-80 w-full object-contain opacity-60"
          />
          <div role="alert">
            <p class="text-base-content">{{ error }}</p>
            <BaseButton class="mt-6" variant="outline" size="sm" @click="reset">
              {{ $t('removeBg.reset') }}
            </BaseButton>
          </div>
        </template>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/png,image/jpeg,image/webp,image/heic,image/heif,.heic,.heif"
        class="sr-only"
        @change="onFileInput"
      />

      <p class="label mt-6 text-ink-3">
        {{ $t('removeBg.credit') }}
        <a
          href="https://github.com/opencoredev/bg0"
          target="_blank"
          rel="noopener noreferrer"
          class="link-accent underline decoration-1 underline-offset-4"
          >BG0</a
        >
        (Apache-2.0) · BiRefNet —
        <a
          href="https://github.com/opencoredev/bg0/blob/main/THIRD_PARTY_NOTICES.md"
          target="_blank"
          rel="noopener noreferrer"
          class="link-accent underline decoration-1 underline-offset-4"
          >{{ $t('removeBg.modelLicenses') }}</a
        >
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

type Stage = 'preparing' | 'downloading' | 'processing' | 'finishing'
type Phase = 'idle' | 'working' | 'done' | 'failed'

const MAX_BYTES = 40 * 1024 * 1024
const IMAGE_EXT = /\.(png|jpe?g|webp|heic|heif)$/i

const { t } = useI18n()

const fileInput = ref<HTMLInputElement | null>(null)
const working = ref(false)
const stage = ref<Stage>('preparing')
const progress = ref(0)
const error = ref('')
const sourceUrl = ref('')
const sourceOk = ref(true)
const sourceName = ref('')
const resultUrl = ref('')
const resultMeta = ref<{ provider: string; quality: string; durationMs: number } | null>(null)
const webgpu = ref(true)
const split = ref(50)

let bg0: typeof import('@bg0/browser') | null = null
let abort: AbortController | null = null

const phase = computed<Phase>(() => {
  if (working.value) return 'working'
  if (error.value && !resultUrl.value) return 'failed'
  if (resultUrl.value) return 'done'
  return 'idle'
})

const stageLabel = computed(() => t(`removeBg.stage.${stage.value}`))
const progressPct = computed(() => Math.round(progress.value * 100))

useHead({
  title: computed(() => t('removeBg.title')),
  meta: [{ name: 'description', content: computed(() => t('removeBg.dek')) }],
})

function pickFile() {
  fileInput.value?.click()
}

function onFileInput(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) void handleFile(f)
  // Allow re-picking the same file later
  ;(e.target as HTMLInputElement).value = ''
}

function onDrop(e: DragEvent) {
  const f = e.dataTransfer?.files?.[0]
  if (f) void handleFile(f)
}

function onPaste(e: ClipboardEvent) {
  const f = e.clipboardData?.files?.[0]
  if (f && phase.value === 'idle') void handleFile(f)
}

function isImage(f: File) {
  return f.type.startsWith('image/') || IMAGE_EXT.test(f.name)
}

async function handleFile(f: File) {
  error.value = ''
  if (f.size > MAX_BYTES) {
    error.value = t('removeBg.errorTooLarge')
    return
  }
  if (!isImage(f)) {
    error.value = t('removeBg.errorNotImage')
    return
  }

  revokeUrls()
  if (working.value) abort?.abort()
  sourceUrl.value = URL.createObjectURL(f)
  sourceOk.value = true
  sourceName.value = f.name.replace(IMAGE_EXT, '')
  split.value = 50

  working.value = true
  progress.value = 0
  stage.value = 'preparing'
  const controller = new AbortController()
  abort = controller

  try {
    bg0 ??= await import('@bg0/browser')
    const result = await bg0.removeBackground(f, {
      quality: 'quality',
      signal: abort.signal,
      onProgress: ({ stage: s, progress: p }) => {
        stage.value = s
        // Library reports 0..1 or 0..100 depending on backend
        progress.value = p <= 1 ? p : p / 100
      },
    })
    resultUrl.value = URL.createObjectURL(result.blob)
    resultMeta.value = {
      provider: result.provider,
      quality: result.quality,
      durationMs: result.durationMs,
    }
  } catch (e: unknown) {
    if (!controller.signal.aborted) {
      error.value = t('removeBg.errorFailed')
      console.error('[remove-bg]', e)
    }
  } finally {
    if (abort === controller) {
      working.value = false
      abort = null
    }
  }
}

function download() {
  if (!resultUrl.value) return
  const a = document.createElement('a')
  a.href = resultUrl.value
  a.download = `${sourceName.value || 'image'}-remove-bg.png`
  a.click()
}

function revokeUrls() {
  if (sourceUrl.value) URL.revokeObjectURL(sourceUrl.value)
  if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
  sourceUrl.value = ''
  resultUrl.value = ''
  resultMeta.value = null
}

function reset() {
  abort?.abort()
  revokeUrls()
  error.value = ''
  working.value = false
}

onMounted(async () => {
  window.addEventListener('paste', onPaste)
  try {
    bg0 = await import('@bg0/browser')
    webgpu.value = bg0.getBrowserCapabilities().webgpu
  } catch (e: unknown) {
    // Capability hint is cosmetic; removal will surface real failures.
    console.error('[remove-bg] capability check failed', e)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('paste', onPaste)
  abort?.abort()
  revokeUrls()
})
</script>
