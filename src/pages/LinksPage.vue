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
        <button
          v-if="tags.length"
          @click="selectedTag = ''; reloadLinks()"
          :class="['chip', !selectedTag ? 'chip-accent' : '']"
        >{{ $t('links.all') }}</button>
        <button
          v-for="tag in tags"
          :key="tag.tag"
          @click="selectedTag = tag.tag; reloadLinks()"
          :class="['chip', selectedTag === tag.tag ? 'chip-accent' : '']"
        >
          #{{ tag.tag }} <span class="text-ink-4">({{ tag.count }})</span>
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <!-- Empty -->
      <div v-else-if="links.length === 0" class="text-center py-20">
        <Link2 :size="64" class="mx-auto mb-4 text-ink-4" />
        <p class="display-2 mb-2">{{ $t('links.emptyTitle') }}</p>
        <p class="text-ink-3 mb-4">{{ $t('links.emptyDek') }}</p>
        <button
          @click="isAuthenticated ? openCreate() : openAuth(openCreate)"
          class="btn btn-primary"
        >{{ $t('links.addLink') }}</button>
      </div>

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

    <!-- Link Modal -->
    <BaseModal
      :open="showModal"
      :close-label="$t('common.close')"
      labelled-by="link-modal-title"
      box-class="rounded-none"
      @close="closeModal"
    >
        <h3 id="link-modal-title" class="font-bold text-lg mb-4">{{ editingLink ? $t('links.editTitle') : $t('links.createTitle') }}</h3>
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
          <div>
            <label for="link-url" class="label"><span class="label-text">{{ $t('links.urlLabel') }}</span></label>
            <input
              id="link-url"
              v-model="form.url"
              type="url"
              required
              autocomplete="off"
              spellcheck="false"
              placeholder="https://"
              class="input input-bordered w-full rounded-none"
            />
            <p v-if="formErrors.url" class="text-error text-xs mt-1">{{ formErrors.url }}</p>
          </div>
          <div>
            <label for="link-title" class="label"><span class="label-text">{{ $t('links.titleLabel') }}</span></label>
            <input
              id="link-title"
              v-model="form.title"
              type="text"
              required
              autocomplete="off"
              class="input input-bordered w-full rounded-none"
            />
          </div>
          <div>
            <label for="link-description" class="label"><span class="label-text">{{ $t('links.descriptionLabel') }}</span></label>
            <textarea
              id="link-description"
              v-model="form.description"
              rows="3"
              class="textarea textarea-bordered w-full rounded-none"
            />
          </div>
          <div>
            <label for="link-tags" class="label"><span class="label-text">{{ $t('links.tagsLabel') }}</span></label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="(tag, i) in form.tags"
                :key="i"
                class="chip chip-accent chip-sm"
              >
                #{{ tag }}
                <button type="button" :aria-label="$t('links.removeTag', { tag })" @click="removeTag(i)" class="ml-1 text-xs">×</button>
              </span>
            </div>
            <input
              id="link-tags"
              v-model="tagInput"
              type="text"
              autocomplete="off"
              :placeholder="$t('links.tagsPlaceholder')"
              class="input input-bordered w-full rounded-none"
              @keydown.enter.prevent="addTag"
            />
          </div>
          <div class="modal-action">
            <button type="button" @click="closeModal" class="btn btn-ghost">
              {{ $t('links.cancel') }}
            </button>
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              {{ submitting ? $t('links.saving') : $t('links.save') }}
            </button>
          </div>
        </form>
    </BaseModal>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useHead } from '@unhead/vue'
import { Link2, ExternalLink, Plus } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { useQueryStringRef, useQueryNumberRef } from '@/composables/useQueryRef'
import { useToast } from '@/composables/useToast'
import {
  fetchLinks,
  fetchLinkTags,
  createLink,
  updateLink,
  deleteLink,
} from '@/services/link'
import type { Link, LinkTagResponse } from '@/services/link'
import AuthControls from '@/components/AuthControls.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import SearchInput from '@/components/ui/SearchInput.vue'

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

// Modal state
const showModal = ref(false)
const editingLink = ref<Link | null>(null)
const submitting = ref(false)
const form = ref({ url: '', title: '', description: '', tags: [] as string[] })
const tagInput = ref('')
const formErrors = ref<{ url?: string }>({})

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
  form.value = { url: '', title: '', description: '', tags: [] }
  formErrors.value = {}
  showModal.value = true
}

function openEdit(link: Link) {
  editingLink.value = link
  form.value = {
    url: link.url,
    title: link.title,
    description: link.description || '',
    tags: [...link.tags],
  }
  formErrors.value = {}
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingLink.value = null
  formErrors.value = {}
}

function addTag() {
  const val = tagInput.value.trim()
  if (!val) return
  if (form.value.tags.length >= 5) {
    toast.error(t('links.tagsMax'))
    return
  }
  if (!form.value.tags.includes(val)) {
    form.value.tags.push(val)
  }
  tagInput.value = ''
}

function removeTag(index: number) {
  form.value.tags.splice(index, 1)
}

function validate(): boolean {
  formErrors.value = {}
  if (!form.value.url.startsWith('http://') && !form.value.url.startsWith('https://')) {
    formErrors.value.url = t('links.urlInvalid')
    return false
  }
  if (!form.value.title.trim()) return false
  return true
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  try {
    const payload = {
      url: form.value.url,
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      tags: form.value.tags,
    }
    if (editingLink.value) {
      await updateLink(editingLink.value.id, payload)
      toast.success(t('links.updatedToast'))
    } else {
      await createLink(payload)
      toast.success(t('links.createdToast'))
    }
    closeModal()
    await reloadLinks()
    await loadTags()
  } catch {
    toast.error(editingLink.value ? t('links.updateFailed') : t('links.createFailed'))
  } finally {
    submitting.value = false
  }
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
