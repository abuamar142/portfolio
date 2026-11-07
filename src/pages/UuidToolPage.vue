<template>
  <PageShell id="uuid" :title="$t('uuidTool.title')" :lead="$t('uuidTool.dek')">
    <div class="panel p-6 md:p-8">
      <div class="flex flex-col gap-8">
        <div class="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <label class="flex flex-col gap-2">
            <span class="label">{{ $t('uuidTool.count') }}</span>
            <input
              v-model.number="count"
              type="number"
              min="1"
              max="1000"
              class="input input-bordered w-32 font-mono"
              @change="regenerate"
            />
          </label>

          <div class="flex flex-wrap gap-3">
            <BaseButton variant="primary" size="sm" @click="regenerate">
              {{ $t('uuidTool.generate') }}
            </BaseButton>
            <BaseButton variant="outline" size="sm" :disabled="!uuids.length" @click="copyAll">
              {{ $t('uuidTool.copyAll') }}
            </BaseButton>
          </div>
        </div>

        <p class="data text-xs text-ink-4">{{ $t('uuidTool.versionNote') }}</p>

        <ul v-if="uuids.length" class="flex flex-col divide-y divide-base-300 border-y border-base-300">
          <li
            v-for="(uuid, index) in uuids"
            :key="uuid"
            class="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 py-2"
          >
            <span class="data text-xs text-ink-4">{{ String(index + 1).padStart(2, '0') }}</span>
            <code class="min-w-0 break-all font-mono text-sm text-base-content">{{ uuid }}</code>
            <button
              type="button"
              class="btn btn-ghost btn-xs"
              :aria-label="$t('uuidTool.copyOne')"
              @click="copy(uuid)"
            >
              {{ $t('uuidTool.copy') }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </PageShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageSeo } from '@/composables/usePageSeo'
import { useToast } from '@/composables/useToast'
import { uuidBatch } from '@/lib/uuid'
import PageShell from '@/components/layout/PageShell.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { copyText } from '@/lib/clipboard'

const { t } = useI18n()
const toast = useToast()

const count = ref(10)
const uuids = ref<string[]>([])

function regenerate() {
  uuids.value = uuidBatch(count.value)
}

async function copyAll() {
  if (await copyText(uuids.value.join('\n')))
    toast.success(t('uuidTool.copiedAll', { count: uuids.value.length }))
  else toast.error(t('uuidTool.copyFailed'))
}

async function copy(uuid: string) {
  if (await copyText(uuid)) toast.success(t('uuidTool.copied'))
  else toast.error(t('uuidTool.copyFailed'))
}

// Generated on mount so the page is useful the moment it opens, but not during
// the SSG pass — the prerendered HTML must stay deterministic.
onMounted(regenerate)

usePageSeo({
  title: computed(() => t('head.uuidTool.title')),
  description: computed(() => t('head.uuidTool.dek')),
  ogLabel: 'Tools',
  breadcrumbs: [{ name: t('navigation.explore'), path: '/explore' }],
})
</script>
