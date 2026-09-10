<template>
  <section id="blogs" class="page-top">
    <div class="wrap pb-20 md:pb-28">
      <SectionHeader level="h1" :label="$t('navigation.blog')" :title="$t('headings.blog')">
        <template #meta>
          <p class="font-mono text-[11px] uppercase tracking-wider text-ink-4">
            {{ totalPosts }} {{ $t('blog.posts') }}
          </p>
        </template>
      </SectionHeader>

      <!-- Category filter -->
      <div class="flex flex-wrap items-center gap-2">
        <span class="eyebrow mr-1">{{ $t('blog.filters.label') }}</span>
        <button
          type="button"
          class="chip min-h-11 px-4 transition-colors"
          :class="
            selectedCategory === ''
              ? 'chip-accent'
              : 'hover:border-base-content/25 hover:text-base-content'
          "
          :aria-pressed="selectedCategory === ''"
          @click="selectedCategory = ''"
        >
          {{ $t('blog.filters.all') }}
        </button>
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          class="chip min-h-11 px-4 transition-colors"
          :class="
            selectedCategory === cat
              ? 'chip-accent'
              : 'hover:border-base-content/25 hover:text-base-content'
          "
          :aria-pressed="selectedCategory === cat"
          @click="selectedCategory = selectedCategory === cat ? '' : cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Search -->
      <div class="mt-6">
        <SearchInput
          v-model="searchQuery"
          :placeholder="$t('blog.searchPlaceholder')"
          @update:model-value="onSearch"
        />
      </div>

      <!-- Loading -->
      <div v-if="loading" class="mt-12 border-t border-base-300" role="status">
        <div v-for="i in 3" :key="i" class="row animate-pulse py-6">
          <div class="h-3 w-24 rounded-full bg-base-300"></div>
          <div class="mt-4 h-5 w-3/4 rounded bg-base-300"></div>
          <div class="mt-3 h-3 w-full rounded bg-base-200"></div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="panel mt-12 p-8 text-center" role="alert">
        <p class="text-base-content">{{ $t('blog.error') }}</p>
        <p class="mt-2 font-mono text-[11px] text-ink-3">{{ error }}</p>
        <BaseButton class="mt-6" variant="outline" size="sm" @click="loadPosts">
          {{ $t('blog.retry') }}
        </BaseButton>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredPosts.length === 0" class="panel mt-12 p-8 text-center">
        <p class="text-ink-2">{{ $t('blog.noResults') }}</p>
      </div>

      <!-- Posts -->
      <ul v-else class="mt-12 border-t border-base-300">
        <li v-for="post in filteredPosts" :key="post._id" class="row">
          <router-link :to="`/blogs/${post.slug}`" class="group block py-6">
            <div v-if="post.tags && post.tags.length" class="flex flex-wrap gap-2">
              <span v-for="tag in post.tags.slice(0, 3)" :key="tag.tag || tag" class="chip">
                {{ tag.tag || tag }}
              </span>
            </div>
            <h2
              class="mt-3 font-display text-xl leading-snug tracking-tight text-base-content transition-colors group-hover:text-primary"
            >
              {{ post.title }}
            </h2>
            <p class="mt-2 font-mono text-[11px] uppercase tracking-wider text-ink-3">
              <time :datetime="post.publishedAt">{{ formatDate(post.publishedAt) }}</time>
              <span aria-hidden="true"> · </span>
              {{ estimateReadingTime(post) }} {{ $t('blog.readTimeShort') }}
            </p>
            <p v-if="post.excerpt" class="mt-3 line-clamp-2 max-w-[72ch] text-sm leading-relaxed text-ink-2">
              {{ post.excerpt }}
            </p>
          </router-link>
        </li>
      </ul>

      <!-- Pagination -->
      <nav
        v-if="totalPages > 1"
        class="mt-12 flex flex-wrap items-center justify-center gap-1"
        :aria-label="$t('navigation.blog')"
      >
        <button
          type="button"
          class="btn btn-square h-11 w-11"
          :disabled="currentPage === 1"
          :aria-label="$t('blog.previous')"
          @click="goToPage(currentPage - 1)"
        >
          <ArrowLeft class="size-4" aria-hidden="true" />
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          type="button"
          class="btn h-11 min-w-11 font-mono"
          :class="page === currentPage ? 'btn-primary' : 'btn-ghost'"
          :aria-current="page === currentPage ? 'page' : undefined"
          :aria-label="`${$t('blog.page')} ${page}`"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button
          type="button"
          class="btn btn-square h-11 w-11"
          :disabled="currentPage === totalPages"
          :aria-label="$t('blog.next')"
          @click="goToPage(currentPage + 1)"
        >
          <ArrowRight class="size-4" aria-hidden="true" />
        </button>
      </nav>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onServerPrefetch, ref, watch } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
