<template>
  <footer
    class="bg-dracula-selection dark:bg-gray-950 border-t border-gray-200 dark:border-gray-500 transition-colors"
  >
    <div class="max-w-6xl mx-auto px-6 py-12">
      <div class="text-center space-y-6">
        <!-- Code-style footer -->
        <div class="font-mono text-sm space-y-2">
          <div class="text-gray-500 dark:text-gray-400">
            <span class="text-green-600 dark:text-code-comment"
              >// Terima kasih sudah berkunjung!</span
            >
          </div>
          <div class="text-gray-800 dark:text-gray-300">
            <span class="text-code-keyword">const</span>
            <span class="text-code-variable"> footer</span>
            <span class="text-code-text"> = {</span>
          </div>
          <div class="pl-4 text-gray-300">
            <span class="text-code-text">year: </span>
            <span class="text-code-string">{{ new Date().getFullYear() }}</span>
            <span class="text-code-text">,</span>
          </div>
          <div class="pl-4 text-gray-300">
            <span class="text-code-text">author: </span>
            <span class="text-code-string">'{{ portfolioData.personalInfo.fullname }}'</span>
            <span class="text-code-text">,</span>
          </div>
          <div class="pl-4 text-gray-300">
            <span class="text-code-text">tech: [</span>
            <span class="text-code-string">'Vue.js'</span>
            <span class="text-code-text">, </span>
            <span class="text-code-string">'TypeScript'</span>
            <span class="text-code-text">, </span>
            <span class="text-code-string">'Tailwind'</span>
            <span class="text-code-text">],</span>
          </div>
          <div class="pl-4 text-gray-300">
            <span class="text-code-text">coffee: </span>
            <span class="text-code-keyword">true</span>
          </div>
          <div class="text-gray-300">
            <span class="text-code-text">};</span>
          </div>
        </div>

        <!-- Copyright -->
        <div class="pt-4 border-t border-gray-500">
          <p class="text-gray-400 text-sm">
            © {{ new Date().getFullYear() }} {{ portfolioData.personalInfo.fullname }}.
            <span class="text-gray-500">Dibuat dengan ❤️ dan banyak ☕</span>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { portfolioData } from '@/data/portfolio'
</script>
