<template>
  <div ref="rootEl" class="relative inline-block">
    <button
      type="button"
      class="btn btn-ghost btn-sm btn-circle"
      :aria-label="$t('common.share')"
      :title="$t('common.share')"
      aria-haspopup="menu"
      :aria-expanded="open"
      @click="toggle"
    >
      <Share2 :size="16" aria-hidden="true" />
    </button>

    <div
      v-if="open"
      ref="menuEl"
      role="menu"
      :aria-label="$t('common.shareMenu')"
      class="absolute bottom-full right-0 mb-2 z-20 min-w-[160px] border border-base-300 bg-base-200 p-2 shadow-lg"
    >
      <button type="button" role="menuitem" @click="copyLink" class="btn btn-ghost btn-sm w-full justify-start gap-2">
        <Link :size="14" aria-hidden="true" />
        {{ copied ? $t('common.copied') : $t('common.copyLink') }}
      </button>
      <button type="button" role="menuitem" @click="shareTwitter" class="btn btn-ghost btn-sm w-full justify-start gap-2">
        <ExternalLink :size="14" aria-hidden="true" />
        Twitter
      </button>
      <button type="button" role="menuitem" @click="shareWhatsApp" class="btn btn-ghost btn-sm w-full justify-start gap-2">
        <ExternalLink :size="14" aria-hidden="true" />
        WhatsApp
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Share2, Link, ExternalLink } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{ id: string; content: string; author: string; path?: string }>(),
  { path: '/quotes' },
)

const rootEl = ref<HTMLElement | null>(null)
const menuEl = ref<HTMLElement | null>(null)
const open = ref(false)
const copied = ref(false)

let copiedTimer: ReturnType<typeof setTimeout> | undefined

function toggle() {
  open.value = !open.value
  copied.value = false
  if (open.value) void nextTick(() => menuEl.value?.querySelector('button')?.focus())
}

function close(restoreFocus = false) {
  open.value = false
  if (restoreFocus) rootEl.value?.querySelector('button')?.focus()
}

// Close on outside click and on Escape, so the menu can be dismissed without
// activating an item. The Escape listener runs in the CAPTURE phase at
// document: BaseModal also listens for Escape on document (added first, when
// the dialog opened), so only a capture-phase handler that stops propagation
// can keep the menu dismissible without closing the dialog behind it.
function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) {
    event.stopPropagation()
    close(true)
  }
}

function onDocumentPointerDown(event: PointerEvent) {
  if (!open.value) return
  if (rootEl.value && !rootEl.value.contains(event.target as Node)) close()
}

onMounted(() => {
  document.addEventListener('keydown', onDocumentKeydown, true)
  document.addEventListener('pointerdown', onDocumentPointerDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onDocumentKeydown)
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  if (copiedTimer) clearTimeout(copiedTimer)
})

function getShareUrl() {
  return `${window.location.origin}${props.path}/${props.id}`
}

function getShareText() {
  const text = `"${props.content}" — ${props.author}`
  return text.length > 200 ? text.substring(0, 197) + '…' : text
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(getShareUrl())
    copied.value = true
    if (copiedTimer) clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => { copied.value = false }, 2000)
  } catch { /* clipboard unavailable or denied — leave the label unchanged */ }
}

function shareTwitter() {
  const text = encodeURIComponent(getShareText())
  const url = encodeURIComponent(getShareUrl())
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer')
  close()
}

function shareWhatsApp() {
  const text = encodeURIComponent(`${getShareText()}\n\n${getShareUrl()}`)
  window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer')
  close()
}
</script>
