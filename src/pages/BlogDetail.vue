<template>
  <section class="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 bg-dracula-background overflow-hidden">
    <div class="relative max-w-3xl mx-auto px-4 sm:px-6">
      <div v-if="loading" class="text-center text-dracula-comment">Loading...</div>
      <div v-else-if="error" class="text-center text-red-400">{{ error }}</div>

      <article v-else>
        <h1 class="text-3xl sm:text-4xl font-bold text-dracula-foreground font-mono mb-2">{{ post?.title }}</h1>
        <div class="text-dracula-comment mb-6">{{ formatDate(post?.publishedAt) }}</div>
        <div v-if="coverUrl" class="mb-6">
          <img :src="coverUrl" alt="cover" class="w-full rounded border border-gray-600" />
        </div>
        <div class="blog-content max-w-none text-dracula-foreground leading-relaxed space-y-4" v-html="contentHtml"></div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePosts } from '@/composables/usePosts'

const route = useRoute()
const slug = route.params.slug as string
const { getBySlug } = usePosts()

const post = ref<any | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    loading.value = true
    post.value = await getBySlug(slug)
    if (!post.value || (post.value.status === 'draft')) {
      throw new Error('Not found')
    }
  } catch (e: any) {
    error.value = 'Post not found'
  } finally {
    loading.value = false
  }
})

const contentHtml = computed(() => {
  if (!post.value) return ''
  return post.value.contentHtml || ''
})

const coverUrl = computed(() => {
  if (!post.value?.coverImage) return ''
  return typeof post.value.coverImage === 'object' ? post.value.coverImage.url : ''
})

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
</script>

