<template>
  <section
    id="projects"
    class="py-20 bg-surface scroll-mt-16"
  >
    <div class="max-w-5xl mx-auto px-6">
      <!-- Header -->
      <div class="mb-16 animate-fade-in">
        <h2 class="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-4">
          {{ $t('projects.title') }}
        </h2>
        <div class="w-12 h-0.5 bg-accent"></div>
      </div>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div
          v-for="(project, index) in displayedProjects"
          :key="index"
          class="bg-surface-raised border border-border rounded-xl p-6 group hover:border-border transition-all duration-200"
        >
          <!-- Project Header -->
          <div class="flex items-start justify-between mb-3">
            <h3 class="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors duration-200">
              {{ project.title }}
            </h3>
            <ExternalLink class="w-4 h-4 text-text-muted group-hover:text-accent transition-colors duration-200 flex-shrink-0 mt-1" />
          </div>

          <!-- Description -->
          <p class="text-text-secondary text-sm leading-relaxed mb-4">
            {{ project.description }}
          </p>

          <!-- Technologies -->
          <div class="flex flex-wrap gap-2 mb-5">
            <span
              v-for="tech in project.technologies"
              :key="tech"
              class="px-2.5 py-1 bg-surface-overlay text-text-muted text-xs rounded-md"
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
              class="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
            >
              <Github class="w-4 h-4" />
              Source
            </a>
            <a
              v-if="project.liveUrl"
              :href="project.liveUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors duration-200"
            >
              <ExternalLink class="w-4 h-4" />
              Live Demo
            </a>
          </div>
        </div>
      </div>

      <!-- See More Button -->
      <div v-if="shouldShowSeeMore || showAll" class="mt-10 text-center">
        <button
          @click="toggleShowAll"
          class="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-text-secondary rounded-lg hover:text-text-primary hover:border-text-muted transition-colors duration-200 text-sm font-medium"
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
</script>
