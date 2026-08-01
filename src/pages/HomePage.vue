<template>
  <div :class="loading || error ? 'h-screen flex flex-col' : 'min-h-screen'">
    <main :class="loading || error ? 'flex-1 flex flex-col mt-16 sm:mt-18 lg:mt-20' : 'pt-4 sm:pt-6 lg:pt-8'">
      <HomePageSkeleton v-if="loading" />
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
import { onMounted, defineAsyncComponent } from 'vue'
import { useHead } from '@vueuse/head'
import { usePortfolio } from '@/composables/usePortfolio'

import HomePageSkeleton from '@/components/ui/HomePageSkeleton.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import ExperienceSection from '@/components/sections/ExperienceSection.vue'
import EducationSection from '@/components/sections/EducationSection.vue'

const ProjectsSection = defineAsyncComponent(() => import('@/components/sections/ProjectsSection.vue'))
const SkillsSection = defineAsyncComponent(() => import('@/components/sections/SkillsSection.vue'))
const AchievementsSection = defineAsyncComponent(() => import('@/components/sections/AchievementsSection.vue'))
const ContactSection = defineAsyncComponent(() => import('@/components/sections/ContactSection.vue'))

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

