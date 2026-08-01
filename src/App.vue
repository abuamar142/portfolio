<template>
  <div id="app" class="min-h-screen flex flex-col bg-dracula-background">
    <AppHeader />
    <main class="flex-1">
      <router-view />
    </main>
    <AppFooter />
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
