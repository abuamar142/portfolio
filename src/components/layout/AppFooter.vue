<template>
  <footer class="bg-dracula-background border-t border-dracula-comment">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <!-- Left: Copyright -->
        <p class="text-dracula-comment text-sm font-mono">
          © {{ new Date().getFullYear() }} {{ portfolio?.personalInfo?.fullname || 'Abu Amar' }}
        </p>

        <!-- Center: Social links -->
        <div class="flex items-center gap-4">
          <a
            v-for="social in socialLinks"
            :key="social.label"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-dracula-comment hover:text-dracula-purple transition-colors"
            :aria-label="social.label"
          >
            <component :is="social.icon" class="w-4 h-4" />
          </a>
        </div>

        <!-- Right: Built with -->
        <p class="text-dracula-comment text-xs font-mono">
          Built with <span class="text-dracula-purple">Vue</span> + <span class="text-dracula-purple">Vite</span>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { markRaw } from 'vue'
import { Github, Linkedin, Instagram, Mail } from 'lucide-vue-next'
import { usePortfolio } from '@/composables/usePortfolio'

const { portfolio } = usePortfolio()

const socialLinks = [
  { label: 'GitHub', url: 'https://github.com/abuamar142', icon: markRaw(Github) },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/abu-amar', icon: markRaw(Linkedin) },
  { label: 'Instagram', url: 'https://instagram.com/abuuamar_', icon: markRaw(Instagram) },
  { label: 'Email', url: 'mailto:abuamar.albadawi@gmail.com', icon: markRaw(Mail) },
]
</script>
