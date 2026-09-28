<template>
  <PageShell id="qr" :title="$t('qr.title')" :lead="$t('qr.dek')">

      <div class="panel p-6 md:p-8">
        <!-- Base grid-cols-1 clamps the sub-md track to minmax(0,1fr): the
             implicit auto track otherwise sizes to the form's max-content
             (282px) and overflows the222px panel — horizontal page scroll
             at320-360px viewports. -->
        <div class="grid gap-8 grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-10">
          <div class="flex flex-col gap-5">
            <div>
              <label class="label"
                ><span class="label-text">{{ $t('qr.inputLabel') }}</span></label
              >
              <textarea
                v-model="text"
                rows="4"
                class="textarea textarea-bordered w-full resize-none font-mono"
                :placeholder="$t('qr.placeholder')"
              />
            </div>

            <div class="flex flex-wrap gap-6">
              <div>
                <label class="label"
                  ><span class="label-text">{{ $t('qr.fg') }}</span></label
                >
                <input
                  v-model="dark"
                  type="color"
                  class="mt-1 size-9 cursor-pointer border border-base-300 bg-base-200 p-0"
                />
              </div>
              <div>
                <label class="label"
                  ><span class="label-text">{{ $t('qr.bg') }}</span></label
                >
                <input
                  v-model="light"
                  type="color"
                  class="mt-1 size-9 cursor-pointer border border-base-300 bg-base-200 p-0"
                />
              </div>
            </div>

            <p class="data text-ink-3">{{ $t('qr.formats') }}</p>
            <p v-if="failed" class="text-sm text-error">{{ $t('qr.error') }}</p>
          </div>

          <div class="flex flex-col items-center gap-4">
            <div class="border border-base-300 p-3">
              <!-- Size is inline: QRCode.toCanvas writes width/height attrs, and those
                   presentational hints beat layered size-* utilities. -->
              <canvas
                ref="canvas"
                role="img"
                :aria-label="$t('qr.title')"
                class="bg-white"
                style="width: 16rem; height: 16rem"
              />
            </div>
            <div class="flex flex-wrap justify-center gap-3">
              <BaseButton variant="primary" :disabled="!canGenerate" @click="downloadPng">
                {{ $t('qr.downloadPng') }}
              </BaseButton>
              <BaseButton variant="outline" :disabled="!canGenerate" @click="downloadSvg">
                {{ $t('qr.downloadSvg') }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
  </PageShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageSeo } from '@/composables/usePageSeo'
import QRCode from 'qrcode'
import PageShell from '@/components/layout/PageShell.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const { t } = useI18n()

// Deterministic scannable defaults, independent of the active theme:
// the site's ink on white.
const DEFAULT_DARK = '#1c2422'
const DEFAULT_LIGHT = '#ffffff'

const text = ref('https://abuamar.online')
const dark = ref(DEFAULT_DARK)
const light = ref(DEFAULT_LIGHT)
const failed = ref(false)
const canvas = ref<HTMLCanvasElement | null>(null)

const valid = computed(() => text.value.trim().length > 0)
const canGenerate = computed(() => valid.value && !failed.value)

const clearCanvas = (el: HTMLCanvasElement) => {
  el.getContext('2d')?.clearRect(0, 0, el.width, el.height)
}

const render = async () => {
  const el = canvas.value
  if (!el) return
  failed.value = false
  if (!valid.value) {
    clearCanvas(el)
    return
  }
  try {
    await QRCode.toCanvas(el, text.value, {
      width: 512,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: dark.value, light: light.value },
    })
    // qrcode's clearCanvas() rewrites inline width/height to `size px` on every
    // render — restore the 16rem display box (backing store stays 512).
    el.style.width = '16rem'
    el.style.height = '16rem'
  } catch {
    // Data overflow — drop the stale code so the error line is honest.
    failed.value = true
    clearCanvas(el)
  }
}

watch([text, dark, light], render)
onMounted(render)

const saveBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const downloadPng = () => {
  canvas.value?.toBlob((blob) => {
    if (blob) saveBlob(blob, 'qr.png')
  }, 'image/png')
}

const downloadSvg = async () => {
  if (!canGenerate.value) return
  try {
    const svg = await QRCode.toString(text.value, {
      type: 'svg',
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: dark.value, light: light.value },
    })
    saveBlob(new Blob([svg], { type: 'image/svg+xml' }), 'qr.svg')
  } catch {
    failed.value = true
  }
}

usePageSeo({
  title: computed(() => t('head.qr.title')),
  description: computed(() => t('head.qr.dek')),
  ogLabel: 'Tools',
  breadcrumbs: [{ name: t('navigation.explore'), path: '/explore' }],
})
</script>
