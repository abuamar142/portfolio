<template>
  <div class="min-h-screen bg-base-100">
    <HomePageSkeleton v-if="loading" />
    <ErrorState v-else-if="error" :message="$t('errors.load')" @retry="refresh" />

    <div v-else>
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
      <EducationSection />
      <AchievementsSection />
      <ContactSection />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, defineAsyncComponent } from 'vue'
import { useHead } from '@unhead/vue'
import { usePortfolio } from '@/composables/usePortfolio'

import HomePageSkeleton from '@/components/ui/HomePageSkeleton.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import ExperienceSection from '@/components/sections/ExperienceSection.vue'

const ProjectsSection = defineAsyncComponent(
  () => import('@/components/sections/ProjectsSection.vue'),
)
const SkillsSection = defineAsyncComponent(() => import('@/components/sections/SkillsSection.vue'))
const ContactSection = defineAsyncComponent(
  () => import('@/components/sections/ContactSection.vue'),
)
const EducationSection = defineAsyncComponent(
  () => import('@/components/sections/EducationSection.vue'),
)
const AchievementsSection = defineAsyncComponent(
  () => import('@/components/sections/AchievementsSection.vue'),
)
useHead({
  meta: [
    { property: 'og:title', content: 'Abu Amar - Portfolio' },
    {
      property: 'og:description',
      content: 'Software Engineer portfolio - projects, skills, and experience.',
    },
    { property: 'og:type', content: 'website' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'M. Abu Amar Al Badawi, S.Kom',
        url: 'https://abuamar.online',
        jobTitle: 'Software Engineer',
        sameAs: ['https://github.com/abuamar142', 'https://linkedin.com/in/abu-amar'],
      }),
    },
  ],
})

const { loading, error, refresh } = usePortfolio()

onMounted(async () => {
  await refresh()
})
</script>
