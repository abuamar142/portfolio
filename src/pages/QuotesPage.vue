<template>
  <div class="page-top section">
    <div class="wrap">
      <!-- Header -->
      <div class="mb-10 text-center">
        <h1 class="display-2 flex items-center justify-center gap-3">
          <MessageSquare :size="32" class="text-primary" />
          Quotes
        </h1>
        <p class="lead mt-2 mx-auto">Words worth sharing</p>
      </div>

      <!-- Search + Actions -->
      <div class="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <div class="relative flex-1 w-full">
          <Search :size="18" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-4" />
          <input v-model="search" @input="debouncedFetch" type="text" placeholder="Search quotes..." class="input input-bordered w-full pl-10" />
        </div>
        <template v-if="isAuthenticated">
          <button @click="showCreate = true" class="btn btn-primary">
            <Plus :size="16" /> Add Quote
          </button>
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar placeholder">
              <div class="bg-neutral text-neutral-content w-10 h-10 flex items-center justify-center">
                <span class="text-sm leading-none">{{ userInitials }}</span>
              </div>
            </div>
            <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-200 border border-base-300 z-10 w-52 p-2 shadow-lg mt-2">
              <li class="menu-title">{{ user?.display_name || user?.username }}</li>
              <li><a @click="handleLogout"><LogOut :size="14" /> Logout</a></li>
            </ul>
          </div>
        </template>
        <button v-else @click="showAuth = true" class="btn btn-primary">
          Sign In
        </button>
      </div>

      <!-- Tags -->
      <div v-if="tags.length" class="flex flex-wrap gap-2 mb-8 justify-center">
        <button
          @click="selectedTag = ''; reloadQuotes()"
          :class="['btn btn-sm', !selectedTag ? 'btn-primary' : 'btn-ghost']"
        >All</button>
        <button
          v-for="tag in tags"
          :key="tag.tag"
          @click="selectedTag = tag.tag; reloadQuotes()"
          :class="['btn btn-sm', selectedTag === tag.tag ? 'btn-primary' : 'btn-ghost']"
        >
          #{{ tag.tag }} <span class="opacity-60">({{ tag.count }})</span>
        </button>
      </div>

      <!-- Sort -->
      <div class="flex items-center gap-2 mb-6 justify-end">
        <span class="label">Sort:</span>
        <button @click="sortRandom" :class="['btn btn-sm', sort === 'random' ? 'btn-primary' : 'btn-ghost']">Random</button>
        <button @click="sortLatest" :class="['btn btn-sm', sort === 'latest' ? 'btn-primary' : 'btn-ghost']">Latest</button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <!-- Empty -->
      <div v-else-if="quotes.length === 0" class="text-center py-20">
        <FileEdit :size="64" class="mx-auto mb-4 text-ink-4" />
        <p class="display-2 text-2xl mb-2">No quotes yet</p>
        <p class="text-ink-3 mb-4">Be the first to share a quote!</p>
        <button @click="isAuthenticated ? (showCreate = true) : (showAuth = true)" class="btn btn-primary">
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
          @edit="startEdit"
          @delete="confirmDelete"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
        <button @click="prevPage" :disabled="page <= 1" class="btn btn-sm btn-ghost">Prev</button>
        <span class="btn btn-sm btn-ghost no-animation">{{ page }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page >= totalPages" class="btn btn-sm btn-ghost">Next</button>
      </div>
    </div>

    <!-- Modals -->
    <AuthModal :show="showAuth" @close="showAuth = false" />
    <CreateQuoteModal :show="showCreate" @close="showCreate = false" @created="reloadQuotes" />
    <EditQuoteModal :show="showEdit" :quote="editingQuote" @close="showEdit = false" @updated="reloadQuotes" />
    <QuoteModal :show="showModal" :quote="selectedQuote" @close="showModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { MessageSquare, FileEdit, Search, Plus, LogOut } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { fetchQuotes, fetchTags, deleteQuote } from '@/services/quote'
import type { Quote, TagResponse } from '@/types/quote'
import QuoteCard from '@/components/QuoteCard.vue'
import QuoteModal from '@/components/QuoteModal.vue'
import CreateQuoteModal from '@/components/CreateQuoteModal.vue'
import EditQuoteModal from '@/components/EditQuoteModal.vue'
import AuthModal from '@/components/AuthModal.vue'

const { user, isAuthenticated, logout } = useAuth()
const toast = useToast()

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
const userInitials = computed(() => {
  const name = user.value?.display_name || user.value?.username || ''
  return name.charAt(0).toUpperCase() || '?'
})

// Modals
const showAuth = ref(false)
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
    toast.error('Failed to load quotes')
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

function handleLogout() {
  logout()
  toast.info('Logged out')
}

async function confirmDelete(quote: Quote) {
  if (!confirm('Delete this quote?')) return
  try {
    await deleteQuote(quote.id)
    toast.success('Quote deleted')
    await reloadQuotes()
  } catch {
    toast.error('Failed to delete quote')
  }
}

onMounted(() => {
  fetchQuotesData()
  loadTags()
})
</script>
