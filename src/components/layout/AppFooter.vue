<template>
  <footer class="bg-white dark:bg-dark-900 border-t border-gray-100 dark:border-gray-800">
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div class="text-center space-y-4">
        <p class="text-gray-600 dark:text-gray-400">
          © {{ new Date().getFullYear() }} {{ portfolioData.personalInfo.name }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-500">
          Built with Vue.js, TypeScript, and Tailwind CSS
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { portfolioData } from '@/data/portfolio'
</script>
