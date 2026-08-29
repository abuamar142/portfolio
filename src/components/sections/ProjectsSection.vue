<template>
  <section id="projects" class="py-16 scroll-mt-14" style="background: var(--color-surface)">
    <div class="max-w-3xl mx-auto px-6">
      <h2 class="text-lg font-semibold tracking-tight mb-8" style="color: var(--color-text-primary)">
        {{ $t('projects.title') }}
      </h2>

      <div class="space-y-4">
        <div
          v-for="(project, index) in displayedProjects"
          :key="index"
          class="group p-4 rounded-lg border transition-all duration-150"
          style="border-color: var(--color-border)"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium mb-1 transition-colors duration-150" style="color: var(--color-text-primary)">
                {{ project.title }}
              </h3>
              <p class="text-xs leading-relaxed mb-3" style="color: var(--color-text-muted)">
                {{ project.description }}
              </p>

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

              <div class="flex gap-3">
                <a
                  v-if="project.githubUrl"
                  :href="project.githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-xs transition-colors duration-150"
                  style="color: var(--color-text-muted)"
                >
                  <Github class="w-3 h-3" />
                  Source
                </a>
                <a
                  v-if="project.liveUrl"
                  :href="project.liveUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-xs transition-colors duration-150"
                  style="color: var(--color-accent)"
                >
                  <ExternalLink class="w-3 h-3" />
                  Live Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="shouldShowSeeMore || showAll" class="mt-8">
        <button
          @click="toggleShowAll"
          class="text-xs transition-colors duration-150"
          style="color: var(--color-text-muted)"
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

const techColors = ['#7C3AED', '#2563EB', '#059669', '#EA580C', '#DB2777', '#0D9488', '#7C3AED', '#DC2626']

const techMap: Record<string, string> = {
  'vue': '#4FC08D', 'react': '#61DAFB', 'typescript': '#3178C6', 'javascript': '#F7DF1E',
  'node.js': '#339933', 'python': '#3776AB', 'flutter': '#02569B', 'dart': '#0175C2',
  'docker': '#2496ED', 'mongodb': '#47A248', 'postgresql': '#4169E1', 'tailwind': '#06B6D4',
}

const getTechColor = (tech: string, index: number): string => {
  const normalized = tech.toLowerCase()
  for (const [key, color] of Object.entries(techMap)) {
    if (normalized.includes(key)) return color
  }
  return techColors[index % techColors.length]
}
</script>
