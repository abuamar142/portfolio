<template>
  <PageShell id="quotes" :title="$t('quotes.title')" :lead="$t('quotes.dek')">

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

      <!-- Error -->
      <ErrorState
        v-else-if="error"
        variant="inline"
        class="mt-2"
        :message="$t('quotes.loadFailed')"
        @retry="fetchQuotesData"
      >
        <BaseButton class="mt-6" variant="outline" size="sm" @click="fetchQuotesData">
          {{ $t('errors.retry') }}
        </BaseButton>
      </ErrorState>

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
    <!-- Modals -->
    <CreateQuoteModal :show="showCreate" @close="showCreate = false" @created="afterCreate" />
    <EditQuoteModal :show="showEdit" :quote="editingQuote" @close="showEdit = false" @updated="fetchQuotesData" />
    <QuoteModal :show="showModal" :quote="selectedQuote" @close="showModal = false" />
    <ConfirmModal
      :open="!!pendingDelete"
      :title="$t('quotes.deleteConfirm')"
      :busy="deleting"
      @confirm="runDelete"
      @cancel="pendingDelete = null"
    />
  </PageShell>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageSeo } from '@/composables/usePageSeo'
import { FileEdit, Plus } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { useQueryStringRef } from '@/composables/useQueryRef'
import { useToast } from '@/composables/useToast'
import { fetchQuotes, fetchTags, deleteQuote } from '@/services/quote'
import type { Quote, TagResponse } from '@/types/quote'
import QuoteCard from '@/components/QuoteCard.vue'
import TagFilter from '@/components/TagFilter.vue'
import QuoteModal from '@/components/QuoteModal.vue'
import CreateQuoteModal from '@/components/CreateQuoteModal.vue'
import EditQuoteModal from '@/components/EditQuoteModal.vue'
import AuthControls from '@/components/AuthControls.vue'
import PageShell from '@/components/layout/PageShell.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useCrudList } from '@/composables/useCrudList'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'

const { t } = useI18n()

usePageSeo({
  title: computed(() => t('head.quotes.title')),
  description: computed(() => t('head.quotes.dek')),
  breadcrumbs: [{ name: t('navigation.explore'), path: '/explore' }],
})

const { isAuthenticated, openAuth } = useAuth()
const toast = useToast()

const tags = ref<TagResponse[]>([])
const sort = useQueryStringRef<'random' | 'latest'>('sort', 'random')

// Shared list machinery — see useCrudList for the contract every list page uses.
const {
  items: quotes,
  loading,
  error,
  totalPages,
  search,
  selectedTag,
  page,
  fetchItems: fetchQuotesData,
  debouncedFetch,
  onTagChange,
  prevPage,
  nextPage,
  afterCreate,
} = useCrudList<Quote>({
  limit: 30,
  fetch: async (params) => {
    const result = await fetchQuotes({
      search: params.search,
      tag: params.tag,
      page: params.page,
      limit: params.limit,
    })
    return { items: result.quotes || [], total: result.total || 0 }
  },
})

const showCreate = ref(false)
const showEdit = ref(false)
const showModal = ref(false)
const selectedQuote = ref<Quote | null>(null)
const editingQuote = ref<Quote | null>(null)

// Sorting is quotes-only: flip the query param and refetch from the top.
function sortRandom() { sort.value = 'random'; page.value = 1; void fetchQuotesData() }
function sortLatest() { sort.value = 'latest'; page.value = 1; void fetchQuotesData() }

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

// Themed confirmation instead of window.confirm(): native dialogs block the
// main thread, ignore the design system, and cannot show a busy state.
const pendingDelete = ref<Quote | null>(null)
const deleting = ref(false)

function confirmDelete(quote: Quote) {
  pendingDelete.value = quote
}

async function runDelete() {
  const quote = pendingDelete.value
  if (!quote) return
  deleting.value = true
  try {
    await deleteQuote(quote.id)
    toast.success(t('quotes.deletedToast'))
    pendingDelete.value = null
    await fetchQuotesData()
  } catch {
    toast.error(t('quotes.deleteFailed'))
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadTags()
})
</script>
