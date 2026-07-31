<template>
  <section class="relative py-12 sm:py-16 lg:py-20 bg-dracula-background overflow-hidden">
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6">
      <div class="text-center mb-6 sm:mb-8">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-dracula-foreground font-mono">Blogs</h1>
        <p class="mt-4 text-dracula-comment">Latest posts and updates</p>
      </div>

      <div v-if="loading" class="text-center text-dracula-comment">Loading...</div>
      <div v-else-if="error" class="text-center text-red-400">{{ error }}</div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <article
          v-for="post in posts"
          :key="post.id"
          class="bg-dracula-selection border border-gray-500 rounded-lg p-6 sm:p-8 hover:border-dracula-purple/50 hover:shadow-glow transition-all duration-300"
        >
          <router-link :to="`/blogs/${post.slug}`">
            <h2 class="text-2xl font-bold text-dracula-foreground mb-3 font-mono hover:text-dracula-purple transition-colors">
              {{ post.title }}
            </h2>
          </router-link>
          <div class="flex items-center gap-3 text-sm text-dracula-comment mb-4">
            <span>{{ formatDate(post.published_at) }}</span>
          </div>
          <div v-if="post.cover_image_url" class="mb-4">
            <img :src="post.cover_image_url" alt="cover" class="w-full h-48 object-cover rounded border border-gray-600" />
          </div>
          <p class="text-dracula-foreground" v-html="excerpt(post.content_html)"></p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePosts } from '@/composables/usePosts'

const { listPublished } = usePosts()
const posts = ref<any[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    loading.value = true
    posts.value = await listPublished({})
  } catch (e: any) {
    error.value = e?.message || 'Failed to load posts'
  } finally {
    loading.value = false
  }
})

function formatDate(iso?: string | null) {
  if (!iso) return ''
  try { return new Date(iso).toLocaleDateString() } catch { return String(iso) }
}

function excerpt(html?: string | null) {
  if (!html) return ''
  const text = html.replace(/<[^>]+>/g, '')
  return text.length > 160 ? text.slice(0, 160) + '…' : text
}
</script>

