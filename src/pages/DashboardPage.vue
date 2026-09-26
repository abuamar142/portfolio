<template>
  <section id="dashboard" class="page-top">
    <div class="wrap pb-20 md:pb-28">
      <SectionHeader level="h1" :title="$t('dashboard.title')" :lead="$t('dashboard.dek')" />

      <!-- Gate: belum masuk -->
      <div v-if="!isAuthenticated" class="panel mt-8 p-8 text-center">
        <p class="display-2 mb-2">{{ $t('dashboard.gateLogin') }}</p>
        <p class="text-ink-3 mb-4">{{ $t('dashboard.gateLoginDek') }}</p>
        <button class="btn btn-primary" @click="openAuth()">{{ $t('auth.signIn') }}</button>
      </div>

      <!-- Gate: masuk, tapi bukan akun owner -->
      <div v-else-if="!isOwner" class="panel mt-8 p-8 text-center" role="alert">
        <p class="display-2 mb-2">{{ $t('dashboard.denied') }}</p>
        <p class="text-ink-3">{{ $t('dashboard.deniedDek') }}</p>
      </div>

      <template v-else>
        <LoadingBlock v-if="loading" />

        <template v-else>
          <!-- Stats -->
          <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="panel p-6">
              <p class="label">{{ $t('quotes.title') }}</p>
              <p class="display-2">{{ quoteTotal }}</p>
            </div>
            <div class="panel p-6">
              <p class="label">{{ $t('links.title') }}</p>
              <p class="display-2">{{ linkTotal }}</p>
            </div>
            <div class="panel p-6">
              <p class="label">{{ $t('snippets.title') }}</p>
              <p class="display-2">{{ snippetTotal }}</p>
            </div>
          </div>

          <!-- Quotes -->
          <div class="mt-10 mb-4 flex items-center justify-between">
            <h2 class="display-2">{{ $t('quotes.title') }}</h2>
            <button class="btn btn-primary btn-sm" @click="addQuote">
              <Plus :size="16" /> {{ $t('quotes.addQuote') }}
            </button>
          </div>
          <div class="panel">
            <div
              v-for="q in recentQuotes"
              :key="q.id"
              class="flex items-center gap-3 border-t border-base-300 p-4 first:border-t-0"
            >
              <div class="min-w-0 flex-1">
                <p class="truncate font-medium">{{ q.content }}</p>
                <p class="text-ink-4 text-xs mt-1">
                  {{ q.author_name }} · {{ formatDateShort(q.created_at, locale) }}
                </p>
              </div>
              <div class="flex shrink-0 gap-1">
                <button class="btn btn-ghost btn-sm" @click="editQuote(q)">{{ $t('dashboard.edit') }}</button>
                <button class="btn btn-ghost btn-sm text-error" @click="removeQuote(q)">{{ $t('dashboard.delete') }}</button>
              </div>
            </div>
            <p v-if="!recentQuotes.length" class="p-4 text-ink-4 text-sm">{{ $t('dashboard.empty') }}</p>
          </div>

          <!-- Links -->
          <div class="mt-10 mb-4 flex items-center justify-between">
            <h2 class="display-2">{{ $t('links.title') }}</h2>
            <button class="btn btn-primary btn-sm" @click="addLink">
              <Plus :size="16" /> {{ $t('links.addLink') }}
            </button>
          </div>
          <div class="panel">
            <div
              v-for="l in recentLinks"
              :key="l.id"
              class="flex items-center gap-3 border-t border-base-300 p-4 first:border-t-0"
            >
              <div class="min-w-0 flex-1">
                <p class="truncate font-medium">{{ l.title }}</p>
                <p class="text-ink-4 text-xs mt-1">{{ hostname(l.url) }} · {{ formatDateShort(l.created_at, locale) }}</p>
              </div>
              <div class="flex shrink-0 gap-1">
                <button class="btn btn-ghost btn-sm" @click="editLink(l)">{{ $t('dashboard.edit') }}</button>
                <button class="btn btn-ghost btn-sm text-error" @click="removeLink(l)">{{ $t('dashboard.delete') }}</button>
              </div>
            </div>
            <p v-if="!recentLinks.length" class="p-4 text-ink-4 text-sm">{{ $t('dashboard.empty') }}</p>
          </div>

          <!-- Snippets -->
          <div class="mt-10 mb-4 flex items-center justify-between">
            <h2 class="display-2">{{ $t('snippets.title') }}</h2>
            <button class="btn btn-primary btn-sm" @click="addSnippet">
              <Plus :size="16" /> {{ $t('snippets.addSnippet') }}
            </button>
          </div>
          <div class="panel">
            <div
              v-for="s in recentSnippets"
              :key="s.id"
              class="flex items-center gap-3 border-t border-base-300 p-4 first:border-t-0"
            >
              <div class="min-w-0 flex-1">
                <p class="truncate font-medium">{{ s.title }}</p>
                <p class="text-ink-4 text-xs mt-1">{{ s.language }} · {{ formatDateShort(s.created_at, locale) }}</p>
              </div>
              <div class="flex shrink-0 gap-1">
                <button class="btn btn-ghost btn-sm" @click="editSnippet(s)">{{ $t('dashboard.edit') }}</button>
                <button class="btn btn-ghost btn-sm text-error" @click="removeSnippet(s)">{{ $t('dashboard.delete') }}</button>
              </div>
            </div>
            <p v-if="!recentSnippets.length" class="p-4 text-ink-4 text-sm">{{ $t('dashboard.empty') }}</p>
          </div>

          <!-- Feedback -->
          <div class="mt-10 mb-4 flex items-center justify-between">
            <h2 class="display-2">{{ $t('feedback.title') }}</h2>
          </div>
          <div class="panel">
            <div v-if="feedbackLoading" class="p-4 text-ink-4 text-sm">
              <span class="loading loading-spinner loading-sm"></span>
            </div>
            <template v-else>
              <div
                v-for="fb in feedbackItems"
                :key="fb.id"
                class="flex flex-col gap-2 border-t border-base-300 p-4 first:border-t-0"
              >
                <div class="flex items-center gap-2">
                  <span
                    class="badge badge-sm"
                    :class="fb.status === 'new' ? 'badge-primary' : 'badge-ghost'"
                  >
                    {{ fb.status === 'new' ? $t('feedback.statusNew') : $t('feedback.statusRead') }}
                  </span>
                  <span class="text-ink-4 text-xs">{{ formatDateShort(fb.created_at, locale) }}</span>
                </div>
                <p class="whitespace-pre-wrap break-words font-medium">{{ fb.message }}</p>
                <div v-if="fb.contact" class="text-ink-3 text-sm">
                  <a
                    v-if="looksLikeEmail(fb.contact)"
                    :href="`mailto:${fb.contact}`"
                    class="link link-hover"
                  >{{ fb.contact }}</a>
                  <span v-else>{{ fb.contact }}</span>
                </div>
                <a
                  v-if="fb.page_url"
                  :href="fb.page_url"
                  target="_blank"
                  rel="noopener"
                  class="text-ink-4 text-xs break-all hover:underline"
                >{{ fb.page_url }}</a>
                <div class="flex shrink-0 gap-1">
                  <button
                    class="btn btn-ghost btn-sm"
                    @click="toggleFeedbackStatus(fb)"
                  >
                    {{ fb.status === 'new' ? $t('feedback.statusRead') : $t('feedback.statusNew') }}
                  </button>
                  <button
                    class="btn btn-ghost btn-sm text-error"
                    @click="removeFeedback(fb)"
                  >
                    {{ $t('dashboard.delete') }}
                  </button>
                </div>
              </div>
              <p v-if="!feedbackItems.length" class="p-4 text-ink-4 text-sm">{{ $t('feedback.empty') }}</p>
            </template>
          </div>

          <!-- Editors -->
          <EditQuoteModal
            :show="showQuoteEdit"
            :quote="editingQuote"
            @close="showQuoteEdit = false"
            @updated="loadAll"
          />
          <LinkModal
            :show="showLinkEdit"
            :link="editingLink"
            @close="showLinkEdit = false"
            @saved="loadAll"
          />
          <SnippetFormModal
            :show="showSnippetEdit"
            :snippet="editingSnippet"
            @close="showSnippetEdit = false"
            @saved="loadAll"
          />
          <CreateQuoteModal
            :show="showQuoteCreate"
            @close="showQuoteCreate = false"
            @created="loadAll"
          />
        </template>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { Plus } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import EditQuoteModal from '@/components/EditQuoteModal.vue'
