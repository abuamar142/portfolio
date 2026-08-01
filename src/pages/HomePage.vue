<template>
  <div :class="loading || error ? 'h-screen flex flex-col' : 'min-h-screen'">
    <main :class="loading || error ? 'flex-1 flex flex-col mt-16 sm:mt-18 lg:mt-20' : 'pt-4 sm:pt-6 lg:pt-8'">
      <LoadingComponent
        v-if="loading"
        size="md"
        variable-name="portfolio"
        function-name="fetchData"
        sub-message="Loading portfolio data"
      />
      <ErrorState v-else-if="error" :message="error || 'Unknown error occurred'" @retry="refresh" />

      <div v-else class="animate-fade-in">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <EducationSection />
        <ProjectsSection />
        <SkillsSection />
        <AchievementsSection />
        <ContactSection />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import { usePortfolio } from '@/composables/usePortfolio'

import LoadingComponent from '@/components/ui/LoadingComponent.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import ExperienceSection from '@/components/sections/ExperienceSection.vue'
import EducationSection from '@/components/sections/EducationSection.vue'
import ProjectsSection from '@/components/sections/ProjectsSection.vue'
import SkillsSection from '@/components/sections/SkillsSection.vue'
import AchievementsSection from '@/components/sections/AchievementsSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'

useHead({
  meta: [
    { property: 'og:title', content: 'Abu Amar — Portfolio' },
    { property: 'og:description', content: 'Mobile & Full Stack Developer portfolio — projects, skills, and experience.' },
    { property: 'og:type', content: 'website' },
  ],
})

const { loading, error, refresh } = usePortfolio()

onMounted(async () => {
  await refresh()
})
</script>

