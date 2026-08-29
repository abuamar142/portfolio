<template>
  <section class="pt-14 min-h-screen" style="background: var(--color-bg)">
    <div class="max-w-[1280px] mx-auto px-6 md:px-8 py-10 md:py-12">
      <router-link
        to="/blogs"
        class="inline-flex items-center gap-1.5 text-xs font-mono mb-8 transition-colors"
        style="color: var(--color-text-faint)"
      >
        ← All posts
      </router-link>

      <div v-if="loading" class="max-w-[720px] space-y-4">
        <div class="h-4 rounded w-3/4 animate-pulse" style="background: var(--color-surface-raised)"></div>
        <div class="h-3 rounded w-1/4 animate-pulse" style="background: var(--color-surface-raised)"></div>
        <div class="h-64 rounded-xl animate-pulse" style="background: var(--color-surface)"></div>
      </div>

      <div v-else-if="error" class="max-w-[720px] py-12 rounded-xl border p-8" style="background: var(--color-surface); border-color: var(--color-border)">
        <p class="text-sm mb-4" style="color: var(--color-error)">{{ error }}</p>
        <router-link to="/blogs" class="text-xs font-mono" style="color: var(--color-text-muted)">← Back to blog</router-link>
      </div>

      <article v-else class="grid lg:grid-cols-[720px_1fr] gap-10 lg:gap-12 items-start">
        <div class="min-w-0">
          <div v-if="post?.tags?.length" class="flex flex-wrap gap-1.5 mb-4">
            <span
              v-for="(tag, i) in post.tags"
              :key="tag.tag || tag"
              class="text-[11px] font-mono tracking-wide px-2.5 py-1 rounded-full border"
              :style="{ borderColor: 'var(--color-border)', background: 'var(--color-surface-raised)', color: 'var(--color-text-muted)' }"
            >
              {{ tag.tag || tag }}
            </span>
          </div>

          <h1 class="text-[26px] md:text-[32px] font-semibold tracking-tighter leading-[1.05]" style="color: var(--color-text-primary); letter-spacing: -0.03em">
            {{ post?.title }}
          </h1>

          <div class="flex flex-wrap items-center gap-3 text-xs font-mono mt-4 pb-6 border-b" style="color: var(--color-text-faint); border-color: var(--color-border)">
            <time :datetime="post?.publishedAt">{{ formatDate(post?.publishedAt) }}</time>
            <span>·</span>
            <span>{{ readingTime }} min read</span>
            <span v-if="post?.tags?.length" class="hidden sm:inline">·</span>
            <span v-if="post?.tags?.length" class="hidden sm:inline truncate max-w-[260px]">{{ (post.tags || []).map((t:any)=>t.tag||t).join(', ') }}</span>
          </div>

          <div v-if="coverUrl" class="mt-6 mb-8 rounded-xl overflow-hidden border" style="border-color: var(--color-border)">
            <img :src="coverUrl" :alt="post?.title" loading="lazy" class="w-full object-cover" />
          </div>

          <div class="blog-content max-w-none" v-html="contentHtml"></div>

          <div class="mt-12 pt-6 border-t flex items-center justify-between" style="border-color: var(--color-border)">
            <router-link to="/blogs" class="text-xs font-mono inline-flex items-center gap-1.5" style="color: var(--color-text-muted)">← More posts</router-link>
            <span class="text-[11px] font-mono" style="color: var(--color-text-faint)">Share — copy link</span>
          </div>
        </div>

        <!-- Right meta — sticky TOC placeholder -->
        <div class="hidden lg:block sticky top-20">
          <div class="rounded-xl border p-5" style="background: var(--color-surface); border-color: var(--color-border)">
            <div class="text-[11px] font-mono tracking-[0.14em] uppercase mb-3" style="color: var(--color-text-faint)">On this page</div>
            <div class="text-xs leading-relaxed" style="color: var(--color-text-muted)">
              Dark slate reading experience — max 65ch measure, 1.75 line height.
            </div>
            <div class="mt-4 pt-4 border-t space-y-2" style="border-color: var(--color-border)">
              <div class="text-[11px] font-mono" style="color: var(--color-text-faint)">Published</div>
              <div class="text-xs" style="color: var(--color-text-secondary)">{{ formatDate(post?.publishedAt) }}</div>
              <div class="text-[11px] font-mono mt-3" style="color: var(--color-text-faint)">Reading time</div>
              <div class="text-xs" style="color: var(--color-text-secondary)">{{ readingTime }} minutes</div>
            </div>
          </div>
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
  title: computed(() => (post.value ? `${post.value.title} | Abu Amar` : 'Blog Post')),
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

function formatDate(iso?: string | null) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return String(iso)
  }
}

onMounted(async () => {
  try {
    loading.value = true
    post.value = await getBySlug(slug.value)
    if (!post.value || post.value.status === 'draft') throw new Error('Not found')
  } catch {
    error.value = 'Post not found'
  } finally {
    loading.value = false
  }
})
</script>
