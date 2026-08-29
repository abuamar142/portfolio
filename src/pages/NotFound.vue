<template>
  <section class="min-h-screen flex items-center justify-center px-4" style="background: var(--color-surface)">
    <div class="text-center">
      <div class="text-6xl font-semibold mb-4 tracking-tighter gradient-text">404</div>
      <p class="text-sm mb-6" style="color: var(--color-text-muted)">Page not found.</p>
      <router-link to="/" class="text-xs transition-colors duration-150" style="color: var(--color-text-muted)">&larr; Home</router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
useHead({ title: '404 | Abu Amar' })
</script>
