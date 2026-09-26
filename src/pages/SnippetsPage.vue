<template>
  <section id="snippets" class="page-top">
    <div class="wrap pb-20 md:pb-28">
      <!-- Page head -->
      <SectionHeader level="h1" :title="$t('snippets.title')" :lead="$t('snippets.dek')" />

      <!-- Search -->
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div class="min-w-0 flex-1">
          <SearchInput
            v-model="search"
            :placeholder="$t('snippets.searchPlaceholder')"
            @update:model-value="debouncedFetch"
          />
        </div>
        <div class="flex shrink-0 items-center gap-3">
          <button v-if="isAuthenticated" @click="showCreate = true" class="btn btn-primary">
            <Plus :size="16" /> {{ $t('snippets.addSnippet') }}
          </button>
          <AuthControls />
        </div>
      </div>

      <!-- Tags + language filter -->
      <div class="mb-8 flex flex-wrap items-center justify-between gap-3 border-t border-hairline-light pt-4">
        <TagFilter
          v-model="selectedTag"
          :tags="tags"
          :all-label="$t('snippets.allTags')"
          @update:model-value="onTagChange"
        />
        <div v-if="languages.length" class="ml-auto flex flex-wrap items-center gap-2">
          <button
            @click="selectedLanguage = ''; reloadSnippets()"
            :class="['chip', !selectedLanguage ? 'chip-primary' : '']"
          >{{ $t('snippets.allLanguages') }}</button>
          <button
            v-for="lang in languages"
            :key="lang.language"
            @click="selectedLanguage = lang.language; reloadSnippets()"
            :class="['chip', selectedLanguage === lang.language ? 'chip-primary' : '']"
          >
            {{ lang.language }} <span class="text-ink-4">({{ lang.count }})</span>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <LoadingBlock v-if="loading" />

      <!-- Empty -->
      <EmptyState
        v-else-if="snippets.length === 0"
        :icon="FileCode"
        :title="$t('snippets.empty')"
      />

      <!-- Snippet cards -->
      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <router-link
          v-for="snippet in snippets"
          :key="snippet.id"
          :to="`/snippets/${snippet.id}`"
          class="card bg-base-200 border border-base-300 hover:border-primary/50 transition-colors"
        >
          <div class="card-body p-5">
            <div class="flex items-start justify-between gap-2">
              <h3 class="card-title text-base-content text-sm line-clamp-1">{{ snippet.title }}</h3>
              <span class="badge badge-outline badge-sm shrink-0">{{ snippet.language }}</span>
            </div>
            <p v-if="snippet.description" class="text-ink-3 text-xs line-clamp-2 mt-1">{{ snippet.description }}</p>
            <div v-if="snippet.tags.length" class="flex flex-wrap gap-1 mt-2">
              <span v-for="tag in snippet.tags" :key="tag" class="badge badge-ghost badge-xs">#{{ tag }}</span>
            </div>
            <div class="text-ink-4 text-[11px] mt-auto pt-2">{{ relativeDate(snippet.created_at) }}</div>
          </div>
        </router-link>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
        <button @click="prevPage" :disabled="page <= 1" class="btn btn-sm btn-ghost">{{ t("common.prev") }}</button>
        <span class="btn btn-sm btn-ghost no-animation">{{ page }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page >= totalPages" class="btn btn-sm btn-ghost">{{ t("common.next") }}</button>
      </div>
    </div>

    <SnippetFormModal :show="showCreate" @close="showCreate = false" @saved="handleCreated" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { FileCode, Plus } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import TagFilter from '@/components/TagFilter.vue'
import { useQueryStringRef, useQueryNumberRef } from '@/composables/useQueryRef'
import { useToast } from '@/composables/useToast'
import {
  fetchSnippets,
  fetchSnippetTags,
  fetchSnippetLanguages,
} from '@/services/snippet'
import type { Snippet, TagResponse, LanguageResponse } from '@/types/snippet'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import SnippetFormModal from '@/components/SnippetFormModal.vue'
import AuthControls from '@/components/AuthControls.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const { t } = useI18n()
const { isAuthenticated } = useAuth()
const toast = useToast()

useHead({ title: computed(() => t('snippets.title')) })

const snippets = ref<Snippet[]>([])
const tags = ref<TagResponse[]>([])
const languages = ref<LanguageResponse[]>([])
const loading = ref(true)
const search = useQueryStringRef<string>('q', '')
const selectedTag = useQueryStringRef<string>('tag', '')
const selectedLanguage = useQueryStringRef<string>('language', '')
const page = useQueryNumberRef('page', 1)
const total = ref(0)
const limit = 18

const totalPages = computed(() => Math.ceil(total.value / limit))
const showCreate = ref(false)

// After creating: jump back to page 1 (new snippet sorts first) and refresh
// the tag filter in case the snippet introduced a new tag.
function handleCreated() {
  page.value = 1
  fetchSnippetsData()
  loadTags()
}

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    page.value = 1
    fetchSnippetsData()
  }, 300)
}

function prevPage() {
  if (page.value > 1) { page.value--; reloadSnippets() }
}

function nextPage() {
  if (page.value < totalPages.value) { page.value++; reloadSnippets() }
}

// Tag change: same contract as search — start from page 1.
function onTagChange() {
  page.value = 1
  reloadSnippets()
}

async function reloadSnippets() {
  await fetchSnippetsData()
}

async function fetchSnippetsData() {
  loading.value = true
  try {
    const result = await fetchSnippets({
      search: search.value || undefined,
      tag: selectedTag.value || undefined,
      language: selectedLanguage.value || undefined,
      page: page.value,
      limit,
    })
    snippets.value = result.snippets || []
    total.value = result.total || 0
  } catch (e: unknown) {
    console.error('Failed to fetch snippets:', e)
    toast.error('Failed to load snippets')
  } finally {
    loading.value = false
  }
}

async function loadTags() {
  try {
    tags.value = await fetchSnippetTags()
  } catch { /* ignore */ }
}

async function loadLanguages() {
  try {
    languages.value = await fetchSnippetLanguages()
  } catch { /* ignore */ }
}

function relativeDate(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return 'just now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 30) return `${diffDay}d ago`
  const diffMonth = Math.floor(diffDay / 30)
  if (diffMonth < 12) return `${diffMonth}mo ago`
  const diffYear = Math.floor(diffMonth / 12)
  return `${diffYear}y ago`
}

onMounted(() => {
  fetchSnippetsData()
  loadTags()
  loadLanguages()
})
</script>
