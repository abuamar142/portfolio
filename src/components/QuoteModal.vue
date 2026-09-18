<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show && quote" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="$emit('close')">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div class="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg p-8 z-10">
          <button @click="$emit('close')" class="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>

          <div class="text-center mb-6">
            <p class="text-2xl font-serif italic text-zinc-900 dark:text-white leading-relaxed mb-4">
              "{{ quote.content }}"
            </p>
            <p class="text-zinc-500 dark:text-zinc-400 text-sm">
              — {{ quote.is_anonymous ? 'Anonymous' : quote.author_name || 'Unknown' }}
            </p>
            <p v-if="quote.source" class="text-zinc-400 dark:text-zinc-500 text-xs mt-1">
              {{ quote.source }}
            </p>
          </div>

          <div v-if="quote.tags?.length" class="flex flex-wrap gap-2 justify-center mb-6">
            <span v-for="tag in quote.tags" :key="tag" class="text-xs px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              #{{ tag }}
            </span>
          </div>

          <div class="flex items-center justify-center gap-3">
            <ShareButton :id="quote.id" :content="quote.content" :author="quote.is_anonymous ? 'Anonymous' : quote.author_name || 'Unknown'" />
          </div>

          <p class="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-4">
            {{ formatDate(quote.created_at) }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Quote } from '@/types/quote'
import ShareButton from './ShareButton.vue'

defineProps<{ show: boolean; quote: Quote | null }>()
defineEmits<{ close: [] }>()

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
