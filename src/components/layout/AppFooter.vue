<template>
  <footer class="border-t border-border-subtle">
    <div class="max-w-5xl mx-auto px-6 py-8">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <!-- Copyright -->
        <p class="text-text-muted text-sm">
          &copy; {{ new Date().getFullYear() }} {{ portfolio?.personalInfo?.fullname || 'Abu Amar' }}
        </p>

        <!-- Social links as text -->
        <div class="flex items-center gap-5">
          <a
            v-for="social in socialLinks"
            :key="social.label"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-text-muted text-sm hover:text-text-primary transition-colors duration-200"
          >
            {{ social.label }}
          </a>
        </div>

        <!-- Built with -->
        <p class="text-text-muted text-sm">
          Built with <span class="text-text-secondary">Vue</span> + <span class="text-text-secondary">Vite</span>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { usePortfolio } from '@/composables/usePortfolio'

const { portfolio } = usePortfolio()

const socialLinks = [
  { label: 'GitHub', url: 'https://github.com/abuamar142' },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/abu-amar' },
  { label: 'Instagram', url: 'https://instagram.com/abuuamar_' },
  { label: 'Email', url: 'mailto:abuamar.albadawi@gmail.com' },
]
</script>
