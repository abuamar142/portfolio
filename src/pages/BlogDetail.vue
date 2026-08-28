<template>
  <section class="pt-24 pb-20 bg-surface min-h-screen">
    <div class="max-w-3xl mx-auto px-6">
      <!-- Back link -->
      <router-link to="/blogs" class="inline-flex items-center gap-2 text-text-muted hover:text-text-primary text-sm mb-8 transition-colors duration-200">
        &larr; All posts
      </router-link>

      <!-- Loading -->
      <div v-if="loading" class="space-y-6">
        <div class="h-7 bg-surface-overlay rounded w-3/4 animate-pulse"></div>
        <div class="h-4 bg-surface-overlay rounded w-1/4 animate-pulse"></div>
        <div class="h-56 bg-surface-overlay rounded-lg animate-pulse"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20" role="alert">
        <p class="text-error text-lg mb-4">{{ error }}</p>
        <router-link to="/blogs" class="text-accent hover:text-accent-hover text-sm transition-colors duration-200">
          &larr; Back to blog
        </router-link>
      </div>

      <!-- Article -->
      <article v-else>
        <!-- Tags -->
        <div v-if="post?.tags?.length" class="flex flex-wrap gap-2 mb-4">
          <span
            v-for="tag in post.tags"
            :key="tag.tag || tag"
            class="px-2 py-0.5 text-xs bg-accent-subtle text-accent rounded"
          >
            {{ tag.tag || tag }}
          </span>
        </div>

        <!-- Title -->
        <h1 class="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-4 leading-tight">
          {{ post?.title }}
        </h1>

        <!-- Meta -->
        <div class="flex items-center gap-3 text-sm text-text-muted mb-8">
          <time :datetime="post?.publishedAt">{{ formatDate(post?.publishedAt) }}</time>
          <span>&middot;</span>
          <span>{{ readingTime }} min read</span>
        </div>

        <!-- Cover Image -->
        <div v-if="coverUrl" class="mb-8">
          <img
            :src="coverUrl"
            :alt="post?.title"
            loading="lazy"
            class="w-full rounded-xl border border-border"
          />
        </div>

        <!-- Content -->
        <div class="blog-content max-w-none text-text-secondary leading-relaxed" v-html="contentHtml"></div>

        <!-- Footer -->
        <div class="mt-12 pt-8 border-t border-border">
          <router-link to="/blogs" class="text-accent hover:text-accent-hover text-sm transition-colors duration-200">
            &larr; More posts
          </router-link>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { usePosts } from '@/composables/usePosts'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const { getBySlug } = usePosts()

const post = ref<any | null>(null)
const loading = ref(true)
const error = ref('')

const siteUrl = 'https://abuamar.online'

useHead({
  title: computed(() => post.value ? `${post.value.title} | Abu Amar` : 'Blog Post'),
  meta: computed(() => [
    { property: 'og:title', content: post.value?.title || 'Blog Post' },
    { property: 'og:description', content: post.value?.excerpt || 'Blog post by Abu Amar' },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: `${siteUrl}/blogs/${slug.value}` },
    { property: 'article:published_time', content: post.value?.publishedAt || '' },
    { property: 'article:author', content: 'Abu Amar' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: post.value?.title || 'Blog Post' },
    { name: 'twitter:description', content: post.value?.excerpt || 'Blog post by Abu Amar' },
  ]),
  link: computed(() => [
    { rel: 'canonical', href: `${siteUrl}/blogs/${slug.value}` },
  ]),
})

const contentHtml = computed(() => {
  if (!post.value) return ''
  return post.value.contentHtml || ''
})

const coverUrl = computed(() => {
  if (!post.value?.coverImage) return ''
  return typeof post.value.coverImage === 'object' ? post.value.coverImage.url : ''
})

const readingTime = computed(() => {
  if (!post.value) return 0
  const text = post.value.contentHtml || post.value.excerpt || ''
  const words = text.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
})

function formatDate(iso?: string | null): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch { return String(iso) }
}

onMounted(async () => {
  try {
    loading.value = true
    post.value = await getBySlug(slug.value)
    if (!post.value || (post.value.status === 'draft')) {
      throw new Error('Not found')
    }
  } catch (e: any) {
    error.value = 'Post not found'
  } finally {
    loading.value = false
  }
})
</script>
