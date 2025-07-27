<template>
  <div id="app" class="min-h-screen bg-dracula-background">
    <!-- Global Loading State -->
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-dracula-background"
    >
      <div class="text-center">
        <!-- Animated Logo/Icon -->
        <div class="mb-8">
          <div class="relative">
            <div class="w-20 h-20 mx-auto mb-4">
              <div class="absolute inset-0 rounded-full border-4 border-dracula-purple/20"></div>
              <div
                class="absolute inset-0 rounded-full border-4 border-dracula-purple border-t-transparent animate-spin"
              ></div>
              <div
                class="absolute inset-2 rounded-full bg-gradient-to-r from-dracula-purple to-dracula-pink flex items-center justify-center"
              >
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading Text -->
        <div class="space-y-2">
          <h2 class="text-2xl font-bold text-dracula-foreground font-mono">Loading Portfolio</h2>
          <p class="text-dracula-comment">
            {{ loadingMessage }}
          </p>

          <!-- Loading Dots Animation -->
          <div class="flex justify-center space-x-1 mt-4">
            <div
              class="w-2 h-2 bg-dracula-purple rounded-full animate-bounce"
              style="animation-delay: 0ms"
            ></div>
            <div
              class="w-2 h-2 bg-dracula-purple rounded-full animate-bounce"
              style="animation-delay: 150ms"
            ></div>
            <div
              class="w-2 h-2 bg-dracula-purple rounded-full animate-bounce"
              style="animation-delay: 300ms"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="fixed inset-0 z-50 flex items-center justify-center bg-dracula-background"
    >
      <div class="text-center max-w-md mx-auto px-6">
        <!-- Error Icon -->
        <div
          class="w-20 h-20 mx-auto mb-6 bg-dracula-red/20 rounded-full flex items-center justify-center"
        >
          <svg
            class="w-10 h-10 text-dracula-red"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5C2.962 18.333 3.924 20 5.464 20z"
            />
          </svg>
        </div>

        <!-- Error Message -->
        <h2 class="text-xl font-bold text-dracula-red mb-3">Failed to Load Portfolio</h2>
        <p class="text-dracula-comment mb-6">
          {{ error }}
        </p>

        <!-- Retry Button -->
        <button
          @click="retryLoad"
          class="px-6 py-3 bg-dracula-purple text-white rounded-lg hover:bg-dracula-purple/80 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Main Content - Only show when data is loaded -->
    <div v-else-if="portfolioData" class="animate-fade-in">
      <!-- Header/Navigation -->
      <AppHeader />

      <!-- Main Content -->
      <main class="pt-16 sm:pt-18 lg:pt-20">
        <!-- Hero Section -->
        <HeroSection />

        <!-- About Section -->
        <AboutSection />

        <!-- Experience Section -->
        <ExperienceSection />

        <!-- Projects Section -->
        <ProjectsSection />

        <!-- Skills Section -->
        <SkillsSection />

        <!-- Contact Section -->
        <ContactSection />
      </main>

      <!-- Footer -->
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { usePortfolio } from '@/composables/usePortfolio'

// Layout Components
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

// Section Components
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import ExperienceSection from '@/components/sections/ExperienceSection.vue'
import ProjectsSection from '@/components/sections/ProjectsSection.vue'
import SkillsSection from '@/components/sections/SkillsSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'

// Portfolio data management
const { portfolioData, isLoading, error, refreshData } = usePortfolio()

// Loading messages that rotate
const loadingMessages = [
  'Fetching portfolio data...',
  'Loading projects...',
  'Getting contact information...',
  'Preparing content...',
  'Almost ready...',
]

const currentMessageIndex = ref(0)
const loadingMessage = computed(() => loadingMessages[currentMessageIndex.value])

// Rotate loading messages
let messageInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  // Initialize Dracula theme
  document.documentElement.classList.remove('dark')

  // Start rotating loading messages
  messageInterval = setInterval(() => {
    if (isLoading.value) {
      currentMessageIndex.value = (currentMessageIndex.value + 1) % loadingMessages.length
    }
  }, 1500)
})

// Cleanup interval when component unmounts
onBeforeUnmount(() => {
  if (messageInterval) {
    clearInterval(messageInterval)
  }
})

// Retry function for error state
const retryLoad = async () => {
  currentMessageIndex.value = 0
  await refreshData()
}
</script>
