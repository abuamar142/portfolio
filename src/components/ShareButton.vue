<template>
  <div class="relative inline-block">
    <button @click="toggle" class="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300" title="Share">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
    </button>

    <Transition name="popup">
      <div v-if="open" class="absolute bottom-full right-0 mb-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 p-2 min-w-[160px] z-20">
        <button @click="copyLink" class="w-full text-left px-3 py-2 text-sm rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          {{ copied ? 'Copied!' : 'Copy Link' }}
        </button>
        <button @click="shareTwitter" class="w-full text-left px-3 py-2 text-sm rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          Twitter
        </button>
        <button @click="shareWhatsApp" class="w-full text-left px-3 py-2 text-sm rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ id: string; content: string; author: string }>()

const open = ref(false)
const copied = ref(false)

function toggle() {
  open.value = !open.value
  copied.value = false
}

function getShareUrl() {
  return `${window.location.origin}/quotes/${props.id}`
}

function getShareText() {
  const text = `"${props.content}" — ${props.author}`
  return text.length > 200 ? text.substring(0, 197) + '...' : text
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

<style scoped>
.popup-enter-active, .popup-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.popup-enter-from, .popup-leave-to { opacity: 0; transform: translateY(4px); }
</style>
