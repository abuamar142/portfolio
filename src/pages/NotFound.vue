<template>
  <section class="min-h-screen bg-dracula-background flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <div class="text-8xl font-mono font-bold text-dracula-purple mb-4">404</div>
      <h1 class="text-2xl font-bold text-dracula-foreground mb-2 font-mono">Page not found</h1>
      <p class="text-dracula-comment mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <router-link
        to="/"
        class="inline-flex items-center gap-2 px-6 py-3 bg-dracula-purple text-dracula-background rounded-lg hover:bg-dracula-pink transition-colors font-mono"
      >
        ← Back to home
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
