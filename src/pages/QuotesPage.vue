<template>
  <section id="quotes" class="page-top">
    <div class="wrap pb-20 md:pb-28">
      <!-- Page head -->
      <SectionHeader level="h1" :title="$t('quotes.title')" :lead="$t('quotes.dek')" />

      <!-- Search + actions -->
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div class="min-w-0 flex-1">
          <SearchInput
            v-model="search"
            :placeholder="$t('quotes.searchPlaceholder')"
            @update:model-value="debouncedFetch"
          />
        </div>
        <div class="flex shrink-0 items-center gap-3">
          <button v-if="isAuthenticated" @click="showCreate = true" class="btn btn-primary">
            <Plus :size="16" /> {{ $t('quotes.addQuote') }}
          </button>
          <AuthControls />
        </div>
      </div>

      <!-- Tags + sort -->
      <div class="mb-8 flex flex-wrap items-center justify-between gap-3 border-t border-hairline-light pt-4">
        <TagFilter
          v-model="selectedTag"
          :tags="tags"
          :all-label="$t('quotes.all')"
          @update:model-value="onTagChange"
        />
        <div class="ml-auto flex items-center gap-2">
          <span class="label">{{ $t('quotes.sort') }}</span>
          <button @click="sortRandom" :class="['btn btn-sm', sort === 'random' ? 'btn-primary' : 'btn-ghost']">{{ $t('quotes.random') }}</button>
          <button @click="sortLatest" :class="['btn btn-sm', sort === 'latest' ? 'btn-primary' : 'btn-ghost']">{{ $t('quotes.latest') }}</button>
        </div>
      </div>

      <!-- Loading -->
      <LoadingBlock v-if="loading" />

      <!-- Empty -->
      <EmptyState
        v-else-if="quotes.length === 0"
        :icon="FileEdit"
        :title="$t('quotes.emptyTitle')"
        :dek="$t('quotes.emptyDek')"
      >
        <button @click="isAuthenticated ? (showCreate = true) : openAuth(() => (showCreate = true))" class="btn btn-primary">
          {{ $t('quotes.addQuote') }}
        </button>
      </EmptyState>

      <!-- Masonry Grid -->
      <div v-else class="columns-1 sm:columns-2 lg:columns-3 gap-4">
        <QuoteCard
          v-for="quote in quotes"
          :key="quote.id"
          :quote="quote"
          @open="openQuote"
          @edit="startEdit"
          @delete="confirmDelete"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
        <button @click="prevPage" :disabled="page <= 1" class="btn btn-sm btn-ghost">{{ $t('quotes.prev') }}</button>
        <span class="btn btn-sm btn-ghost no-animation">{{ page }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page >= totalPages" class="btn btn-sm btn-ghost">{{ $t('quotes.next') }}</button>
      </div>
    </div>

    <!-- Modals -->
    <CreateQuoteModal :show="showCreate" @close="showCreate = false" @created="reloadQuotes" />
    <EditQuoteModal :show="showEdit" :quote="editingQuote" @close="showEdit = false" @updated="reloadQuotes" />
    <QuoteModal :show="showModal" :quote="selectedQuote" @close="showModal = false" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { FileEdit, Plus } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { useQueryStringRef, useQueryNumberRef } from '@/composables/useQueryRef'
import { useToast } from '@/composables/useToast'
import { fetchQuotes, fetchTags, deleteQuote } from '@/services/quote'
import type { Quote, TagResponse } from '@/types/quote'
import QuoteCard from '@/components/QuoteCard.vue'
import TagFilter from '@/components/TagFilter.vue'
import QuoteModal from '@/components/QuoteModal.vue'
import CreateQuoteModal from '@/components/CreateQuoteModal.vue'
import EditQuoteModal from '@/components/EditQuoteModal.vue'
import AuthControls from '@/components/AuthControls.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const { t } = useI18n()

useHead({
  title: computed(() => t('head.quotes.title')),
  meta: [
    { name: 'description', content: computed(() => t('head.quotes.dek')) },
    { property: 'og:title', content: computed(() => `${t('head.quotes.title')} - Abu Amar`) },
    { property: 'og:description', content: computed(() => t('head.quotes.dek')) },
  ],
})

const { isAuthenticated, openAuth } = useAuth()
const toast = useToast()

const quotes = ref<Quote[]>([])
const tags = ref<TagResponse[]>([])
const loading = ref(true)
const search = useQueryStringRef<string>('q', '')
const selectedTag = useQueryStringRef<string>('tag', '')
const sort = useQueryStringRef<'random' | 'latest'>('sort', 'random')
const page = useQueryNumberRef('page', 1)
const total = ref(0)
const limit = 30

const totalPages = computed(() => Math.ceil(total.value / limit))

// Modals
const showCreate = ref(false)
const showEdit = ref(false)
const showModal = ref(false)
const selectedQuote = ref<Quote | null>(null)
const editingQuote = ref<Quote | null>(null)

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { page.value = 1; fetchQuotesData() }, 300)
}

// Tag change: same contract as search — start from page 1.
function onTagChange() {
  page.value = 1
  reloadQuotes()
}

function sortRandom() { sort.value = 'random'; reloadQuotes() }
function sortLatest() { sort.value = 'latest'; reloadQuotes() }

function prevPage() {
  if (page.value > 1) { page.value--; reloadQuotes() }
}

function nextPage() {
  if (page.value < totalPages.value) { page.value++; reloadQuotes() }
}

async function reloadQuotes() {
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
  } catch (e: unknown) {
    console.error('Failed to fetch quotes:', e)
    toast.error(t('quotes.loadFailed'))
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

function startEdit(quote: Quote) {
  editingQuote.value = quote
  showEdit.value = true
}

async function confirmDelete(quote: Quote) {
  if (!confirm(t('quotes.deleteConfirm'))) return
  try {
    await deleteQuote(quote.id)
    toast.success(t('quotes.deletedToast'))
    await reloadQuotes()
  } catch {
    toast.error(t('quotes.deleteFailed'))
  }
}

onMounted(() => {
  fetchQuotesData()
  loadTags()
})
</script>
