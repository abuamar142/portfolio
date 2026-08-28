<template>
  <section class="pt-24 pb-20 bg-surface min-h-screen">
    <div class="max-w-4xl mx-auto px-6">
      <!-- Header -->
      <div class="mb-10">
        <router-link to="/" class="inline-flex items-center gap-2 text-text-muted hover:text-text-primary text-sm mb-6 transition-colors duration-200">
          &larr; Back to home
        </router-link>
        <h1 class="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-2">Blog</h1>
        <p class="text-text-muted text-sm">Thoughts, tutorials, and updates.</p>
      </div>

      <!-- Search + Filter -->
      <div class="mb-8 flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <SearchInput
            v-model="searchQuery"
            :placeholder="'Search posts...'"
            :results-count="totalPosts"
            @update:model-value="onSearch"
          />
        </div>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategory = selectedCategory === cat ? '' : cat"
            class="px-3 py-1.5 text-xs rounded-full border transition-colors duration-200"
            :class="selectedCategory === cat
              ? 'bg-accent text-white border-accent'
              : 'border-border text-text-muted hover:border-text-muted hover:text-text-primary'"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="space-y-4" role="status" aria-label="Loading posts">
        <div v-for="i in 3" :key="i" class="bg-surface-raised border border-border rounded-xl p-5 animate-pulse">
          <div class="flex gap-4">
            <div class="w-28 h-20 bg-surface-overlay rounded-lg flex-shrink-0"></div>
            <div class="flex-1 space-y-3">
              <div class="h-4 bg-surface-overlay rounded w-3/4"></div>
              <div class="h-3 bg-surface-overlay rounded w-1/4"></div>
              <div class="h-3 bg-surface-overlay rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16" role="alert">
        <p class="text-error text-lg mb-4">{{ error }}</p>
        <button @click="loadPosts" class="px-5 py-2.5 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors duration-200 text-sm font-medium">
          Retry
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredPosts.length === 0" class="text-center py-16" role="status">
        <p class="text-text-muted text-lg">No posts found.</p>
        <p class="text-text-muted text-sm mt-2">Check back later for updates!</p>
      </div>

      <!-- Posts -->
      <div v-else class="space-y-4">
        <article
          v-for="post in filteredPosts"
          :key="post._id"
          class="group bg-surface-raised border border-border rounded-xl overflow-hidden hover:border-accent/30 transition-all duration-200"
        >
          <router-link :to="`/blogs/${post.slug}`" class="flex flex-col sm:flex-row gap-4 p-5">
            <!-- Cover Image -->
            <img
              v-if="getCoverUrl(post)"
              :src="getCoverUrl(post)"
              :alt="post.title"
              loading="lazy"
              class="w-full sm:w-36 h-28 sm:h-24 object-cover rounded-lg"
            />

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <!-- Tags -->
              <div v-if="post.tags && post.tags.length" class="flex flex-wrap gap-2 mb-2">
                <span
                  v-for="tag in post.tags.slice(0, 3)"
                  :key="tag.tag || tag"
                  class="px-2 py-0.5 text-xs bg-accent-subtle text-accent rounded"
                >
                  {{ tag.tag || tag }}
                </span>
              </div>

              <!-- Title -->
              <h2 class="text-base font-semibold text-text-primary group-hover:text-accent transition-colors duration-200 mb-1 line-clamp-1">
                {{ post.title }}
              </h2>

              <!-- Meta -->
              <div class="flex items-center gap-3 text-xs text-text-muted mb-1.5">
                <span>{{ formatDate(post.publishedAt) }}</span>
                <span>&middot;</span>
                <span>{{ estimateReadingTime(post) }} min read</span>
              </div>

              <!-- Excerpt -->
              <p class="text-text-muted text-sm leading-relaxed line-clamp-2">
                {{ post.excerpt || 'No description available.' }}
              </p>
            </div>
          </router-link>
        </article>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-10 flex justify-center">
        <nav class="flex items-center gap-1" aria-label="Pagination">
          <button
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
            class="px-3 py-1.5 text-sm rounded border transition-colors duration-200"
            :class="currentPage === 1
              ? 'border-border text-text-muted cursor-not-allowed'
              : 'border-border text-text-muted hover:border-text-muted hover:text-text-primary'"
            aria-label="Previous page"
          >
            &larr;
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            class="px-3 py-1.5 text-sm rounded border transition-colors duration-200"
            :class="page === currentPage
              ? 'bg-accent text-white border-accent'
              : 'border-border text-text-muted hover:border-text-muted hover:text-text-primary'"
          >
            {{ page }}
          </button>
          <button
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
            class="px-3 py-1.5 text-sm rounded border transition-colors duration-200"
            :class="currentPage === totalPages
              ? 'border-border text-text-muted cursor-not-allowed'
              : 'border-border text-text-muted hover:border-text-muted hover:text-text-primary'"
            aria-label="Next page"
          >
            &rarr;
          </button>
        </nav>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useHead } from '@vueuse/head'
import { usePosts } from '@/composables/usePosts'
import SearchInput from '@/components/ui/SearchInput.vue'

useHead({
  title: 'Blog | Abu Amar',
  meta: [
    { property: 'og:title', content: 'Blog | Abu Amar' },
    { property: 'og:description', content: 'Thoughts, tutorials, and updates from Abu Amar.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})

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
  return posts.value.filter(post => {
    const tags = (post.tags || []).map((t: any) => (t.tag || t).toLowerCase())
    const title = (post.title || '').toLowerCase()
    const excerpt = (post.excerpt || '').toLowerCase()
    return tags.some((t: string) => t.includes(cat)) || title.includes(cat) || excerpt.includes(cat)
  })
})

async function loadPosts() {
  try {
    loading.value = true
    error.value = ''
    const offset = (currentPage.value - 1) * postsPerPage
    const result = await listPublished({
      search: searchQuery.value,
      limit: postsPerPage,
      offset,
    })
    posts.value = result.posts
    totalPosts.value = result.total
  } catch (e: any) {
    error.value = e?.message || 'Failed to load posts'
  } finally {
    loading.value = false
  }
}

function onSearch() {
  currentPage.value = 1
  loadPosts()
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  loadPosts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function estimateReadingTime(post: any): number {
  const text = post.excerpt || post.contentHtml || ''
  const words = text.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

function formatDate(iso?: string | null): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch { return String(iso) }
}

function getCoverUrl(post: any): string | undefined {
  if (post.coverImage && typeof post.coverImage === 'object' && post.coverImage.url) {
    return post.coverImage.url
  }
  return undefined
}

onMounted(loadPosts)
</script>
