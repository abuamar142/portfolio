<template>
  <div
    class="quote-card break-inside-avoid mb-4 cursor-pointer group"
    :class="colorClass"
    :style="{ transform: `rotate(${rotation}deg)` }"
    @click="$emit('open', quote)"
  >
    <p class="quote-text text-center text-lg leading-relaxed mb-3" :class="textClass">
      "{{ truncatedContent }}"
    </p>
    <div class="flex items-center justify-between">
      <p class="quote-author text-center text-sm opacity-70">
        — {{ displayAuthor }}
      </p>
      <div v-if="isOwner" class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button @click.stop="$emit('edit', quote)" class="btn btn-ghost btn-xs" :title="$t('quotes.editAria')">
          <Pencil :size="14" />
        </button>
        <button @click.stop="$emit('delete', quote)" class="btn btn-ghost btn-xs text-error" :title="$t('quotes.deleteAria')">
          <Trash2 :size="14" />
        </button>
      </div>
    </div>
    <div v-if="quote.tags?.length" class="flex flex-wrap gap-1 mt-2 justify-center">
      <span v-for="tag in quote.tags" :key="tag" class="chip text-xs">
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Pencil, Trash2 } from 'lucide-vue-next'
import type { Quote } from '@/types/quote'
import { useAuth } from '@/composables/useAuth'

const props = defineProps<{ quote: Quote }>()
defineEmits<{ open: [quote: Quote]; edit: [quote: Quote]; delete: [quote: Quote] }>()

const { t } = useI18n()
const { user } = useAuth()
const isOwner = computed(() => user.value?.id === props.quote.user_id)

const displayAuthor = computed(() => {
  if (props.quote.is_anonymous) return t('quotes.anonymous')
  return props.quote.author_name || t('quotes.unknown')
})

const truncatedContent = computed(() => {
  if (props.quote.content.length <= 200) return props.quote.content
  return props.quote.content.substring(0, 197) + '...'
})

const rotation = computed(() => {
  const hash = props.quote.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return ((hash % 7) - 3)
})

const colorClass = computed(() => {
  const map: Record<string, string> = {
    yellow: 'bg-base-200 border border-base-300',
    pink: 'bg-surface-green border border-hairline-light',
    blue: 'bg-base-200 border border-base-300',
    green: 'bg-surface-green border border-hairline-light',
    white: 'bg-base-200 border border-base-300',
  }
  return map[props.quote.color] || map.white
})

const textClass = computed(() => {
  const map: Record<string, string> = {
    yellow: 'text-base-content',
    pink: 'text-base-content',
    blue: 'text-base-content',
    green: 'text-base-content',
    white: 'text-base-content',
  }
  return map[props.quote.color] || map.white
})
</script>

<style scoped>
.quote-card {
  padding: 1.25rem;
  box-shadow: 2px 3px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.quote-card:hover {
  box-shadow: 4px 6px 16px rgba(0, 0, 0, 0.25);
  z-index: 10;
}
.quote-text {
  font-style: italic;
}
</style>
