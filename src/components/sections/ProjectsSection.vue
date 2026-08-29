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
          class="group"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-text-primary mb-1">
                {{ project.title }}
              </h3>
              <p class="text-xs text-text-muted leading-relaxed mb-2">
                {{ project.description }}
              </p>

              <!-- Technologies -->
              <div class="flex flex-wrap gap-1.5 mb-3">
                <span
                  v-for="tech in project.technologies"
                  :key="tech"
                  class="px-2 py-0.5 bg-surface-overlay text-text-muted text-[10px] rounded font-mono"
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
          class="text-xs text-text-muted hover:text-text-primary transition-colors duration-150"
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