import LinkModal from '@/components/LinkModal.vue'
import SnippetFormModal from '@/components/SnippetFormModal.vue'
import CreateQuoteModal from '@/components/CreateQuoteModal.vue'
import { fetchQuotes, deleteQuote } from '@/services/quote'
import { fetchLinks, deleteLink } from '@/services/link'
import { fetchSnippets, deleteSnippet } from '@/services/snippet'
import { fetchFeedback, updateFeedbackStatus, deleteFeedback } from '@/services/feedback'
import type { Quote } from '@/types/quote'
import type { Link } from '@/services/link'
import type { Snippet } from '@/types/snippet'
import type { Feedback } from '@/types/feedback'
import { formatDateShort } from '@/lib/formatDate'

// Owner-only studio. The write APIs already enforce OWNER_USER_ID server-side;
// this email check only decides what the UI shows.
const OWNER_EMAIL = 'abuamar.albadawi@gmail.com'

const { t, locale } = useI18n()
const { user, isAuthenticated, openAuth } = useAuth()
const toast = useToast()

useHead({
  title: computed(() => t('head.dashboard.title')),
  meta: [
    { name: 'robots', content: 'noindex' },
    { name: 'description', content: computed(() => t('head.dashboard.dek')) },
    { property: 'og:title', content: computed(() => `${t('head.dashboard.title')} - Abu Amar`) },
    { property: 'og:description', content: computed(() => t('head.dashboard.dek')) },
  ],
})

