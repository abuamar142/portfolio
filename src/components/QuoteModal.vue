<template>
  <BaseModal
    :open="show"
    :close-label="$t('common.close')"
    labelled-by="quote-modal-title"
    box-class="max-w-lg"
    @close="$emit('close')"
  >
    <h2 id="quote-modal-title" class="sr-only">{{ $t('quotes.detailTitle') }}</h2>
    <template v-if="quote">
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
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Quote } from '@/types/quote'
import { formatDateLong } from '@/lib/formatDate'
import BaseModal from '@/components/ui/BaseModal.vue'
import ShareButton from './ShareButton.vue'

const { locale } = useI18n()

defineProps<{ show: boolean; quote: Quote | null }>()
defineEmits<{ close: [] }>()

function formatDate(dateStr: string) {
  return formatDateLong(dateStr, locale.value)
}
</script>
