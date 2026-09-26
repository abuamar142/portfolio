<template>
  <!-- Loading -->
  <section v-if="loading" class="page-top">
    <div class="wrap pb-20 md:pb-28">
      <LoadingBlock />
    </div>
  </section>

  <!-- 404 -->
  <section v-else-if="notFound" class="page-top">
    <div class="wrap flex min-h-[60vh] flex-col items-center justify-center pb-20 text-center md:pb-28">
      <p class="label">{{ $t('snippets.notFound') }}</p>
      <h1 class="display-1 mt-6 text-base-content">404</h1>
      <p class="mt-6 max-w-[46ch] text-ink-2">{{ $t('snippets.notFound') }}</p>
      <div class="mt-10">
        <router-link to="/snippets" class="btn btn-primary">
          {{ $t('snippets.title') }}
        </router-link>
      </div>
    </div>
  </section>

  <!-- Error -->
  <section v-else-if="error" class="page-top">
    <div class="wrap pb-20 md:pb-28">
      <ErrorState :message="error" @retry="loadSnippet" />
    </div>
  </section>

  <section v-else-if="snippet" class="page-top">
    <div class="wrap pb-20 md:pb-28">
      <!-- Back link -->
      <router-link to="/snippets" class="label link link-hover mb-6 inline-flex items-center gap-1">
        <ArrowLeft :size="14" /> {{ $t('snippets.title') }}
      </router-link>

      <!-- Editing mode -->
      <template v-if="editing">
        <div class="max-w-3xl">
          <label for="snippet-edit-title" class="label"><span class="label-text">{{ $t('snippets.titleLabel') }}</span></label>
          <input
            id="snippet-edit-title"
            v-model="editForm.title"
            class="input input-bordered w-full mb-4"
            :placeholder="$t('snippets.title')"
          />
          <label for="snippet-edit-language" class="label"><span class="label-text">{{ $t('snippets.language') }}</span></label>
          <input
            id="snippet-edit-language"
            v-model="editForm.language"
            class="input input-bordered w-full mb-4"
            autocomplete="off"
            spellcheck="false"
            :placeholder="$t('snippets.language')"
          />
          <label for="snippet-edit-description" class="label"><span class="label-text">{{ $t('snippets.description') }}</span></label>
          <textarea
            id="snippet-edit-description"
            v-model="editForm.description"
            class="textarea textarea-bordered w-full mb-4"
            rows="2"
            :placeholder="$t('snippets.description')"
          />
          <label for="snippet-edit-code" class="label"><span class="label-text">{{ $t('snippets.code') }}</span></label>
          <textarea
            id="snippet-edit-code"
            v-model="editForm.code"
            class="textarea textarea-bordered w-full font-mono text-sm mb-4"
            rows="12"
            autocomplete="off"
            autocapitalize="none"
            spellcheck="false"
            :placeholder="$t('snippets.code')"
          />
          <label for="snippet-edit-tags" class="label"><span class="label-text">{{ $t('snippets.tags') }}</span></label>
          <TagInput
            id="snippet-edit-tags"
            v-model="editForm.tags"
            :max="20"
            class="mb-4"
            :placeholder="$t('snippets.tagsPlaceholder')"
          />
          <div class="flex items-center gap-3">
            <button @click="saveEdit" class="btn btn-primary btn-sm" :disabled="saving">
              {{ $t('snippets.save') }}
            </button>
            <button @click="cancelEdit" class="btn btn-ghost btn-sm">
              {{ $t('snippets.cancel') }}
            </button>
          </div>
        </div>
      </template>

      <!-- Read mode -->
      <template v-else>
        <div class="max-w-3xl">
          <div class="flex items-start justify-between gap-4 mb-4">
            <h1 class="display-2 text-base-content">{{ snippet.title }}</h1>
            <div class="flex items-center gap-2 shrink-0">
              <ShareButton :id="snippet.id" :content="snippet.title" author="Snippet" path="/snippets" />
              <template v-if="isAuthenticated">
                <button @click="startEdit" class="btn btn-ghost btn-sm btn-circle" :title="$t('snippets.edit')">
                  <Pencil :size="16" />
                </button>
                <button @click="handleDelete" class="btn btn-ghost btn-sm btn-circle text-error" :title="$t('snippets.delete')">
                  <Trash2 :size="16" />
                </button>
              </template>
            </div>
          </div>

          <!-- Meta -->
          <div class="flex flex-wrap items-center gap-3 mb-6 text-ink-3 text-sm">
            <span class="badge badge-outline">{{ snippet.language }}</span>
            <span v-for="tag in snippet.tags" :key="tag" class="badge badge-ghost badge-sm">#{{ tag }}</span>
            <span class="ml-auto text-ink-4 text-xs">{{ $t('snippets.created') }}: {{ formatDate(snippet.created_at) }}</span>
            <span v-if="snippet.updated_at !== snippet.created_at" class="text-ink-4 text-xs">{{ $t('snippets.updated') }}: {{ formatDate(snippet.updated_at) }}</span>
          </div>

          <!-- Description -->
          <p v-if="snippet.description" class="text-ink-2 mb-6 whitespace-pre-wrap">{{ snippet.description }}</p>

          <!-- Code block -->
          <div class="relative group">
            <button
              @click="copyCode"
              class="absolute top-3 right-3 btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ClipboardCheck v-if="codeCopied" :size="14" />
              <Clipboard v-else :size="14" />
              {{ codeCopied ? $t('snippets.copied') : $t('snippets.copy') }}
            </button>
            <div class="rounded-lg overflow-hidden border border-base-300">
              <div v-if="highlightedCode" v-html="highlightedCode" class="text-sm"></div>
              <pre v-else class="p-4 overflow-x-auto bg-base-200 text-sm"><code>{{ snippet.code }}</code></pre>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Clipboard,
  ClipboardCheck,
} from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'
import { useToast } from '@/composables/useToast'
import {
  fetchSnippetById,
  updateSnippet,
  deleteSnippet,
} from '@/services/snippet'
import { highlight } from '@/lib/shiki'
import { formatDateShort } from '@/lib/formatDate'
import TagInput from '@/components/ui/TagInput.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import type { Snippet } from '@/types/snippet'
import ShareButton from '@/components/ShareButton.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const { isAuthenticated } = useAuth()
const { mode } = useTheme()
const toast = useToast()

