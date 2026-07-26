<template>
  <section class="relative min-h-screen py-12 sm:py-16 lg:py-20 bg-dracula-background overflow-hidden">
    <div class="absolute inset-0">
      <div class="absolute top-20 left-4 sm:left-10 w-64 h-64 sm:w-96 sm:h-96 bg-dracula-purple/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-4 sm:right-10 w-56 h-56 sm:w-80 sm:h-80 bg-dracula-pink/10 rounded-full blur-3xl"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
      <div class="text-center mb-6 sm:mb-8">
        <div class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-dracula-purple to-dracula-pink text-dracula-background mb-6 shadow-glow">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 sm:w-8 sm:h-8">
            <path d="M7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" />
          </svg>
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-dracula-foreground font-mono">Blogs</h1>
        <p class="mt-4 text-dracula-comment">Latest posts and updates</p>
      </div>

      <div class="flex items-center justify-end mb-8">
        <router-link to="/admin" class="px-4 py-2 rounded bg-dracula-purple text-dracula-foreground hover:bg-dracula-pink transition-colors font-mono">
          create blog
        </router-link>
      </div>

      <div v-if="posts.length === 0" class="text-center text-dracula-comment">
        <p>No blog posts yet. Visit <router-link to="/admin" class="text-dracula-purple underline">Admin</router-link> to create one.</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <article
          v-for="post in posts"
          :key="post.id"
          class="bg-dracula-selection border border-gray-500 rounded-lg p-6 sm:p-8 hover:border-dracula-purple/50 hover:shadow-glow transition-all duration-300"
        >
          <h2 class="text-2xl font-bold text-dracula-foreground mb-3 font-mono hover:text-dracula-purple transition-colors">
            {{ post.title }}
          </h2>
          <div class="flex items-center gap-3 text-sm text-dracula-comment mb-4">
            <span>{{ formatDate(post.createdAt) }}</span>
            <span v-if="!post.published" class="px-2 py-0.5 rounded bg-dracula-purple/20 border border-dracula-purple/40 text-dracula-purple">Draft</span>
          </div>
          <p class="text-dracula-foreground mb-4">{{ post.summary }}</p>
          <div class="flex flex-wrap gap-2 mb-6">
            <span v-for="tag in post.tags" :key="tag" class="px-3 py-1 bg-dracula-purple/20 border border-dracula-purple/30 text-dracula-purple text-sm rounded-full font-mono">{{ tag }}</span>
          </div>
          <details class="group">
            <summary class="cursor-pointer text-dracula-purple hover:underline">Read more</summary>
            <div class="mt-3 prose prose-invert max-w-none text-dracula-foreground whitespace-pre-line">
              {{ post.content }}
            </div>
          </details>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBlogs } from '@/composables/useBlogs'

const { publishedPosts } = useBlogs()
const posts = computed(() => publishedPosts.value)

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return iso
  }
}
</script>