const isOwner = computed(() => isAuthenticated.value && user.value?.email === OWNER_EMAIL)

const loading = ref(false)
const quoteTotal = ref(0)
const linkTotal = ref(0)
const snippetTotal = ref(0)
const recentQuotes = ref<Quote[]>([])
const recentLinks = ref<Link[]>([])
const recentSnippets = ref<Snippet[]>([])
const feedbackItems = ref<Feedback[]>([])
const feedbackLoading = ref(false)

async function loadAll() {
  if (!isOwner.value) return
  loading.value = true
  feedbackLoading.value = true
  try {
    const [q, l, s] = await Promise.all([
      fetchQuotes({ limit: 100 }),
      fetchLinks({ limit: 5 }),
      fetchSnippets({ limit: 5 }),
    ])
    quoteTotal.value = q.total || 0
    linkTotal.value = l.total || 0
    snippetTotal.value = s.total || 0
    // Quotes are served shuffled (ORDER BY random) for the public page;
    // fetch a wide page and sort here so "recent" is actually newest-first.
    recentQuotes.value = (q.quotes || [])
      .slice()
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
      .slice(0, 5)
    // Links and snippets are already created_at DESC from the API.
    recentLinks.value = l.links || []
    recentSnippets.value = s.snippets || []
  } catch {
    toast.error(t('dashboard.loadFailed'))
  } finally {
    loading.value = false
  }
  // Fetch feedback separately — it's read-only, failures shouldn't block the
  // rest of the dashboard.
  try {
    const fb = await fetchFeedback()
    feedbackItems.value = fb.feedback || []
  } catch {
    toast.error(t('feedback.loadFailed'))
  } finally {
    feedbackLoading.value = false
  }
}

watch(isOwner, (v) => { if (v) loadAll() }, { immediate: true })

const showQuoteEdit = ref(false)
const editingQuote = ref<Quote | null>(null)
function editQuote(q: Quote) {
  editingQuote.value = q
  showQuoteEdit.value = true
}

const showLinkEdit = ref(false)
const editingLink = ref<Link | null>(null)
function editLink(l: Link) {
  editingLink.value = l
  showLinkEdit.value = true
}

const showSnippetEdit = ref(false)
const editingSnippet = ref<Snippet | null>(null)
function editSnippet(s: Snippet) {
  editingSnippet.value = s
  showSnippetEdit.value = true
}

// ── Create (per-section "Tambah" buttons) ──
// Link and snippet modals double as their editors: a null target means
// create mode (their watch resets the form on open).
const showQuoteCreate = ref(false)

function addQuote() {
  showQuoteCreate.value = true
}

function addLink() {
  editingLink.value = null
  showLinkEdit.value = true
}

function addSnippet() {
  editingSnippet.value = null
  showSnippetEdit.value = true
}

async function removeQuote(q: Quote) {
  if (!confirm(t('quotes.deleteConfirm'))) return
  try {
    await deleteQuote(q.id)
    toast.success(t('quotes.deletedToast'))
    await loadAll()
  } catch {
    toast.error(t('quotes.deleteFailed'))
  }
}

async function removeLink(l: Link) {
  if (!confirm(t('links.deleteConfirm'))) return
  try {
    await deleteLink(l.id)
    toast.success(t('links.deletedToast'))
    await loadAll()
  } catch {
    toast.error(t('links.deleteFailed'))
  }
}

async function removeSnippet(s: Snippet) {
  if (!confirm(t('snippets.confirmDelete'))) return
  try {
    await deleteSnippet(s.id)
    toast.success(t('snippets.deletedToast'))
    await loadAll()
  } catch {
    toast.error(t('snippets.deleteFailed'))
  }
}

async function toggleFeedbackStatus(fb: Feedback) {
  const next = fb.status === 'new' ? 'read' : 'new'
  try {
    await updateFeedbackStatus(fb.id, next)
    fb.status = next
    toast.success(next === 'read' ? t('feedback.toggleReadToast') : t('feedback.toggleNewToast'))
  } catch {
    toast.error(t('feedback.toggleFailed'))
  }
}

async function removeFeedback(fb: Feedback) {
  if (!confirm(t('feedback.deleteConfirm'))) return
  try {
    await deleteFeedback(fb.id)
    toast.success(t('feedback.deletedToast'))
    feedbackItems.value = feedbackItems.value.filter(f => f.id !== fb.id)
  } catch {
    toast.error(t('feedback.deleteFailed'))
  }
}

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function hostname(url: string) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}
</script>
