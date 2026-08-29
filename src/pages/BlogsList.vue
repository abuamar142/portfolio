<template>
  <section class="pt-20 pb-16 min-h-screen" style="background: var(--color-surface)">
    <div class="max-w-3xl mx-auto px-6">
      <div class="mb-8">
        <router-link to="/" class="inline-flex items-center gap-1 text-xs mb-4 transition-colors duration-150" style="color: var(--color-text-muted)">
          &larr; Home
        </router-link>
        <h1 class="text-xl font-semibold tracking-tight mb-1" style="color: var(--color-text-primary)">Blog</h1>
        <p class="text-xs" style="color: var(--color-text-muted)">Thoughts, tutorials, and updates.</p>
      </div>

      <div class="mb-6 flex items-center gap-1.5 flex-wrap">
        <button @click="selectedCategory = ''" class="px-3 py-1 text-xs rounded transition-colors duration-150"
          :style="selectedCategory === '' ? { background: 'var(--color-accent)', color: 'white' } : { color: 'var(--color-text-muted)' }">All</button>
        <button v-for="cat in categories" :key="cat" @click="selectedCategory = selectedCategory === cat ? '' : cat"
          class="px-3 py-1 text-xs rounded transition-colors duration-150"
          :style="selectedCategory === cat ? { background: getCategoryColor(cat), color: 'white' } : { color: 'var(--color-text-muted)' }">{{ cat }}</button>
      </div>

      <div class="mb-6">
        <SearchInput v-model="searchQuery" :placeholder="'Search posts...'" :results-count="totalPosts" @update:model-value="onSearch" />
      </div>

      <div v-if="loading" class="space-y-4" role="status">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="h-3 rounded w-1/4 mb-2" style="background: var(--color-surface-overlay)"></div>
          <div class="h-4 rounded w-3/4 mb-2" style="background: var(--color-surface-overlay)"></div>
          <div class="h-3 rounded w-full" style="background: var(--color-surface-overlay)"></div>
        </div>
      </div>

      <div v-else-if="error" class="py-16" role="alert">
        <p class="text-sm mb-4" style="color: var(--color-error)">{{ error }}</p>
        <button @click="loadPosts" class="text-xs transition-colors duration-150" style="color: var(--color-text-muted)">Retry</button>
      </div>

      <div v-else-if="filteredPosts.length === 0" class="py-16">
        <p class="text-sm" style="color: var(--color-text-muted)">No posts found.</p>
      </div>

      <div v-else class="space-y-6">
        <article v-for="post in filteredPosts" :key="post._id" class="group">
          <router-link :to="`/blogs/${post.slug}`" class="block">
            <img v-if="getCoverUrl(post)" :src="getCoverUrl(post)" :alt="post.title" loading="lazy" class="w-full h-48 object-cover rounded-lg mb-3" />
            <div v-if="post.tags && post.tags.length" class="flex flex-wrap gap-1.5 mb-2">
              <span v-for="(tag, i) in post.tags.slice(0, 3)" :key="tag.tag || tag" class="text-[10px] font-mono px-1.5 py-0.5 rounded text-white"
                :style="{ background: getTagColor(i) }">{{ tag.tag || tag }}</span>
            </div>
            <h2 class="text-sm font-medium mb-1 transition-colors duration-150" style="color: var(--color-text-primary)">{{ post.title }}</h2>
            <div class="flex items-center gap-2 text-[11px] mb-1.5" style="color: var(--color-text-muted)">
              <span>{{ formatDate(post.publishedAt) }}</span><span>·</span><span>{{ estimateReadingTime(post) }} min</span>
            </div>
            <p class="text-xs leading-relaxed line-clamp-2" style="color: var(--color-text-muted)">{{ post.excerpt || 'No description available.' }}</p>
          </router-link>
        </article>
      </div>

      <div v-if="totalPages > 1" class="mt-10 flex justify-center">
        <nav class="flex items-center gap-1">
          <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)" class="px-2.5 py-1 text-xs rounded transition-colors duration-150"
            :style="currentPage === 1 ? { color: 'var(--color-text-muted)', cursor: 'not-allowed' } : { color: 'var(--color-text-muted)' }">&larr;</button>
          <button v-for="page in totalPages" :key="page" @click="goToPage(page)" class="px-2.5 py-1 text-xs rounded transition-colors duration-150"
            :style="page === currentPage ? { background: 'var(--color-accent)', color: 'white' } : { color: 'var(--color-text-muted)' }">{{ page }}</button>
          <button :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)" class="px-2.5 py-1 text-xs rounded transition-colors duration-150"
            :style="currentPage === totalPages ? { color: 'var(--color-text-muted)', cursor: 'not-allowed' } : { color: 'var(--color-text-muted)' }">&rarr;</button>
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
const categoryColors: Record<string, string> = { 'Mobile': '#7C3AED', 'Web': '#2563EB', 'Backend': '#059669', 'DevOps': '#EA580C', 'Tools': '#DB2777' }
const getCategoryColor = (cat: string) => categoryColors[cat] || '#7C3AED'
const totalPages = computed(() => Math.max(1, Math.ceil(totalPosts.value / postsPerPage)))
const filteredPosts = computed(() => {
  if (!selectedCategory.value) return posts.value
  const cat = selectedCategory.value.toLowerCase()
  return posts.value.filter(p => { const tags = (p.tags || []).map((t: any) => (t.tag || t).toLowerCase()); return tags.some((t: string) => t.includes(cat)) || (p.title || '').toLowerCase().includes(cat) })
})
async function loadPosts() {
  try { loading.value = true; error.value = ''; const r = await listPublished({ search: searchQuery.value, limit: postsPerPage, offset: (currentPage.value - 1) * postsPerPage }); posts.value = r.posts; totalPosts.value = r.total }
  catch (e: any) { error.value = e?.message || 'Failed to load posts' } finally { loading.value = false }
}
function onSearch() { currentPage.value = 1; loadPosts() }
function goToPage(p: number) { if (p < 1 || p > totalPages.value) return; currentPage.value = p; loadPosts(); window.scrollTo({ top: 0, behavior: 'smooth' }) }
function estimateReadingTime(post: any) { return Math.max(1, Math.ceil((post.excerpt || post.contentHtml || '').split(/\s+/).length / 200)) }
function formatDate(iso?: string | null) { if (!iso) return ''; try { return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) } catch { return String(iso) } }
function getCoverUrl(post: any) { return post.coverImage?.url }
const tagColors = ['#7C3AED', '#2563EB', '#059669', '#EA580C', '#DB2777', '#0D9488']
function getTagColor(i: number) { return tagColors[i % tagColors.length] }
onMounted(loadPosts)
</script>
