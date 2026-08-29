<template>
  <section class="pt-20 pb-16 min-h-screen" style="background: var(--color-surface)">
    <div class="max-w-3xl mx-auto px-6">
      <router-link to="/blogs" class="inline-flex items-center gap-1 text-xs mb-8 transition-colors duration-150" style="color: var(--color-text-muted)">&larr; All posts</router-link>

      <div v-if="loading" class="space-y-4">
        <div class="h-4 rounded w-3/4 animate-pulse" style="background: var(--color-surface-overlay)"></div>
        <div class="h-3 rounded w-1/4 animate-pulse" style="background: var(--color-surface-overlay)"></div>
        <div class="h-48 rounded-lg animate-pulse" style="background: var(--color-surface-overlay)"></div>
      </div>

      <div v-else-if="error" class="py-20">
        <p class="text-sm mb-4" style="color: var(--color-error)">{{ error }}</p>
        <router-link to="/blogs" class="text-xs transition-colors duration-150" style="color: var(--color-text-muted)">&larr; Back to blog</router-link>
      </div>

      <article v-else>
        <div v-if="post?.tags?.length" class="flex flex-wrap gap-1.5 mb-3">
          <span v-for="(tag, i) in post.tags" :key="tag.tag || tag" class="text-[10px] font-mono px-1.5 py-0.5 rounded text-white"
            :style="{ background: getTagColor(i) }">{{ tag.tag || tag }}</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-semibold tracking-tight mb-3 leading-tight" style="color: var(--color-text-primary)">{{ post?.title }}</h1>
        <div class="flex items-center gap-2 text-xs mb-6" style="color: var(--color-text-muted)">
          <time :datetime="post?.publishedAt">{{ formatDate(post?.publishedAt) }}</time><span>·</span><span>{{ readingTime }} min read</span>
        </div>
        <div v-if="coverUrl" class="mb-8"><img :src="coverUrl" :alt="post?.title" loading="lazy" class="w-full rounded-lg" /></div>
        <div class="blog-content max-w-none leading-relaxed" v-html="contentHtml" style="color: var(--color-text-secondary)"></div>
        <div class="mt-12 pt-6 border-t" style="border-color: var(--color-border)">
          <router-link to="/blogs" class="text-xs transition-colors duration-150" style="color: var(--color-text-muted)">&larr; More posts</router-link>
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

useHead({
  title: computed(() => post.value ? `${post.value.title} | Abu Amar` : 'Blog Post'),
  meta: computed(() => [
    { property: 'og:title', content: post.value?.title || 'Blog Post' },
    { property: 'og:description', content: post.value?.excerpt || 'Blog post by Abu Amar' },
    { property: 'og:type', content: 'article' },
  ]),
})

const contentHtml = computed(() => post.value?.contentHtml || '')
const coverUrl = computed(() => post.value?.coverImage?.url || '')
const readingTime = computed(() => {
  if (!post.value) return 0
  const words = (post.value.contentHtml || post.value.excerpt || '').replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
})

function formatDate(iso?: string | null) { if (!iso) return ''; try { return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) } catch { return String(iso) } }
const tagColors = ['#7C3AED', '#2563EB', '#059669', '#EA580C', '#DB2777', '#0D9488']
function getTagColor(i: number) { return tagColors[i % tagColors.length] }

onMounted(async () => {
  try { loading.value = true; post.value = await getBySlug(slug.value); if (!post.value || post.value.status === 'draft') throw new Error('Not found') }
  catch { error.value = 'Post not found' } finally { loading.value = false }
})
</script>
