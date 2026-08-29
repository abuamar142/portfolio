<template>
  <section class="pt-20 pb-16 bg-surface min-h-screen">
    <div class="max-w-3xl mx-auto px-6">
      <!-- Header -->
      <div class="mb-8">
        <router-link to="/" class="inline-flex items-center gap-1 text-text-muted hover:text-accent text-xs mb-4 transition-colors duration-150">
          &larr; Home
        </router-link>
        <h1 class="text-xl font-semibold text-text-primary tracking-tight mb-1">Blog</h1>
        <p class="text-text-muted text-xs">Thoughts, tutorials, and updates.</p>
      </div>

      <!-- Filter chips with colors -->
      <div class="mb-6 flex items-center gap-1.5 flex-wrap">
        <button
          @click="selectedCategory = ''"
          class="px-3 py-1 text-xs rounded transition-colors duration-150"
          :class="selectedCategory === ''
            ? 'bg-accent text-white'
            : 'text-text-muted hover:text-text-primary hover:bg-surface-overlay'"
        >
          All
        </button>
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = selectedCategory === cat ? '' : cat"
          class="px-3 py-1 text-xs rounded transition-colors duration-150"
          :class="selectedCategory === cat
            ? 'text-white'
            : 'text-text-muted hover:text-text-primary hover:bg-surface-overlay'"
          :style="selectedCategory === cat ? { background: getCategoryColor(cat) } : {}"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Search -->
      <div class="mb-6">
        <SearchInput
          v-model="searchQuery"
          :placeholder="'Search posts...'"
          :results-count="totalPosts"
          @update:model-value="onSearch"
        />
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="space-y-4" role="status" aria-label="Loading posts">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="h-3 bg-surface-overlay rounded w-1/4 mb-2"></div>
          <div class="h-4 bg-surface-overlay rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-surface-overlay rounded w-full"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="py-16" role="alert">
        <p class="text-error text-sm mb-4">{{ error }}</p>
        <button @click="loadPosts" class="text-xs text-text-muted hover:text-accent transition-colors duration-150">
          Retry
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredPosts.length === 0" class="py-16" role="status">
        <p class="text-text-muted text-sm">No posts found.</p>
      </div>

      <!-- Posts -->
      <div v-else class="space-y-6">
        <article
          v-for="post in filteredPosts"
          :key="post._id"
          class="group"
        >
          <router-link :to="`/blogs/${post.slug}`" class="block">
            <!-- Cover Image -->
            <img
              v-if="getCoverUrl(post)"
              :src="getCoverUrl(post)"
              :alt="post.title"
              loading="lazy"
              class="w-full h-48 object-cover rounded-lg mb-3"
            />

            <!-- Tags with colors -->
            <div v-if="post.tags && post.tags.length" class="flex flex-wrap gap-1.5 mb-2">
              <span
                v-for="(tag, tagIndex) in post.tags.slice(0, 3)"
                :key="tag.tag || tag"
                class="text-[10px] font-mono px-1.5 py-0.5 rounded"
                :style="{ background: getTagColor(tag.tag || tag, tagIndex), color: 'white' }"
              >
                {{ tag.tag || tag }}
              </span>
            </div>

            <!-- Title -->
            <h2 class="text-sm font-medium text-text-primary group-hover:text-accent transition-colors duration-150 mb-1">
              {{ post.title }}
            </h2>

            <!-- Meta -->
            <div class="flex items-center gap-2 text-[11px] text-text-muted mb-1.5">
              <span>{{ formatDate(post.publishedAt) }}</span>
              <span>·</span>
              <span>{{ estimateReadingTime(post) }} min</span>
            </div>

            <!-- Excerpt -->
            <p class="text-text-muted text-xs leading-relaxed line-clamp-2">
              {{ post.excerpt || 'No description available.' }}
            </p>
          </router-link>
        </article>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-10 flex justify-center">
        <nav class="flex items-center gap-1" aria-label="Pagination">
          <button
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
            class="px-2.5 py-1 text-xs rounded transition-colors duration-150"
            :class="currentPage === 1
              ? 'text-text-muted cursor-not-allowed'
              : 'text-text-muted hover:text-text-primary hover:bg-surface-overlay'"
            aria-label="Previous page"
          >
            &larr;
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            class="px-2.5 py-1 text-xs rounded transition-colors duration-150"
            :class="page === currentPage
              ? 'bg-accent text-white'
              : 'text-text-muted hover:text-text-primary hover:bg-surface-overlay'"
          >
            {{ page }}
          </button>
          <button
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
            class="px-2.5 py-1 text-xs rounded transition-colors duration-150"
            :class="currentPage === totalPages
              ? 'text-text-muted cursor-not-allowed'
              : 'text-text-muted hover:text-text-primary hover:bg-surface-overlay'"
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

const categoryColors: Record<string, string> = {
  'Mobile': '#7C3AED',
  'Web': '#3B82F6',
  'Backend': '#10B981',
  'DevOps': '#F97316',
  'Tools': '#EC4899',
}

const getCategoryColor = (cat: string): string => {
  return categoryColors[cat] || '#7C3AED'
}

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

const tagColors = ['#7C3AED', '#3B82F6', '#10B981', '#F97316', '#EC4899', '#14B8A6']

function getTagColor(tag: string, index: number): string {
  return tagColors[index % tagColors.length]
}

onMounted(loadPosts)
</script>
