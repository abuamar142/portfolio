<template>
  <Teleport to="body">
    <dialog :class="['modal', show ? 'modal-open' : '']" @click.self="$emit('close')">
      <div v-if="quote" class="modal-box max-w-lg">
        <button @click="$emit('close')" :aria-label="$t('common.close')" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><X :size="16" /></button>

        <div class="text-center mb-6">
          <p class="text-2xl italic leading-relaxed mb-4 text-base-content font-serif">
            "{{ quote.content }}"
          </p>
          <p class="text-ink-3 text-sm">
            — {{ quote.is_anonymous ? $t('quotes.anonymous') : quote.author_name || $t('quotes.unknown') }}
          </p>
          <p v-if="quote.source" class="text-ink-4 text-xs mt-1">
            {{ quote.source }}
          </p>
        </div>

        <div v-if="quote.tags?.length" class="flex flex-wrap gap-2 justify-center mb-6">
          <span v-for="tag in quote.tags" :key="tag" class="chip chip-accent text-xs">
            #{{ tag }}
          </span>
        </div>

        <div class="flex items-center justify-center gap-3">
          <ShareButton :id="quote.id" :content="quote.content" :author="quote.is_anonymous ? $t('quotes.anonymous') : quote.author_name || $t('quotes.unknown')" />
        </div>

        <p class="text-center text-xs text-ink-4 mt-4">
          {{ formatDate(quote.created_at) }}
        </p>
      </div>
    </dialog>
  </Teleport>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useEscapeToClose } from '@/composables/useEscapeToClose'
import { X } from 'lucide-vue-next'
import type { Quote } from '@/types/quote'
import ShareButton from './ShareButton.vue'

const { locale } = useI18n()

const props = defineProps<{ show: boolean; quote: Quote | null }>()
const emit = defineEmits<{ close: [] }>()
useEscapeToClose(computed(() => props.show), () => emit('close'))

function formatDate(dateStr: string) {
  const dateLocale = locale.value === 'en' ? 'en-US' : 'id-ID'
  return new Date(dateStr).toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
