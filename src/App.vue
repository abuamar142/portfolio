<template>
  <div
    id="app"
    :class="loading || error ? 'h-screen flex flex-col' : 'min-h-screen'"
    class="bg-dracula-background"
  >
    <!-- Header/Navigation - Always visible -->
    <AppHeader />

    <!-- Main Content - Flexible height when loading/error, normal when loaded -->
    <main
      :class="
        loading || error ? 'flex-1 flex flex-col mt-16 sm:mt-18 lg:mt-20' : 'pt-4 sm:pt-6 lg:pt-8'
      "
    >
      <!-- Loading State -->
      <div v-if="loading" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <!-- Loading Spinner -->
          <div
            class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-dracula-purple border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"
          ></div>

          <!-- Loading Text with Typing Animation -->
          <div class="text-dracula-foreground font-mono text-lg">
            <span class="text-dracula-green">const</span>
            <span class="text-dracula-cyan ml-2">portfolio</span>
            <span class="text-dracula-foreground ml-1">=</span>
            <span class="text-dracula-orange ml-2">await</span>
            <span class="text-dracula-yellow ml-2">fetchData</span
            ><span class="text-dracula-foreground">()</span>
            <span class="animate-pulse text-dracula-purple ml-1">...</span>
          </div>

          <!-- Progress Indicator -->
          <div class="mt-4 text-sm text-dracula-comment">Loading portfolio data</div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex-1 flex items-center justify-center">
        <div class="text-center max-w-md mx-auto p-6">
          <!-- Error Icon -->
          <div class="text-6xl text-dracula-red mb-4">⚠️</div>

          <!-- Error Message -->
          <div class="text-dracula-foreground font-mono mb-4">
            <span class="text-dracula-red">Error:</span>
            <span class="text-dracula-comment">{{ error }}</span>
          </div>

          <!-- Retry Button -->
          <button
            @click="() => refresh()"
            class="bg-dracula-purple hover:bg-dracula-purple/80 text-dracula-background px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>

      <!-- Content Sections - Only show when data is loaded -->
      <div v-else class="animate-fade-in">
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

        <!-- Achievements Section -->
        <AchievementsSection />

        <!-- Contact Section -->
        <ContactSection />
      </div>
    </main>

    <!-- Footer - Always visible, but only when loading/error uses flexbox -->
    <AppFooter v-if="loading || error" />
    <AppFooter v-else class="relative" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
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
import AchievementsSection from '@/components/sections/AchievementsSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'

// Use portfolio data and loading state
const { loading, error, refresh } = usePortfolio()

onMounted(async () => {
  // Initialize Dracula theme
  document.documentElement.classList.remove('dark')

  // Start loading portfolio data
  await refresh()
})
</script>
