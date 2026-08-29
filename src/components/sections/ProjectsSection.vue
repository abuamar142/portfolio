<template>
  <section id="projects" class="py-16 bg-surface scroll-mt-14">
    <div class="max-w-3xl mx-auto px-6">
      <!-- Header -->
      <h2 class="text-lg font-semibold text-text-primary tracking-tight mb-8">
        {{ $t('projects.title') }}
      </h2>

      <!-- Projects Grid -->
      <div class="space-y-4">
        <div
          v-for="(project, index) in displayedProjects"
          :key="index"
          class="group p-4 rounded-lg border border-border hover:border-accent/30 hover:bg-surface-raised transition-all duration-150"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-text-primary mb-1 group-hover:text-accent transition-colors duration-150">
                {{ project.title }}
              </h3>
              <p class="text-xs text-text-muted leading-relaxed mb-3">
                {{ project.description }}
              </p>

              <!-- Technologies with colorful badges -->
              <div class="flex flex-wrap gap-1.5 mb-3">
                <span
                  v-for="(tech, techIndex) in project.technologies"
                  :key="tech"
                  class="px-2 py-0.5 text-[10px] rounded font-mono text-white"
                  :style="{ background: getTechColor(tech, techIndex) }"
                >
                  {{ tech }}
                </span>
              </div>

              <!-- Links -->
              <div class="flex gap-3">
                <a
                  v-if="project.githubUrl"
                  :href="project.githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text-primary transition-colors duration-150"
                >
                  <Github class="w-3 h-3" />
                  Source
                </a>
                <a
                  v-if="project.liveUrl"
                  :href="project.liveUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors duration-150"
                >
                  <ExternalLink class="w-3 h-3" />
                  Live Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- See More Button -->
      <div v-if="shouldShowSeeMore || showAll" class="mt-8">
        <button
          @click="toggleShowAll"
          class="text-xs text-text-muted hover:text-accent transition-colors duration-150"
        >
          <span v-if="!showAll">{{ $t('projects.buttons.seeMore') }}</span>
          <span v-else>{{ $t('projects.buttons.seeLess') }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ExternalLink, Github } from 'lucide-vue-next'
import { usePortfolio } from '@/composables/usePortfolio'

const { portfolio } = usePortfolio()

const showAll = ref<boolean>(false)
const maxItems = 6

const displayedProjects = computed(() => {
  if (!showAll.value && (portfolio.value?.projects.length || 0) > maxItems) {
    return portfolio.value?.projects.slice(0, maxItems) || []
  }
  return portfolio.value?.projects || []
})

const shouldShowSeeMore = computed(() => {
  return !showAll.value && (portfolio.value?.projects.length || 0) > maxItems
})

const toggleShowAll = () => {
  showAll.value = !showAll.value
}

const techColors = [
  '#7C3AED', // purple
  '#3B82F6', // blue
  '#10B981', // green
  '#F97316', // orange
  '#EC4899', // pink
  '#14B8A6', // teal
  '#8B5CF6', // violet
  '#EF4444', // red
]

const getTechColor = (tech: string, index: number): string => {
  // Map common techs to specific colors
  const techMap: Record<string, string> = {
    'vue': '#4FC08D',
    'vue.js': '#4FC08D',
    'react': '#61DAFB',
    'typescript': '#3178C6',
    'javascript': '#F7DF1E',
    'node.js': '#339933',
    'node': '#339933',
    'python': '#3776AB',
    'flutter': '#02569B',
    'dart': '#0175C2',
    'docker': '#2496ED',
    'mongodb': '#47A248',
    'postgresql': '#4169E1',
    'mysql': '#4479A1',
    'tailwind': '#06B6D4',
    'tailwindcss': '#06B6D4',
    'nuxt': '#00DC82',
    'next.js': '#000000',
    'express': '#000000',
    'laravel': '#FF2D20',
    'php': '#777BB4',
    'rust': '#000000',
    'go': '#00ADD8',
    'graphql': '#E10098',
    'redis': '#DC382D',
    'firebase': '#FFCA28',
    'aws': '#FF9900',
    'vercel': '#000000',
    'nginx': '#009639',
    'linux': '#FCC624',
    'git': '#F05032',
    'figma': '#F24E1E',
    'supabase': '#3ECF8E',
    'postgres': '#4169E1',
    'sqlite': '#003B57',
    'fastapi': '#009688',
    'django': '#092E20',
    'spring': '#6DB33F',
    'java': '#ED8B00',
    'kotlin': '#7F52FF',
    'swift': '#FA7343',
    'android': '#3DDC84',
    'ios': '#000000',
    'tensorflow': '#FF6F00',
    'pytorch': '#EE4C2C',
  }

  const normalized = tech.toLowerCase()
  for (const [key, color] of Object.entries(techMap)) {
    if (normalized.includes(key)) return color
  }
  return techColors[index % techColors.length]
}
</script>