import { usePosts } from '@/composables/usePosts'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import SearchInput from '@/components/ui/SearchInput.vue'

// — Per-page SEO head (baked into the prerendered HTML + SPA client) —
// Overrides App.vue's `| Abu Amar` titleTemplate so the title is exactly
// "Blog — Abu Amar" without doubling the site name.
useHead({
  title: 'Blog — Abu Amar',
  titleTemplate: '%s',
  meta: [
    { name: 'description', content: 'Blog by Abu Amar — tutorials, notes, and updates on mobile & full-stack development.' },
    { property: 'og:title', content: 'Blog — Abu Amar' },
    { property: 'og:description', content: 'Tutorials, notes, and updates on mobile & full-stack development.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://abuamar.online/blogs' },
  ],
})

const { locale } = useI18n()
const { listPublished } = usePosts()
const posts = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const totalPosts = ref(0)
const postsPerPage = 6
const categories = ['Mobile', 'Web', 'Backend', 'DevOps', 'Tools']

const totalPages = computed(() => Math.max(1, Math.ceil(totalPosts.value / postsPerPage)))
const filteredPosts = computed(() => {
  if (!selectedCategory.value) return posts.value
  const cat = selectedCategory.value.toLowerCase()
  return posts.value.filter((p) => {
    const tags = (p.tags || []).map((t: any) => (t.tag || t).toLowerCase())
    return tags.some((t: string) => t.includes(cat)) || (p.title || '').toLowerCase().includes(cat)
  })
})
async function loadPosts() {
  try {
    loading.value = true
    error.value = ''
    const r = await listPublished({
      locale: locale.value,
      search: searchQuery.value,
      limit: postsPerPage,
      offset: (currentPage.value - 1) * postsPerPage,
    })
    posts.value = r.posts
    totalPosts.value = r.total
  } catch (e: any) {
    error.value = e?.message || 'Failed to load posts'
  } finally {
    loading.value = false
  }
}

// — Prerender-time data fetch —
// onServerPrefetch runs only during SSG/SSR: the first page of posts is
// fetched at build time so the prerendered /blogs HTML contains the post
// links. The try/catch keeps an API hiccup from failing the build. On the
// client this hook never fires — the existing onMounted flow below keeps the
// loading/empty states working as before.
onServerPrefetch(async () => {
  try {
    await loadPosts()
  } catch {
    // loadPosts already captured the error state; never fail the prerender.
  }
})
function onSearch() {
  currentPage.value = 1
  loadPosts()
}
function goToPage(p: number) {
  if (p < 1 || p > totalPages.value) return
  currentPage.value = p
  loadPosts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function estimateReadingTime(post: any) {
  return Math.max(1, Math.ceil((post.excerpt || post.contentHtml || '').split(/\s+/).length / 200))
}
function formatDate(iso?: string | null) {
  if (!iso) return ''
  try {
    const dateLocale = locale.value === 'en' ? 'en-US' : 'id-ID'
    return new Date(iso).toLocaleDateString(dateLocale, { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return String(iso)
  }
}
watch(locale, () => {
  currentPage.value = 1
  loadPosts()
})
onMounted(loadPosts)
</script>
