<template>
  <section id="links" class="page-top">
    <div class="wrap pb-20 md:pb-28">
      <!-- Page head -->
      <SectionHeader level="h1" :title="$t('links.title')" :lead="$t('links.dek')" />

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

      <!-- Grid -->
      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <span
              v-for="tag in link.tags"
              :key="tag"
              class="text-xs text-ink-4 bg-base-300 px-1.5 py-0.5"
            >#{{ tag }}</span>
          </div>
          <div v-if="isAuthenticated" class="mt-3 flex items-center gap-2 border-t border-hairline-light pt-3">
            <button @click="openEdit(link)" class="btn btn-xs btn-ghost">
              {{ $t('links.edit') }}
            </button>
            <button @click="confirmDelete(link)" class="btn btn-xs btn-ghost text-error">
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
    </div>

    <LinkModal :show="showModal" :link="editingLink" @close="closeModal" @saved="onSaved" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { Link2, ExternalLink, Plus } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import TagFilter from '@/components/TagFilter.vue'
import { useQueryStringRef, useQueryNumberRef } from '@/composables/useQueryRef'
import { useToast } from '@/composables/useToast'
import {
  fetchLinks,
  fetchLinkTags,
  deleteLink,
} from '@/services/link'
import type { Link, LinkTagResponse } from '@/services/link'
import AuthControls from '@/components/AuthControls.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import LinkModal from '@/components/LinkModal.vue'

const { t } = useI18n()

useHead({
  title: computed(() => t('head.links.title')),
  meta: [
    { name: 'description', content: computed(() => t('head.links.dek')) },
    { property: 'og:title', content: computed(() => `${t('head.links.title')} - Abu Amar`) },
    { property: 'og:description', content: computed(() => t('head.links.dek')) },
  ],
})

const { isAuthenticated, openAuth } = useAuth()
const toast = useToast()

const links = ref<Link[]>([])
const tags = ref<LinkTagResponse[]>([])
const loading = ref(true)
const search = useQueryStringRef<string>('q', '')
const selectedTag = useQueryStringRef<string>('tag', '')
const page = useQueryNumberRef('page', 1)
const total = ref(0)
const limit = 30

const totalPages = computed(() => Math.ceil(total.value / limit))

// Modal state — the form itself lives in LinkModal
const showModal = ref(false)
const editingLink = ref<Link | null>(null)

function displayUrl(url: string) {
  try {
    return new URL(url).hostname + new URL(url).pathname.replace(/\/$/, '')
  } catch {
    return url
  }
}

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { page.value = 1; fetchLinksData() }, 300)
}

function prevPage() {
  if (page.value > 1) { page.value--; reloadLinks() }
}

function nextPage() {
  if (page.value < totalPages.value) { page.value++; reloadLinks() }
}

async function reloadLinks() {
  await fetchLinksData()
}

async function fetchLinksData() {
  loading.value = true
  try {
    const result = await fetchLinks({
      search: search.value || undefined,
      tag: selectedTag.value || undefined,
      page: page.value,
      limit,
    })
    links.value = result.links || []
    total.value = result.total || 0
  } catch {
    toast.error(t('links.loadFailed'))
  } finally {
    loading.value = false
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
  reloadLinks()
  loadTags()
}

// Tag change: same contract as search — start from page 1.
function onTagChange() {
  page.value = 1
  reloadLinks()
}


async function confirmDelete(link: Link) {
  if (!confirm(t('links.deleteConfirm'))) return
  try {
    await deleteLink(link.id)
    toast.success(t('links.deletedToast'))
    await reloadLinks()
    await loadTags()
  } catch {
    toast.error(t('links.deleteFailed'))
  }
}

onMounted(() => {
  fetchLinksData()
  loadTags()
})
</script>
