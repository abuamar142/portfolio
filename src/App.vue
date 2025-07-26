<template>
  <div id="app" class="min-h-screen bg-dracula-background">
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
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

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

onMounted(() => {
  // Initialize Dracula theme
  document.documentElement.classList.remove('dark')
})
</script>