const snippet = ref<Snippet | null>(null)
const loading = ref(true)
const notFound = ref(false)
const error = ref('')
const highlightedCode = ref('')
const codeCopied = ref(false)

const editing = ref(false)
const saving = ref(false)
const editForm = ref({
  title: '',
  language: '',
  code: '',
  description: '',
  tags: [] as string[],
})

const isDark = computed(() => {
  if (mode.value === 'dark') return true
  if (mode.value === 'light') return false
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-color-scheme: dark)').matches
})

useHead({ title: computed(() => snippet.value?.title || t('snippets.title')) })

async function loadSnippet() {
  const id = route.params.id as string
  if (!id) {
    notFound.value = true
    loading.value = false
    return
  }
  loading.value = true
  notFound.value = false
  error.value = ''
  try {
    const data = await fetchSnippetById(id)
    snippet.value = data
    await renderCode(data.code, data.language)
  } catch (e: unknown) {
    const status = (e as { response?: { status?: number } })?.response?.status
    if (status === 404) {
      notFound.value = true
    } else {
      error.value = 'Failed to load snippet'
    }
  } finally {
    loading.value = false
  }
}

async function renderCode(code: string, lang: string) {
  highlightedCode.value = ''
  try {
    highlightedCode.value = await highlight(code, lang, isDark.value)
  } catch {
    highlightedCode.value = ''
  }
}

watch(isDark, async () => {
  if (snippet.value) {
    await renderCode(snippet.value.code, snippet.value.language)
  }
})

async function copyCode() {
  if (!snippet.value) return
  try {
    await navigator.clipboard.writeText(snippet.value.code)
    codeCopied.value = true
    setTimeout(() => { codeCopied.value = false }, 2000)
  } catch { /* ignore */ }
}

function formatDate(dateStr: string): string {
  // Was `toLocaleDateString(undefined, …)` — that follows the OS locale, so an
  // English user on an Indonesian machine saw Indonesian dates (and vice
  // versa). Use the active site locale instead.
  return formatDateShort(dateStr, locale.value)
}

function startEdit() {
  if (!snippet.value) return
  editForm.value = {
    title: snippet.value.title,
    language: snippet.value.language,
    code: snippet.value.code,
    description: snippet.value.description || '',
    tags: [...(snippet.value.tags || [])],
  }
  editing.value = true
}

function cancelEdit() {
  editing.value = false
}

async function saveEdit() {
  if (!snippet.value) return
  saving.value = true
  try {
    const updated = await updateSnippet(snippet.value.id, {
      title: editForm.value.title,
      language: editForm.value.language,
      code: editForm.value.code,
      description: editForm.value.description,
      tags: editForm.value.tags,
    })
    snippet.value = updated
    editing.value = false
    await renderCode(updated.code, updated.language)
    toast.success(t('snippets.updatedToast'))
  } catch {
    toast.error(t('snippets.updateFailed'))
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!snippet.value) return
  if (!confirm(t('snippets.confirmDelete'))) return
  try {
    await deleteSnippet(snippet.value.id)
    toast.success(t('snippets.deletedToast'))
    router.push('/snippets')
  } catch {
    toast.error(t('snippets.deleteFailed'))
  }
}

onMounted(loadSnippet)
</script>
