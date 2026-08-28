<template>
  <section class="min-h-screen bg-surface flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <div class="text-8xl font-bold text-text-primary mb-4">404</div>
      <h1 class="text-2xl font-semibold text-text-primary mb-2">Page not found</h1>
      <p class="text-text-muted mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <router-link
        to="/"
        class="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors duration-200 text-sm font-medium"
      >
        &larr; Back to home
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'

useHead({
  title: '404 | Abu Amar',
})
</script>
