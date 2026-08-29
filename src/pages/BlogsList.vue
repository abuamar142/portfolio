<template>
  <section class="pt-14 min-h-screen" style="background: var(--color-bg)">
    <div class="max-w-[1280px] mx-auto px-6 md:px-8 py-10 md:py-12">
      <!-- Header -->
      <div class="flex flex-wrap items-start justify-between gap-6 mb-8 border-b pb-8" style="border-color: var(--color-border)">
        <div>
          <router-link
            to="/"
            class="inline-flex items-center gap-1.5 text-xs font-mono mb-4 transition-colors"
            style="color: var(--color-text-faint)"
          >
            ← Home
          </router-link>
          <div class="text-[11px] font-mono tracking-[0.14em] uppercase mb-2" style="color: var(--color-text-faint)">Writing — FIG_003</div>
          <h1 class="text-[28px] md:text-[32px] font-semibold tracking-tighter leading-none" style="color: var(--color-text-primary); letter-spacing: -0.03em">Blog</h1>
          <p class="mt-2 text-sm leading-relaxed max-w-[520px]" style="color: var(--color-text-muted)">Thoughts, tutorials, and updates. Monochrome list, generous whitespace.</p>
        </div>
        <div class="hidden md:block text-xs font-mono" style="color: var(--color-text-faint)">{{ totalPosts }} posts</div>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap items-center gap-2 mb-6">
        <span class="text-[11px] font-mono tracking-wide mr-1" style="color: var(--color-text-faint)">Filter:</span>
        <button
          @click="selectedCategory = ''"
          class="px-3 py-1.5 text-xs font-mono rounded-full border transition-colors"
          :style="selectedCategory === '' ? { background: 'var(--color-text-primary)', color: 'var(--color-bg)', borderColor: 'var(--color-text-primary)' } : { background: 'var(--color-surface)', color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }"
        >
          All
        </button>
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = selectedCategory === cat ? '' : cat"
          class="px-3 py-1.5 text-xs font-mono rounded-full border transition-colors"
          :style="selectedCategory === cat ? { background: 'var(--color-surface-raised)', color: 'var(--color-text-primary)', borderColor: 'var(--color-border-contrast)' } : { background: 'var(--color-surface)', color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }"
        >
          {{ cat }}
        </button>
      </div>

      <div class="mb-8 max-w-md">
        <SearchInput v-model="searchQuery" placeholder="Search posts..." :results-count="totalPosts" @update:model-value="onSearch" />
      </div>

      <!-- States -->
      <div v-if="loading" class="space-y-6" role="status">
        <div v-for="i in 3" :key="i" class="rounded-xl border p-5 animate-pulse" style="background: var(--color-surface); border-color: var(--color-border)">
          <div class="h-3 rounded w-1/5 mb-3" style="background: var(--color-surface-raised)"></div>
          <div class="h-4 rounded w-3/4 mb-2" style="background: var(--color-surface-raised)"></div>
          <div class="h-3 rounded w-full" style="background: var(--color-surface-overlay)"></div>
        </div>
      </div>

      <div v-else-if="error" class="py-12 rounded-xl border p-8 text-center" style="background: var(--color-surface); border-color: var(--color-border)" role="alert">
        <p class="text-sm mb-4" style="color: var(--color-error)">{{ error }}</p>
        <button @click="loadPosts" class="px-4 py-2 rounded-lg border text-xs font-medium" style="border-color: var(--color-border); color: var(--color-text-secondary); background: var(--color-surface-raised)">Retry</button>
      </div>

      <div v-else-if="filteredPosts.length === 0" class="py-12 rounded-xl border p-8 text-center" style="background: var(--color-surface); border-color: var(--color-border)">
        <p class="text-sm" style="color: var(--color-text-muted)">No posts found.</p>
      </div>

      <!-- List — victoreke writing list: title + meta + excerpt, subtle border -->
      <div v-else class="border-t" style="border-color: var(--color-border)">
        <article
          v-for="post in filteredPosts"
          :key="post._id"
          class="group grid md:grid-cols-[1fr_220px] gap-4 md:gap-6 py-6 border-b transition-colors hover:brightness-[1.02]"
          style="border-color: var(--color-border)"
        >
          <router-link :to="`/blogs/${post.slug}`" class="block min-w-0">
            <div v-if="post.tags && post.tags.length" class="flex flex-wrap gap-1.5 mb-2">
              <span
                v-for="(tag, i) in post.tags.slice(0, 3)"
                :key="tag.tag || tag"
                class="text-[10px] font-mono tracking-wide px-2 py-1 rounded-full border"
                :style="{ borderColor: 'var(--color-border)', background: 'var(--color-surface-raised)', color: 'var(--color-text-muted)' }"
              >
                {{ tag.tag || tag }}
              </span>
            </div>
            <h2 class="text-[16px] md:text-[17px] font-medium tracking-tight leading-tight group-hover:underline underline-offset-4 decoration-1" style="color: var(--color-text-primary); text-decoration-color: var(--color-border-contrast)">
              {{ post.title }}
            </h2>
            <div class="flex items-center gap-2 text-xs font-mono mt-2" style="color: var(--color-text-faint)">
              <span>{{ formatDate(post.publishedAt) }}</span><span>·</span><span>{{ estimateReadingTime(post) }} min</span>
            </div>
            <p class="text-sm leading-relaxed mt-2 line-clamp-2 max-w-[62ch]" style="color: var(--color-text-muted)">{{ post.excerpt || 'No description available.' }}</p>
          </router-link>
          <router-link :to="`/blogs/${post.slug}`" class="hidden md:block">
            <div v-if="getCoverUrl(post)" class="w-full h-28 rounded-lg overflow-hidden border" style="border-color: var(--color-border); background: var(--color-surface-raised)">
              <img :src="getCoverUrl(post)" :alt="post.title" loading="lazy" class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
            </div>
            <div v-else class="w-full h-28 rounded-lg border flex items-center justify-center" style="border-color: var(--color-border); background: var(--color-surface)">
              <span class="text-[11px] font-mono" style="color: var(--color-text-faint)">No cover</span>
            </div>
          </router-link>
        </article>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-10 flex justify-center">
        <nav class="flex items-center gap-1.5">
          <button
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
            class="w-8 h-8 inline-flex items-center justify-center rounded-full border text-xs transition-colors disabled:opacity-40"
            :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', background: 'var(--color-surface)' }"
          >
            ←
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            class="w-8 h-8 inline-flex items-center justify-center rounded-full border text-xs font-mono transition-colors"
            :style="page === currentPage ? { background: 'var(--color-text-primary)', color: 'var(--color-bg)', borderColor: 'var(--color-text-primary)' } : { background: 'var(--color-surface)', color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }"
          >
            {{ page }}
          </button>
          <button
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
            class="w-8 h-8 inline-flex items-center justify-center rounded-full border text-xs transition-colors disabled:opacity-40"
            :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', background: 'var(--color-surface)' }"
          >
            →
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

useHead({ title: 'Blog | Abu Amar', meta: [{ property: 'og:title', content: 'Blog | Abu Amar' }] })

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
    const r = await listPublished({ search: searchQuery.value, limit: postsPerPage, offset: (currentPage.value - 1) * postsPerPage })
    posts.value = r.posts
    totalPosts.value = r.total
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
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return String(iso)
  }
}
function getCoverUrl(post: any) {
  return post.coverImage?.url
}
onMounted(loadPosts)
</script>
