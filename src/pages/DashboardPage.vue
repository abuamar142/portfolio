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
          <h2 class="display-2 mt-10 mb-4">{{ $t('quotes.title') }}</h2>
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
          <h2 class="display-2 mt-10 mb-4">{{ $t('links.title') }}</h2>
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
          <h2 class="display-2 mt-10 mb-4">{{ $t('snippets.title') }}</h2>
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
        </template>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import EditQuoteModal from '@/components/EditQuoteModal.vue'
import LinkModal from '@/components/LinkModal.vue'
import SnippetFormModal from '@/components/SnippetFormModal.vue'
import { fetchQuotes, deleteQuote } from '@/services/quote'
import { fetchLinks, deleteLink } from '@/services/link'
import { fetchSnippets, deleteSnippet } from '@/services/snippet'
import type { Quote } from '@/types/quote'
import type { Link } from '@/services/link'
import type { Snippet } from '@/types/snippet'
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

async function loadAll() {
  if (!isOwner.value) return
  loading.value = true
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
}

watch(isOwner, (v) => { if (v) loadAll() }, { immediate: true })

// ── Editors ──
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

// ── Deletes ──
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

function hostname(url: string) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}
</script>
