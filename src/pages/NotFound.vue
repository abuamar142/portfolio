<template>
  <section class="min-h-screen bg-surface flex items-center justify-center px-4">
    <div class="text-center">
      <div class="text-6xl font-semibold text-text-primary mb-4 tracking-tighter">404</div>
      <p class="text-text-muted text-sm mb-6">Page not found.</p>
      <router-link
        to="/"
        class="text-xs text-text-muted hover:text-text-primary transition-colors duration-150"
      >
        &larr; Home
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
