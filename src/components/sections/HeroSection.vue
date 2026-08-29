<template>
  <!-- Loading State -->
  <div
    v-if="loading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-surface"
  >
    <div class="text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-border border-t-accent mx-auto mb-4"></div>
      <p class="text-text-muted text-sm">Loading portfolio...</p>
    </div>
  </div>

  <!-- Error State -->
  <div
    v-else-if="error"
    class="fixed inset-0 z-50 flex items-center justify-center bg-surface"
  >
    <div class="text-center">
      <div class="text-error text-5xl mb-4">!</div>
      <h2 class="text-text-primary text-xl font-semibold mb-2">Connection Error</h2>
      <p class="text-text-muted text-sm mb-6">Failed to load portfolio data</p>
      <button
        @click="reloadPage"
        class="px-5 py-2.5 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors duration-200 text-sm font-medium"
      >
        Retry
      </button>
    </div>
  </div>

  <!-- Main Content -->
  <section
    v-else
    id="hero"
    class="min-h-screen flex items-center bg-surface scroll-mt-16"
  >
    <div class="max-w-5xl mx-auto px-6 py-24 w-full">
      <div class="max-w-2xl">
        <!-- Greeting -->
        <p class="text-text-muted text-sm mb-4 tracking-wide uppercase">
          {{ $t('hero.badge') }}
        </p>

        <!-- Name -->
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-3 tracking-tight">
          {{ $t('hero.greeting') }}
          <span class="text-text-primary">{{ portfolio?.personalInfo.nickname || '' }}</span>
        </h1>

        <!-- Role -->
        <div class="text-lg sm:text-xl text-text-muted mb-6 h-8 flex items-center">
          <span>{{ currentRole }}</span>
        </div>

        <!-- Bio -->
        <p class="text-text-secondary text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
          {{ portfolio?.personalInfo.title || '' }}. {{ $t('hero.subtitle') }}
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-wrap gap-3 mb-10">
          <button
            @click="scrollToContact"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors duration-200 text-sm font-medium"
          >
            <Mail class="w-4 h-4" />
            {{ $t('hero.cta.connect') }}
          </button>

          <button
            @click="viewCV"
            class="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-text-primary rounded-lg hover:border-text-muted transition-colors duration-200 text-sm font-medium"
          >
            <Eye class="w-4 h-4" />
            {{ $t('hero.cta.resume') }}
          </button>
        </div>

        <!-- Social Links -->
        <div class="flex items-center gap-4">
          <a
            v-for="social in socialLinks"
            :key="social.label"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-text-muted text-sm hover:text-text-primary transition-colors duration-200"
            :aria-label="social.label"
          >
            <component :is="social.icon" class="w-4 h-4" />
            <span class="hidden sm:inline">{{ social.label }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Eye, Mail, Github, Linkedin, Instagram, MessageCircle } from 'lucide-vue-next'
import { usePortfolio } from '@/composables/usePortfolio'

const { portfolio, loading, error } = usePortfolio()

const currentRole = ref('')

const roles = [
  'Mobile Developer',
  'Full Stack Developer',
  'Software Engineer',
  'Problem Solver',
]

const socialLinks = [
  { label: 'GitHub', url: 'https://github.com/abuamar142', icon: Github },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/abu-amar', icon: Linkedin },
  { label: 'Instagram', url: 'https://instagram.com/abuuamar_', icon: Instagram },
  { label: 'Email', url: 'mailto:abuamar.albadawi@gmail.com', icon: MessageCircle },
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

const scrollToContact = () => {
  const element = document.querySelector('#contact') as HTMLElement
  if (element) {
    const headerHeight = 80
    const elementPosition = element.offsetTop - headerHeight
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth',
    })
  }
}

const viewCV = () => {
  window.open('/cv.pdf', '_blank')
}

const reloadPage = () => {
  window.location.reload()
}
</script>
