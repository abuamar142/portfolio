<template>
  <section id="quote-detail" class="page-top">
    <div class="wrap pb-20 md:pb-28">
      <!-- Back link -->
      <router-link
        to="/quotes"
        class="inline-flex min-h-11 items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-3 transition-colors hover:text-base-content"
      >
        <ArrowLeft class="size-4" aria-hidden="true" />
        {{ $t('quotes.backToList') }}
      </router-link>

      <!-- Loading -->
      <div v-if="loading" class="mt-12 max-w-xl animate-pulse" role="status">
        <div class="h-4 w-1/3 bg-hairline-light rounded"></div>
        <div class="mt-6 h-12 w-3/4 bg-hairline-light rounded"></div>
        <div class="mt-4 h-12 w-1/2 bg-hairline-light rounded"></div>
        <div class="mt-8 h-4 w-1/4 bg-hairline-light rounded"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="panel mt-12 max-w-xl p-8" role="alert">
        <p class="text-base-content text-lg">{{ $t('quotes.notFound') }}</p>
        <p class="mt-2 font-mono text-[11px] text-ink-3">{{ error }}</p>
        <BaseButton class="mt-6" variant="outline" size="sm" to="/quotes">
          {{ $t('quotes.backToList') }}
        </BaseButton>
      </div>

      <!-- Quote -->
      <article v-else-if="quote" class="mt-12 max-w-xl">
        <blockquote
          class="relative border-l-2 border-primary/40 pl-6 py-2"
        >
          <p class="text-2xl md:text-3xl italic leading-relaxed text-base-content font-serif">
            &ldquo;{{ quote.content }}&rdquo;
          </p>
        </blockquote>

        <p class="mt-6 font-mono text-sm text-ink-3">
          — {{ quote.is_anonymous ? 'Anonymous' : quote.author_name || 'Unknown' }}
        </p>

        <p v-if="quote.source" class="mt-2 font-mono text-xs text-ink-4">
          {{ quote.source }}
        </p>

        <!-- Tags -->
        <div v-if="quote.tags?.length" class="flex flex-wrap gap-2 mt-6">
          <span v-for="tag in quote.tags" :key="tag" class="chip text-xs">
            #{{ tag }}
          </span>
        </div>

        <!-- Meta + share -->
        <div class="mt-8 flex items-center justify-between border-t border-base-300 pt-6">
          <time :datetime="quote.created_at" class="font-mono text-[11px] uppercase tracking-wider text-ink-4">
            {{ formatDate(quote.created_at) }}
          </time>
          <ShareButton
            :id="quote.id"
            :content="quote.content"
            :author="quote.is_anonymous ? 'Anonymous' : quote.author_name || 'Unknown'"
          />
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { fetchQuoteById } from '@/services/quote'
import type { Quote } from '@/types/quote'
import ShareButton from '@/components/ShareButton.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const quote = ref<Quote | null>(null)
const loading = ref(true)
const error = ref('')

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(async () => {
  const id = route.params.id as string
  if (!id) {
    error.value = 'No quote ID provided'
    loading.value = false
    return
  }

  try {
    quote.value = await fetchQuoteById(id)
  } catch (e: unknown) {
    const err = e as { response?: { status?: number }; message?: string }
    if (err.response?.status === 404) {
      error.value = 'Quote not found'
    } else {
      error.value = err.message || 'Failed to load quote'
    }
  } finally {
    loading.value = false
  }
})
</script>
