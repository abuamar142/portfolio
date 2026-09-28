<template>
  <PageShell id="links" :title="$t('links.title')" :lead="$t('links.dek')">

      <!-- Search + actions -->
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div class="min-w-0 flex-1">
          <SearchInput
            v-model="search"
            :placeholder="$t('links.searchPlaceholder')"
            @update:model-value="debouncedFetch"
          />
        </div>
        <div class="flex shrink-0 items-center gap-3">
          <button v-if="isAuthenticated" @click="openCreate" class="btn btn-primary">
            <Plus :size="16" /> {{ $t('links.addLink') }}
          </button>
          <AuthControls />
        </div>
      </div>

      <!-- Tags -->
      <div class="mb-8 flex flex-wrap items-center gap-2 border-t border-hairline-light pt-4">
        <TagFilter
          v-model="selectedTag"
          :tags="tags"
          :all-label="$t('links.all')"
          @update:model-value="onTagChange"
        />
      </div>

      <!-- Loading -->
      <LoadingBlock v-if="loading" />

      <!-- Error: a failed fetch must not masquerade as "no links yet". -->
      <ErrorState
        v-else-if="error"
        variant="inline"
        class="mt-2"
        :message="$t('links.loadFailed')"
        @retry="fetchLinksData"
      >
        <BaseButton class="mt-6" variant="outline" size="sm" @click="fetchLinksData">
          {{ $t('errors.retry') }}
        </BaseButton>
      </ErrorState>

      <!-- Empty -->
      <EmptyState
        v-else-if="links.length === 0"
        :icon="Link2"
        :title="$t('links.emptyTitle')"
        :dek="$t('links.emptyDek')"
      >
        <button
          @click="isAuthenticated ? openCreate() : openAuth(openCreate)"
          class="btn btn-primary"
        >{{ $t('links.addLink') }}</button>
      </EmptyState>

      <!-- Grid: base grid-cols-1 clamps the track to minmax(0,1fr) — without
           it the sub-sm implicit auto track takes the card's max-content and
           overflows the page horizontally on phones. -->
      <div v-else class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="link in links"
          :key="link.id"
          class="group card bg-base-200 border border-base-300 rounded-none p-5 hover:border-primary/40 transition-colors"
        >
          <div class="flex items-start justify-between gap-3">
            <a
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="min-w-0 flex-1"
            >
              <h3 class="font-semibold text-base-content truncate group-hover:text-primary transition-colors">
                {{ link.title }}
              </h3>
            </a>
            <ExternalLink :size="16" class="shrink-0 text-ink-4 group-hover:text-primary transition-colors" />
          </div>
          <p v-if="link.description" class="mt-2 text-sm text-ink-3 line-clamp-3">
            {{ link.description }}
          </p>
          <p class="mt-2 text-xs text-ink-4 font-mono truncate">{{ displayUrl(link.url) }}</p>
          <div v-if="link.tags.length" class="mt-3 flex flex-wrap gap-1">
            <TagChip v-for="tag in link.tags" :key="tag" :tag="tag" />
          </div>
          <div v-if="isAuthenticated" class="mt-3 flex items-center gap-2 border-t border-hairline-light pt-3">
            <button @click="openEdit(link)" class="btn btn-sm btn-ghost">
              {{ $t('links.edit') }}
            </button>
            <button @click="confirmDelete(link)" class="btn btn-sm btn-ghost text-error">
              {{ $t('links.delete') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
        <button @click="prevPage" :disabled="page <= 1" class="btn btn-sm btn-ghost">
          {{ $t('links.prev') }}
        </button>
        <span class="btn btn-sm btn-ghost no-animation">{{ page }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page >= totalPages" class="btn btn-sm btn-ghost">
          {{ $t('links.next') }}
        </button>
      </div>

    <LinkModal :show="showModal" :link="editingLink" @close="closeModal" @saved="onSaved" />
    <ConfirmModal
      :open="!!pendingDelete"
      :title="$t('links.deleteConfirm')"
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
import TagChip from '@/components/ui/TagChip.vue'
import { Link2, ExternalLink, Plus } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import TagFilter from '@/components/TagFilter.vue'
import { useToast } from '@/composables/useToast'
import {
  fetchLinks,
  fetchLinkTags,
  deleteLink,
} from '@/services/link'
import type { Link, LinkTagResponse } from '@/services/link'
import AuthControls from '@/components/AuthControls.vue'
import PageShell from '@/components/layout/PageShell.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useCrudList } from '@/composables/useCrudList'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import LinkModal from '@/components/LinkModal.vue'

const { t } = useI18n()

usePageSeo({
  title: computed(() => t('head.links.title')),
  description: computed(() => t('head.links.dek')),
})

const { isAuthenticated, openAuth } = useAuth()
const toast = useToast()

const tags = ref<LinkTagResponse[]>([])

// Shared list machinery — see useCrudList for the contract every list page uses.
const {
  items: links,
  loading,
  error,
  totalPages,
  search,
  selectedTag,
  page,
  fetchItems: fetchLinksData,
  debouncedFetch,
  onTagChange,
  prevPage,
  nextPage,
} = useCrudList<Link>({
  limit: 30,
  fetch: async (params) => {
    const result = await fetchLinks({
      search: params.search,
      tag: params.tag,
      page: params.page,
      limit: params.limit,
    })
    return { items: result.links || [], total: result.total || 0 }
  },
})

const showModal = ref(false)
const editingLink = ref<Link | null>(null)

function displayUrl(url: string) {
  try {
    return new URL(url).hostname + new URL(url).pathname.replace(/\/$/, '')
  } catch {
    return url
  }
}

async function loadTags() {
  try {
    tags.value = await fetchLinkTags()
  } catch { /* ignore */ }
}

function openCreate() {
  editingLink.value = null
  showModal.value = true
}

function openEdit(link: Link) {
  editingLink.value = link
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingLink.value = null
}

function onSaved() {
  fetchLinksData()
  loadTags()
}


// Themed confirmation instead of window.confirm().
const pendingDelete = ref<Link | null>(null)
const deleting = ref(false)

function confirmDelete(link: Link) {
  pendingDelete.value = link
}

async function runDelete() {
  const link = pendingDelete.value
  if (!link) return
  deleting.value = true
  try {
    await deleteLink(link.id)
    toast.success(t('links.deletedToast'))
    pendingDelete.value = null
    await fetchLinksData()
    await loadTags()
  } catch {
    toast.error(t('links.deleteFailed'))
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadTags()
})
</script>
