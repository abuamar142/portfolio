<template>
  <div
    class="quote-card break-inside-avoid mb-4 cursor-pointer group"
    :class="colorClass"
    :style="{ transform: `rotate(${rotation}deg)` }"
    @click="$emit('open', quote)"
  >
    <p class="quote-text text-center font-serif text-lg leading-relaxed mb-3" :class="textClass">
      "{{ truncatedContent }}"
    </p>
    <div class="flex items-center justify-between">
      <p class="quote-author text-center text-sm opacity-70">
        — {{ displayAuthor }}
      </p>
      <div v-if="isOwner" class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button @click.stop="$emit('edit', quote)" class="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10" title="Edit">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
        </button>
        <button @click.stop="$emit('delete', quote)" class="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500" title="Delete">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>
    </div>
    <div v-if="quote.tags?.length" class="flex flex-wrap gap-1 mt-2 justify-center">
      <span v-for="tag in quote.tags" :key="tag" class="text-xs px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10 opacity-60">
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Quote } from '@/types/quote'
import { useAuth } from '@/composables/useAuth'

const props = defineProps<{ quote: Quote }>()
defineEmits<{ open: [quote: Quote]; edit: [quote: Quote]; delete: [quote: Quote] }>()

const { user } = useAuth()
const isOwner = computed(() => user.value?.id === props.quote.user_id)

const displayAuthor = computed(() => {
  if (props.quote.is_anonymous) return 'Anonymous'
  return props.quote.author_name || 'Unknown'
})

const truncatedContent = computed(() => {
  if (props.quote.content.length <= 200) return props.quote.content
  return props.quote.content.substring(0, 197) + '...'
})

// Deterministic rotation based on quote id
const rotation = computed(() => {
  const hash = props.quote.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return ((hash % 7) - 3) // -3 to +3
})

const colorClass = computed(() => {
  const map: Record<string, string> = {
    yellow: 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800',
    pink: 'bg-pink-100 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800',
    blue: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
    green: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800',
    white: 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700',
  }
  return map[props.quote.color] || map.white
})

const textClass = computed(() => {
  const map: Record<string, string> = {
    yellow: 'text-amber-900 dark:text-amber-100',
    pink: 'text-pink-900 dark:text-pink-100',
    blue: 'text-blue-900 dark:text-blue-100',
    green: 'text-emerald-900 dark:text-emerald-100',
    white: 'text-zinc-900 dark:text-zinc-100',
  }
  return map[props.quote.color] || map.white
})
</script>

<style scoped>
.quote-card {
  padding: 1.25rem;
  border: 1px solid;
  border-radius: 0.5rem;
  box-shadow: 2px 3px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.quote-card:hover {
  box-shadow: 4px 6px 16px rgba(0, 0, 0, 0.12);
  z-index: 10;
}
.quote-text {
  font-style: italic;
}
</style>
