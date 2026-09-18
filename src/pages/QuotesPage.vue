<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold text-zinc-900 dark:text-white mb-3">💬 Quotes</h1>
        <p class="text-zinc-500 dark:text-zinc-400">Words worth sharing</p>
      </div>

      <!-- Search + Actions -->
      <div class="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <div class="relative flex-1 w-full">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input v-model="search" @input="debouncedFetch" type="text" placeholder="Search quotes..." class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <button v-if="isAuthenticated" @click="showCreate = true" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap">
          + Add Quote
        </button>
        <button v-else @click="showAuth = true" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap">
          Sign In
        </button>
      </div>

      <!-- Tags -->
      <div v-if="tags.length" class="flex flex-wrap gap-2 mb-8 justify-center">
        <button
          @click="selectedTag = ''"
          :class="['px-3 py-1.5 rounded-full text-sm font-medium transition-colors', !selectedTag ? 'bg-blue-600 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700']"
        >All</button>
        <button
          v-for="tag in tags"
          :key="tag.tag"
          @click="selectedTag = tag.tag"
          :class="['px-3 py-1.5 rounded-full text-sm font-medium transition-colors', selectedTag === tag.tag ? 'bg-blue-600 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700']"
        >
          #{{ tag.tag }} <span class="opacity-60">({{ tag.count }})</span>
        </button>
      </div>

      <!-- Sort -->
      <div class="flex items-center gap-2 mb-6 justify-end">
        <span class="text-sm text-zinc-500 dark:text-zinc-400">Sort:</span>
        <button @click="sort = 'random'; fetchQuotes()" :class="['text-sm px-3 py-1 rounded', sort === 'random' ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300']">Random</button>
        <button @click="sort = 'latest'; fetchQuotes()" :class="['text-sm px-3 py-1 rounded', sort === 'latest' ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300']">Latest</button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>

      <!-- Empty -->
      <div v-else-if="quotes.length === 0" class="text-center py-20">
        <p class="text-5xl mb-4">📝</p>
        <p class="text-xl text-zinc-600 dark:text-zinc-400 mb-2">No quotes yet</p>
        <p class="text-zinc-400 dark:text-zinc-500 mb-4">Be the first to share a quote!</p>
        <button @click="isAuthenticated ? (showCreate = true) : (showAuth = true)" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
          Add Quote
        </button>
      </div>

      <!-- Masonry Grid -->
      <div v-else class="columns-1 sm:columns-2 lg:columns-3 gap-4">
        <QuoteCard
          v-for="quote in quotes"
          :key="quote.id"
          :quote="quote"
          @open="openQuote"
          @edit="editQuote"
          @delete="confirmDelete"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
        <button @click="page > 1 && (page--, fetchQuotes())" :disabled="page <= 1" class="px-3 py-1.5 rounded border border-zinc-300 dark:border-zinc-600 disabled:opacity-40 text-sm">Prev</button>
        <span class="px-3 py-1.5 text-sm text-zinc-500">{{ page }} / {{ totalPages }}</span>
        <button @click="page < totalPages && (page++, fetchQuotes())" :disabled="page >= totalPages" class="px-3 py-1.5 rounded border border-zinc-300 dark:border-zinc-600 disabled:opacity-40 text-sm">Next</button>
      </div>
    </div>

    <!-- Modals -->
    <AuthModal :show="showAuth" @close="showAuth = false" />
    <CreateQuoteModal :show="showCreate" @close="showCreate = false" @created="fetchQuotes" />
    <QuoteModal :show="showModal" :quote="selectedQuote" @close="showModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { fetchQuotes, fetchTags, deleteQuote } from '@/services/quote'
import type { Quote, TagResponse } from '@/types/quote'
import QuoteCard from '@/components/QuoteCard.vue'
import QuoteModal from '@/components/QuoteModal.vue'
import CreateQuoteModal from '@/components/CreateQuoteModal.vue'
import AuthModal from '@/components/AuthModal.vue'

const { isAuthenticated } = useAuth()

const quotes = ref<Quote[]>([])
const tags = ref<TagResponse[]>([])
const loading = ref(true)
const search = ref('')
const selectedTag = ref('')
const sort = ref<'random' | 'latest'>('random')
const page = ref(1)
const total = ref(0)
const limit = 30

const totalPages = computed(() => Math.ceil(total.value / limit))

// Modals
const showAuth = ref(false)
const showCreate = ref(false)
const showModal = ref(false)
const selectedQuote = ref<Quote | null>(null)

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { page.value = 1; fetchQuotesData() }, 300)
}

async function fetchQuotes() {
  await fetchQuotesData()
}

async function fetchQuotesData() {
  loading.value = true
  try {
    const result = await fetchQuotes({
      search: search.value || undefined,
      tag: selectedTag.value || undefined,
      page: page.value,
      limit,
    })
    quotes.value = result.quotes || []
    total.value = result.total || 0
  } catch (e) {
    console.error('Failed to fetch quotes:', e)
  } finally {
    loading.value = false
  }
}

async function loadTags() {
  try {
    tags.value = await fetchTags()
  } catch { /* ignore */ }
}

function openQuote(quote: Quote) {
  selectedQuote.value = quote
  showModal.value = true
}

function editQuote(quote: Quote) {
  // TODO: open edit modal
  console.log('Edit:', quote)
}

async function confirmDelete(quote: Quote) {
  if (!confirm('Delete this quote?')) return
  try {
    await deleteQuote(quote.id)
    await fetchQuotes()
  } catch (e) {
    alert('Failed to delete quote')
  }
}

onMounted(() => {
  fetchQuotesData()
  loadTags()
})
</script>
