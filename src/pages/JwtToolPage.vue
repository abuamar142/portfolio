<template>
  <PageShell id="jwt" :title="$t('jwtTool.title')" :lead="$t('jwtTool.dek')">
    <div class="panel p-6 md:p-8">
      <div class="flex flex-col gap-8">
        <div>
          <label class="label" for="jwt-input">
            <span class="label-text">{{ $t('jwtTool.inputLabel') }}</span>
          </label>
          <textarea
            id="jwt-input"
            v-model="token"
            rows="5"
            spellcheck="false"
            autocapitalize="off"
            autocomplete="off"
            class="textarea textarea-bordered mt-2 w-full resize-y break-all font-mono text-sm leading-relaxed"
            :placeholder="$t('jwtTool.placeholder')"
            @input="decode"
          />
        </div>

        <!-- The limit is the point of the page, so it sits above the output. -->
        <p class="data text-sm text-warning" role="note">{{ $t('jwtTool.notVerification') }}</p>

        <p v-if="error" class="data text-sm text-error" role="alert">{{ error }}</p>

        <template v-else-if="decoded">
          <div class="flex flex-wrap items-center gap-3">
            <span class="label">{{ $t('jwtTool.status') }}</span>
            <span
              class="badge badge-lg rounded-none font-mono text-xs"
              :class="statusClass"
            >{{ $t(statusLabel) }}</span>
            <span class="data text-xs text-ink-4">{{ decoded.expiry.detail }}</span>
          </div>

          <div v-if="decoded.unsigned" class="data text-sm text-warning" role="alert">
            {{ $t('jwtTool.unsigned') }}
          </div>
          <div v-else-if="algNone" class="data text-sm text-error" role="alert">
            {{ $t('jwtTool.algNone') }}
          </div>

          <div class="grid gap-8 lg:grid-cols-2">
            <div>
              <div class="flex items-center justify-between gap-4">
                <span class="label">{{ $t('jwtTool.header') }}</span>
                <button type="button" class="btn btn-ghost btn-xs" @click="copyJson(decoded.header)">
                  {{ $t('jwtTool.copy') }}
                </button>
              </div>
              <pre class="json panel mt-2 max-h-72 overflow-auto p-4 font-mono text-xs"><code>{{ prettyJson(decoded.header) }}</code></pre>
            </div>

            <div>
              <div class="flex items-center justify-between gap-4">
                <span class="label">{{ $t('jwtTool.payload') }}</span>
                <button type="button" class="btn btn-ghost btn-xs" @click="copyJson(decoded.claims)">
                  {{ $t('jwtTool.copy') }}
                </button>
              </div>
              <pre class="json panel mt-2 max-h-72 overflow-auto p-4 font-mono text-xs"><code>{{ prettyJson(decoded.claims) }}</code></pre>
            </div>
          </div>

          <!-- Registered claims pulled out, because reading exp/iat as epoch
               integers is exactly the work this tool exists to save. -->
          <div v-if="claimRows.length">
            <span class="label">{{ $t('jwtTool.claims') }}</span>
            <ul class="mt-2 flex flex-col divide-y divide-base-300 border-y border-base-300">
              <li
                v-for="row in claimRows"
                :key="row.name"
                class="grid gap-1 py-2 md:grid-cols-[80px_minmax(0,1fr)] md:gap-4"
              >
                <code class="font-mono text-xs text-ink-4">{{ row.name }}</code>
                <span class="min-w-0 break-all font-mono text-xs text-base-content">{{ row.value }}</span>
              </li>
            </ul>
          </div>

          <div>
            <span class="label">{{ $t('jwtTool.signature') }}</span>
            <p class="data mt-1 break-all text-xs text-ink-4">
              {{ decoded.segments.signature || $t('jwtTool.noSignature') }}
            </p>
          </div>
        </template>
      </div>
    </div>
  </PageShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageSeo } from '@/composables/usePageSeo'
import { useToast } from '@/composables/useToast'
import { decodeJwt, prettyJson, type DecodedJwt } from '@/lib/jwt'
import PageShell from '@/components/layout/PageShell.vue'

const { t } = useI18n()
const toast = useToast()

const token = ref('')
const error = ref('')
const decoded = ref<DecodedJwt | null>(null)

const algNone = computed(() => decoded.value?.header.alg === 'none')

const statusLabel = computed(() => {
  switch (decoded.value?.expiry.state) {
    case 'expired':
      return 'jwtTool.stateExpired'
    case 'not-yet-valid':
      return 'jwtTool.stateNotYet'
    case 'valid':
      return 'jwtTool.stateValid'
    default:
      return 'jwtTool.stateNoExp'
  }
})

const statusClass = computed(() => {
  switch (decoded.value?.expiry.state) {
    case 'expired':
      return 'badge-error'
    case 'not-yet-valid':
      return 'badge-warning'
    case 'valid':
      return 'badge-success'
    default:
      return 'badge-ghost'
  }
})

/** Registered claims, with the numeric dates rendered as readable ISO. */
const claimRows = computed(() => {
  const claims = decoded.value?.claims
  if (!claims) return []
  const rows: { name: string; value: string }[] = []
  for (const [name, value] of Object.entries(claims)) {
    if (value === undefined) continue
    if ((name === 'exp' || name === 'nbf' || name === 'iat') && typeof value === 'number') {
      rows.push({ name, value: `${value} → ${new Date(value * 1000).toISOString()}` })
      continue
    }
    rows.push({ name, value: typeof value === 'string' ? value : JSON.stringify(value) })
  }
  return rows
})

function decode() {
  error.value = ''
  if (!token.value.trim()) {
    decoded.value = null
    return
  }
  const result = decodeJwt(token.value)
  if (result.ok) decoded.value = result
  else {
    decoded.value = null
    error.value = result.segment
      ? t('jwtTool.errorIn', { segment: result.segment, message: result.error })
      : result.error
  }
}

async function copyJson(value: unknown) {
  try {
    await navigator.clipboard.writeText(prettyJson(value))
    toast.success(t('jwtTool.copied'))
  } catch {
    toast.error(t('jwtTool.copyFailed'))
  }
}

usePageSeo({
  title: computed(() => t('head.jwtTool.title')),
  description: computed(() => t('head.jwtTool.dek')),
  ogLabel: 'Tools',
  breadcrumbs: [{ name: t('navigation.explore'), path: '/explore' }],
})
</script>

<style scoped>
.json {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  tab-size: 2;
}
</style>
