<template>
  <section class="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 bg-dracula-background overflow-hidden">
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6">
      <!-- Header -->
      <div class="text-center mb-8 sm:mb-12">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-dracula-foreground font-mono">Blogs</h1>
        <p class="mt-4 text-dracula-comment">Latest posts and updates</p>
      </div>

      <!-- Search -->
      <div class="mb-8 flex flex-col items-center gap-2">
        <SearchInput
          v-model="searchQuery"
          :placeholder="'Search posts...'"
          :results-count="totalPosts"
          @update:model-value="onSearch"
        />
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8" role="status" aria-label="Loading posts">
        <div v-for="i in 4" :key="i" class="bg-dracula-selection border border-gray-500 rounded-lg overflow-hidden animate-pulse">
          <div class="h-48 bg-gray-600"></div>
          <div class="p-6 space-y-4">
            <div class="h-6 bg-gray-600 rounded w-3/4"></div>
            <div class="h-4 bg-gray-600 rounded w-1/4"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-600 rounded"></div>
              <div class="h-4 bg-gray-600 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16" role="alert">
        <div class="text-6xl mb-4">⚠️</div>
        <p class="text-red-400 text-lg mb-4">{{ error }}</p>
        <button @click="loadPosts" class="px-4 py-2 bg-dracula-purple text-white rounded hover:bg-dracula-purple/80 transition-colors">
          Retry
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="posts.length === 0" class="text-center py-16" role="status">
        <div class="text-6xl mb-4">📝</div>
        <p class="text-dracula-comment text-lg">No posts yet.</p>
        <p class="text-dracula-comment text-sm mt-2">Check back later for updates!</p>
      </div>

      <!-- Posts Grid + Pagination -->
      <template v-else>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <article
          v-for="post in posts"
          :key="post._id"
          class="group bg-dracula-selection border border-gray-500 rounded-lg overflow-hidden hover:border-dracula-purple/50 hover:shadow-glow transition-all duration-300"
        >
          <!-- Cover Image -->
          <router-link v-if="getCoverUrl(post)" :to="`/blogs/${post.slug}`" class="block">
            <img
              :src="getCoverUrl(post)"
              :alt="post.title"
              loading="lazy"
              class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </router-link>

          <!-- Content -->
          <div class="p-6">
            <!-- Tags -->
            <div v-if="post.tags && post.tags.length" class="flex flex-wrap gap-2 mb-3">
              <span
                v-for="tag in post.tags.slice(0, 3)"
                :key="tag.tag || tag"
                class="px-2 py-1 text-xs font-mono bg-dracula-purple/20 text-dracula-purple border border-dracula-purple/30 rounded"
              >
                {{ tag.tag || tag }}
              </span>
            </div>

            <!-- Title -->
            <router-link :to="`/blogs/${post.slug}`">
              <h2 class="text-xl font-bold text-dracula-foreground mb-2 font-mono group-hover:text-dracula-purple transition-colors">
                {{ post.title }}
              </h2>
            </router-link>

            <!-- Date -->
            <div class="flex items-center gap-2 text-sm text-dracula-comment mb-3">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatDate(post.publishedAt) }}</span>
            </div>

            <!-- Excerpt -->
            <p class="text-dracula-foreground/80 text-sm leading-relaxed mb-4 line-clamp-3">
              {{ post.excerpt || 'No description available.' }}
            </p>

            <!-- Read More -->
            <router-link
              :to="`/blogs/${post.slug}`"
              class="inline-flex items-center gap-2 text-dracula-purple hover:text-dracula-pink font-mono text-sm transition-colors"
            >
              Read more
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </router-link>
          </div>
        </article>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-10 flex flex-col items-center gap-3">
        <p class="text-sm text-dracula-comment font-mono">
          Page {{ currentPage }} of {{ totalPages }}
        </p>
        <nav class="flex items-center gap-1" aria-label="Pagination">
          <button
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
            class="px-3 py-1.5 text-sm font-mono rounded border transition-colors duration-200"
            :class="currentPage === 1
              ? 'border-gray-600 text-gray-600 cursor-not-allowed'
              : 'border-dracula-purple text-dracula-purple hover:bg-dracula-purple hover:text-white'"
          >
            &laquo;
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            class="px-3 py-1.5 text-sm font-mono rounded border transition-colors duration-200"
            :class="page === currentPage
              ? 'bg-dracula-purple text-white border-dracula-purple'
              : 'border-gray-500 text-dracula-foreground hover:border-dracula-purple hover:text-dracula-purple'"
          >
            {{ page }}
          </button>
          <button
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
            class="px-3 py-1.5 text-sm font-mono rounded border transition-colors duration-200"
            :class="currentPage === totalPages
              ? 'border-gray-600 text-gray-600 cursor-not-allowed'
              : 'border-dracula-purple text-dracula-purple hover:bg-dracula-purple hover:text-white'"
          >
            &raquo;
          </button>
        </nav>
      </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useHead } from '@vueuse/head'
import { usePosts } from '@/composables/usePosts'
import SearchInput from '@/components/ui/SearchInput.vue'

useHead({
  title: 'Blogs',
  meta: [
    { property: 'og:title', content: 'Blogs | Abu Amar' },
    { property: 'og:description', content: 'Latest posts and updates from Abu Amar.' },
    { property: 'og:type', content: 'website' },
  ],
})

const { listPublished, loading, errorMsg } = usePosts()
const posts = ref<any[]>([])
const error = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const totalPosts = ref(0)
const postsPerPage = 6

const totalPages = computed(() => Math.max(1, Math.ceil(totalPosts.value / postsPerPage)))

async function loadPosts() {
  try {
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

onMounted(loadPosts)

function formatDate(iso?: string | null) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
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
</script>
