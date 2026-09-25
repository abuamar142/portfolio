<template>
  <div class="relative inline-block">
    <button @click="toggle" class="btn btn-ghost btn-sm btn-circle" title="Share">
      <Share2 :size="16" />
    </button>

    <div v-if="open" class="absolute bottom-full right-0 mb-2 bg-base-200 border border-base-300 shadow-lg p-2 min-w-[160px] z-20">
      <button @click="copyLink" class="btn btn-ghost btn-sm w-full justify-start gap-2">
        <Link :size="14" />
        {{ copied ? 'Copied!' : 'Copy Link' }}
      </button>
      <button @click="shareTwitter" class="btn btn-ghost btn-sm w-full justify-start gap-2">
        <ExternalLink :size="14" />
        Twitter
      </button>
      <button @click="shareWhatsApp" class="btn btn-ghost btn-sm w-full justify-start gap-2">
        <ExternalLink :size="14" />
        WhatsApp
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Share2, Link, ExternalLink } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{ id: string; content: string; author: string; path?: string }>(),
  { path: '/quotes' },
)

const open = ref(false)
const copied = ref(false)

function toggle() {
  open.value = !open.value
  copied.value = false
}

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
    setTimeout(() => { copied.value = false }, 2000)
  } catch { /* ignore */ }
}

function shareTwitter() {
  const text = encodeURIComponent(getShareText())
  const url = encodeURIComponent(getShareUrl())
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  open.value = false
}

function shareWhatsApp() {
  const text = encodeURIComponent(`${getShareText()}\n\n${getShareUrl()}`)
  window.open(`https://wa.me/?text=${text}`, '_blank')
  open.value = false
}
</script>
