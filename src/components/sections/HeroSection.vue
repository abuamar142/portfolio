<template>
  <!-- Loading State -->
  <div
    v-if="loading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-dracula-background"
  >
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-dracula-purple mx-auto mb-4"
      ></div>
      <p class="text-dracula-foreground font-mono">Loading portfolio...</p>
    </div>
  </div>

  <!-- Error State -->
  <div
    v-else-if="error"
    class="fixed inset-0 z-50 flex items-center justify-center bg-dracula-background"
  >
    <div class="text-center">
      <div class="text-dracula-red text-6xl mb-4">⚠️</div>
      <h2 class="text-dracula-foreground text-2xl font-bold mb-2">Connection Error</h2>
      <p class="text-dracula-comment font-mono mb-4">Failed to load portfolio data</p>
      <button
        @click="reloadPage"
        class="px-4 py-2 bg-dracula-purple text-dracula-background rounded-lg hover:bg-dracula-pink transition-colors"
      >
        Retry
      </button>
    </div>
  </div>

  <!-- Main Content -->
  <section
    v-else
    id="hero"
    class="relative min-h-screen scroll-mt-16 sm:scroll-mt-18 lg:scroll-mt-20 bg-dracula-background overflow-hidden transition-colors flex items-center"
  >
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 w-full">
      <div class="max-w-3xl">
        <!-- Greeting badge -->
        <div
          class="inline-flex items-center gap-2 bg-dracula-purple/10 border border-dracula-purple/20 text-dracula-purple px-4 py-2 rounded-full text-sm font-mono mb-6"
        >
          <span class="w-2 h-2 bg-dracula-green rounded-full animate-pulse"></span>
          {{ $t('hero.badge') }}
        </div>

        <!-- Name -->
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-dracula-foreground mb-4">
          {{ $t('hero.greeting') }}
          <span class="text-dracula-purple">{{ portfolio?.personalInfo.nickname || '' }}</span>
        </h1>

        <!-- Role with typing effect -->
        <div class="text-xl sm:text-2xl lg:text-3xl font-mono text-dracula-comment mb-6 h-10 flex items-center">
          <span class="text-dracula-purple mr-2">></span>
          <span class="border-r-2 border-dracula-purple animate-typing overflow-hidden whitespace-nowrap">
            {{ currentRole }}
          </span>
        </div>

        <!-- Bio -->
        <p class="text-base sm:text-lg text-dracula-comment leading-relaxed mb-8 max-w-2xl">
          {{ portfolio?.personalInfo.title || '' }}. {{ $t('hero.subtitle') }}
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-wrap gap-4 mb-10">
          <BaseButton
            variant="primary"
            size="lg"
            class="bg-dracula-purple hover:bg-dracula-pink text-dracula-background shadow-glow hover:shadow-button-hover transform hover:-translate-y-0.5 transition-all duration-300"
            @click="scrollToContact"
          >
            <Mail class="w-4 h-4 mr-2" />
            {{ $t('hero.cta.connect') }}
          </BaseButton>

          <BaseButton
            variant="outline"
            size="lg"
            class="border-dracula-comment text-dracula-foreground hover:border-dracula-purple hover:text-dracula-purple transition-all duration-300"
            @click="viewCV"
          >
            <Eye class="w-4 h-4 mr-2" />
            {{ $t('hero.cta.resume') }}
          </BaseButton>
        </div>

        <!-- Social Links -->
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
            <component :is="social.icon" class="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <ArrowDown class="w-5 h-5 text-dracula-comment" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, markRaw } from 'vue'
import { Eye, Mail, ArrowDown, Github, Linkedin, Instagram, MailIcon } from 'lucide-vue-next'
import { usePortfolio } from '@/composables/usePortfolio'
import BaseButton from '@/components/ui/BaseButton.vue'

const { portfolio, loading, error } = usePortfolio()

const currentRole = ref('')

const roles = [
  'Mobile Developer',
  'Full Stack Developer',
  'Software Engineer',
  'Problem Solver',
]

const socialLinks = [
  { label: 'GitHub', url: 'https://github.com/abuamar142', icon: markRaw(Github) },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/abu-amar', icon: markRaw(Linkedin) },
  { label: 'Instagram', url: 'https://instagram.com/abuuamar_', icon: markRaw(Instagram) },
  { label: 'Email', url: 'mailto:abuamar.albadawi@gmail.com', icon: markRaw(MailIcon) },
]

let roleIndex = 0
let charIndex = 0
let isDeleting = false

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

  setTimeout(typeRole, typeSpeed)
}

onMounted(() => {
  typeRole()
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
