<template>
  <PageShell id="snippets" :title="$t('snippets.title')" :lead="$t('snippets.dek')">

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
            @click="selectedLanguage = ''; onLanguageChange()"
            :class="['chip', !selectedLanguage ? 'chip-primary' : '']"
          >{{ $t('snippets.allLanguages') }}</button>
          <button
            v-for="lang in languages"
            :key="lang.language"
            @click="selectedLanguage = lang.language; onLanguageChange()"
            :class="['chip', selectedLanguage === lang.language ? 'chip-primary' : '']"
          >
            {{ lang.language }} <span class="text-ink-4">({{ lang.count }})</span>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <LoadingBlock v-if="loading" />

      <!-- Error -->
      <ErrorState
        v-else-if="error"
        variant="inline"
        class="mt-2"
        :message="$t('snippets.loadFailed')"
        @retry="fetchSnippetsData"
      >
        <BaseButton class="mt-6" variant="outline" size="sm" @click="fetchSnippetsData">
          {{ $t('errors.retry') }}
        </BaseButton>
      </ErrorState>

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
              <TagChip v-for="tag in snippet.tags" :key="tag" :tag="tag" />
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

    <SnippetFormModal :show="showCreate" @close="showCreate = false" @saved="handleCreated" />
  </PageShell>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageSeo } from '@/composables/usePageSeo'
import TagChip from '@/components/ui/TagChip.vue'
import { FileCode, Plus } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import TagFilter from '@/components/TagFilter.vue'
import { useQueryStringRef } from '@/composables/useQueryRef'
import {
  fetchSnippets,
  fetchSnippetTags,
  fetchSnippetLanguages,
} from '@/services/snippet'
import type { Snippet, TagResponse, LanguageResponse } from '@/types/snippet'
import PageShell from '@/components/layout/PageShell.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import SnippetFormModal from '@/components/SnippetFormModal.vue'
import AuthControls from '@/components/AuthControls.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useCrudList } from '@/composables/useCrudList'

const { t } = useI18n()
const { isAuthenticated } = useAuth()

// Reuses the visible SectionHeader lead as the meta description — the page
// previously fell through to the site-wide generic description.
usePageSeo({
  title: computed(() => t('snippets.title')),
  description: computed(() => t('snippets.dek')),
})

const tags = ref<TagResponse[]>([])
const languages = ref<LanguageResponse[]>([])
const selectedLanguage = useQueryStringRef<string>('language', '')
const showCreate = ref(false)

// Shared list machinery (search debounce, tag/page state, prev/next, loading
// and error flags) — see useCrudList for the contract all three list pages use.
const {
  items: snippets,
  loading,
  error,
  totalPages,
  search,
  selectedTag,
  page,
  fetchItems: fetchSnippetsData,
  debouncedFetch,
  onTagChange,
  prevPage,
  nextPage,
  afterCreate,
} = useCrudList<Snippet>({
  limit: 18,
  fetch: async (params) => {
    const result = await fetchSnippets({
      search: params.search,
      tag: params.tag,
      language: params.language as string | undefined,
      page: params.page,
      limit: params.limit,
    })
    return { items: result.snippets || [], total: result.total || 0 }
  },
  // Snippet lists also filter by language.
  extraParams: () => ({ language: selectedLanguage.value || undefined }),
})

// Language filter: same contract as tag/search — restart from page 1.
function onLanguageChange() {
  page.value = 1
  void fetchSnippetsData()
}

// After creating: back to page 1 (new snippet sorts first) and refresh the tag
// filter in case the snippet introduced a new tag.
function handleCreated() {
  afterCreate()
  loadTags()
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

/** Relative time via locale keys — the previous hand-rolled version was
 *  hardcoded English ('2h ago') on an Indonesian-first site. */
function relativeDate(dateStr: string): string {
  const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diffSec < 60) return t('snippets.justNow')
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return t('snippets.minutesAgo', { n: diffMin })
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return t('snippets.hoursAgo', { n: diffHr })
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 30) return t('snippets.daysAgo', { n: diffDay })
  const diffMonth = Math.floor(diffDay / 30)
  if (diffMonth < 12) return t('snippets.monthsAgo', { n: diffMonth })
  return t('snippets.yearsAgo', { n: Math.floor(diffMonth / 12) })
}

onMounted(() => {
  loadTags()
  loadLanguages()
})
</script>
