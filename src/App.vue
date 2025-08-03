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
      <LoadingComponent
        v-if="loading"
        size="md"
        variable-name="portfolio"
        function-name="fetchData"
        sub-message="Loading portfolio data"
      />
      <!-- Error State -->
      <ErrorState v-else-if="error" :message="error || 'Unknown error occurred'" @retry="refresh" />

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

// UI Components
import LoadingComponent from '@/components/ui/LoadingComponent.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

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
