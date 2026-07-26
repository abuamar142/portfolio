<template>
  <div id="app" class="min-h-screen bg-dracula-background">
    <AppHeader />
    <main>
      <router-view />
    </main>
    <AppFooter class="relative" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

onMounted(() => {
  // Initialize Dracula theme
  document.documentElement.classList.remove('dark')
})
</script>
