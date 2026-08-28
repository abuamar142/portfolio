<template>
  <section class="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 bg-dracula-background min-h-screen">
    <div class="relative max-w-4xl mx-auto px-4 sm:px-6">
      <!-- Header -->
      <div class="mb-10">
        <router-link to="/" class="inline-flex items-center gap-2 text-dracula-comment hover:text-dracula-purple font-mono text-sm mb-4 transition-colors">
          ← Back to home
        </router-link>
        <h1 class="text-3xl sm:text-4xl font-bold text-dracula-foreground font-mono mb-2">Blog</h1>
        <p class="text-dracula-comment">Thoughts, tutorials, and updates.</p>
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
            class="px-3 py-1.5 text-xs font-mono rounded-full border transition-colors"
            :class="selectedCategory === cat
              ? 'bg-dracula-purple text-dracula-background border-dracula-purple'
              : 'border-dracula-comment text-dracula-comment hover:border-dracula-purple hover:text-dracula-purple'"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="space-y-6" role="status" aria-label="Loading posts">
        <div v-for="i in 3" :key="i" class="bg-dracula-selection border border-dracula-current rounded-lg p-6 animate-pulse">
          <div class="flex gap-4">
            <div class="w-32 h-24 bg-dracula-current rounded flex-shrink-0"></div>
            <div class="flex-1 space-y-3">
              <div class="h-5 bg-dracula-current rounded w-3/4"></div>
              <div class="h-4 bg-dracula-current rounded w-1/4"></div>
              <div class="h-4 bg-dracula-current rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16" role="alert">
        <p class="text-dracula-red text-lg mb-4">{{ error }}</p>
        <button @click="loadPosts" class="px-4 py-2 bg-dracula-purple text-dracula-background rounded-lg hover:bg-dracula-pink transition-colors">
          Retry
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredPosts.length === 0" class="text-center py-16" role="status">
        <p class="text-dracula-comment text-lg">No posts found.</p>
        <p class="text-dracula-comment text-sm mt-2">Check back later for updates!</p>
      </div>

      <!-- Posts -->
      <div v-else class="space-y-6">
        <article
          v-for="post in filteredPosts"
          :key="post._id"
          class="group bg-dracula-selection border border-dracula-current rounded-lg overflow-hidden hover:border-dracula-purple/50 transition-all duration-300"
        >
          <router-link :to="`/blogs/${post.slug}`" class="flex flex-col sm:flex-row gap-4 p-6">
            <!-- Cover Image -->
            <img
              v-if="getCoverUrl(post)"
              :src="getCoverUrl(post)"
              :alt="post.title"
              loading="lazy"
              class="w-full sm:w-40 h-32 sm:h-24 object-cover rounded group-hover:scale-105 transition-transform duration-300"
            />

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <!-- Tags -->
              <div v-if="post.tags && post.tags.length" class="flex flex-wrap gap-2 mb-2">
                <span
                  v-for="tag in post.tags.slice(0, 3)"
                  :key="tag.tag || tag"
                  class="px-2 py-0.5 text-xs font-mono bg-dracula-purple/10 text-dracula-purple border border-dracula-purple/20 rounded"
                >
                  {{ tag.tag || tag }}
                </span>
              </div>

              <!-- Title -->
              <h2 class="text-lg font-bold text-dracula-foreground font-mono group-hover:text-dracula-purple transition-colors mb-1 line-clamp-1">
                {{ post.title }}
              </h2>

              <!-- Meta -->
              <div class="flex items-center gap-3 text-xs text-dracula-comment mb-2">
                <span>{{ formatDate(post.publishedAt) }}</span>
                <span>·</span>
                <span>{{ estimateReadingTime(post) }} min read</span>
              </div>

              <!-- Excerpt -->
              <p class="text-dracula-comment text-sm leading-relaxed line-clamp-2">
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
            class="px-3 py-1.5 text-sm font-mono rounded border transition-colors"
            :class="currentPage === 1
              ? 'border-dracula-current text-dracula-current cursor-not-allowed'
              : 'border-dracula-comment text-dracula-comment hover:border-dracula-purple hover:text-dracula-purple'"
            aria-label="Previous page"
          >
            ←
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            class="px-3 py-1.5 text-sm font-mono rounded border transition-colors"
            :class="page === currentPage
              ? 'bg-dracula-purple text-dracula-background border-dracula-purple'
              : 'border-dracula-current text-dracula-comment hover:border-dracula-purple hover:text-dracula-purple'"
          >
            {{ page }}
          </button>
          <button
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
            class="px-3 py-1.5 text-sm font-mono rounded border transition-colors"
            :class="currentPage === totalPages
              ? 'border-dracula-current text-dracula-current cursor-not-allowed'
              : 'border-dracula-comment text-dracula-comment hover:border-dracula-purple hover:text-dracula-purple'"
            aria-label="Next page"
          >
            →
          </button>
        </nav>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
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
