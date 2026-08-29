<template>
  <!-- Loading State -->
  <div
    v-if="loading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-surface"
  >
    <div class="text-center">
      <div class="animate-spin rounded-full h-6 w-6 border border-border border-t-accent mx-auto mb-3"></div>
      <p class="text-text-muted text-xs">Loading...</p>
    </div>
  </div>

  <!-- Error State -->
  <div
    v-else-if="error"
    class="fixed inset-0 z-50 flex items-center justify-center bg-surface"
  >
    <div class="text-center">
      <p class="text-text-muted text-sm mb-4">Failed to load portfolio data</p>
      <button
        @click="reloadPage"
        class="px-4 py-2 border border-border text-text-secondary rounded-lg hover:text-text-primary hover:border-text-muted transition-colors duration-150 text-xs"
      >
        Retry
      </button>
    </div>
  </div>

  <!-- Main Content -->
  <section
    v-else
    id="hero"
    class="min-h-[70vh] flex items-center bg-surface scroll-mt-14"
  >
    <div class="max-w-3xl mx-auto px-6 py-20 w-full">
      <!-- Name with gradient -->
      <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight mb-2">
        <span class="gradient-text">{{ portfolio?.personalInfo.nickname || 'Abu Amar' }}</span>
      </h1>

      <!-- Role -->
      <p class="text-text-secondary text-sm mb-6">
        {{ currentRole }}
      </p>

      <!-- Bio -->
      <p class="text-text-muted text-sm leading-relaxed mb-8 max-w-lg">
        {{ portfolio?.personalInfo.title || '' }}. Building mobile and web applications with a focus on clean code and user experience.
      </p>

      <!-- Social Links with colors -->
      <div class="flex items-center gap-4">
        <a
          v-for="social in socialLinks"
          :key="social.label"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="transition-colors duration-150"
          :class="social.color"
          :aria-label="social.label"
        >
          <component :is="social.icon" class="w-4 h-4" />
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Github, Linkedin, Instagram, Mail } from 'lucide-vue-next'
import { usePortfolio } from '@/composables/usePortfolio'

const { portfolio, loading, error } = usePortfolio()

const currentRole = ref('')

const roles = [
  'Mobile Developer',
  'Full Stack Developer',
  'Software Engineer',
]

const socialLinks = [
  { label: 'GitHub', url: 'https://github.com/abuamar142', icon: Github, color: 'text-text-muted hover:text-text-primary' },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/abu-amar', icon: Linkedin, color: 'text-text-muted hover:text-[#0A66C2]' },
  { label: 'Instagram', url: 'https://instagram.com/abuuamar_', icon: Instagram, color: 'text-text-muted hover:text-[#E4405F]' },
  { label: 'Email', url: 'mailto:abuamar.albadawi@gmail.com', icon: Mail, color: 'text-text-muted hover:text-accent' },
]

let roleIndex = 0
let charIndex = 0
let isDeleting = false
let typeTimer: ReturnType<typeof setTimeout> | null = null

const typeRole = () => {
  const role = roles[roleIndex]

  if (isDeleting) {
    currentRole.value = role.substring(0, charIndex - 1)
    charIndex--
  } else {
    currentRole.value = role.substring(0, charIndex + 1)
    charIndex++
  }

  let typeSpeed = isDeleting ? 50 : 100

  if (!isDeleting && charIndex === role.length) {
    typeSpeed = 2000
    isDeleting = true
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false
    roleIndex = (roleIndex + 1) % roles.length
  }

  typeTimer = setTimeout(typeRole, typeSpeed)
}

onMounted(() => {
  typeRole()
})

onUnmounted(() => {
  if (typeTimer) {
    clearTimeout(typeTimer)
    typeTimer = null
  }
})

const reloadPage = () => {
  window.location.reload()
}
</script>
