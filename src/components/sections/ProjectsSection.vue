<template>
  <section
    id="projects"
    class="relative py-16 sm:py-24 lg:py-32 bg-dracula-background overflow-hidden transition-colors"
  >
    <!-- Background Elements -->
    <div class="absolute inset-0">
      <div
        class="absolute top-20 left-4 sm:left-10 w-64 h-64 sm:w-96 sm:h-96 bg-dracula-purple/10 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-20 right-4 sm:right-10 w-56 h-56 sm:w-80 sm:h-80 bg-dracula-pink/10 rounded-full blur-3xl"
      ></div>
    </div>

    <!-- Floating Code Elements -->
    <div class="absolute inset-0 overflow-hidden opacity-20 hidden md:block">
      <div class="absolute top-40 left-20 animate-float">
        <div
          class="bg-dracula-selection border border-gray-500 rounded-lg p-3 shadow-lg backdrop-blur-sm"
        >
          <code class="text-dracula-purple text-sm">final List&lt;Project&gt;</code>
          <code class="text-dracula-cyan text-sm"> projects</code>
          <code class="text-dracula-foreground text-sm"> = [];</code>
        </div>
      </div>

      <div class="absolute bottom-40 right-24 animate-float" style="animation-delay: 1.8s">
        <div class="bg-dracula-selection border border-gray-500 rounded-lg p-3 shadow-lg">
          <code class="text-dracula-cyan text-sm">FlutterApp</code>
          <code class="text-dracula-foreground text-sm">(</code>
          <code class="text-dracula-green text-sm">'production'</code>
          <code class="text-dracula-foreground text-sm">).</code>
          <code class="text-dracula-cyan text-sm">run</code>
          <code class="text-dracula-foreground text-sm">()</code>
        </div>
      </div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6">
      <!-- Enhanced Header -->
      <div class="text-center mb-12 sm:mb-16 lg:mb-20 animate-fade-in">
        <div
          class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-dracula-purple to-dracula-pink text-dracula-background mb-6 sm:mb-8 shadow-glow"
        >
          <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>

        <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">
          <span class="text-dracula-foreground font-mono">
            {{ $t('projects.title') }}
          </span>
        </h2>

        <p
          class="text-base sm:text-lg lg:text-xl text-dracula-comment max-w-2xl mx-auto px-4 sm:px-0"
        >
          {{ $t('projects.subtitle') }}
        </p>
      </div>

      <!-- Enhanced Projects Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 animate-slide-up delay-200">
        <div
          v-for="project in displayedProjects"
          :key="project.id"
          class="bg-dracula-selection border border-gray-500 rounded-lg p-6 sm:p-8 group hover:border-dracula-purple/50 hover:shadow-glow transition-all duration-500 hover:-translate-y-2"
        >
          <!-- Project Header -->
          <div class="mb-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3
                  class="text-2xl font-bold text-dracula-foreground mb-3 group-hover:text-dracula-purple transition-colors duration-300 font-mono"
                >
                  {{ project.title }}
                </h3>
                <p class="text-dracula-foreground leading-relaxed">
                  {{ project.description }}
                </p>
              </div>

              <!-- Project Icon -->
              <div
                class="w-12 h-12 rounded-full bg-dracula-purple/20 border border-dracula-purple/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              >
                <svg
                  class="w-6 h-6 text-dracula-purple"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Technologies -->
          <div class="flex flex-wrap gap-2 mb-6">
            <span
              v-for="tech in project.technologies"
              :key="tech"
              class="px-3 py-1 bg-dracula-purple/20 border border-dracula-purple/30 text-dracula-purple text-sm rounded-full font-mono hover:scale-105 hover:bg-dracula-purple/30 transition-all duration-200"
            >
              {{ tech }}
            </span>
          </div>

          <!-- Enhanced Links -->
          <div class="flex gap-4">
            <button
              v-if="project.githubUrl"
              @click="() => openUrl(project.githubUrl!)"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-600 text-dracula-foreground rounded-lg hover:border-dracula-purple hover:text-dracula-purple hover:bg-dracula-purple/10 transition-all duration-300 font-mono"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
              {{ $t('projects.buttons.github') }}
            </button>

            <button
              v-if="project.liveUrl"
              @click="() => openUrl(project.liveUrl!)"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-dracula-purple text-dracula-foreground rounded-lg hover:bg-dracula-pink transition-all duration-300 font-mono shadow-glow"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              {{ $t('projects.buttons.demo') }}
            </button>
          </div>
        </div>
      </div>

      <!-- See More Button -->
      <div v-if="shouldShowSeeMore || showAll" class="text-center mt-12 animate-fade-in">
        <BaseButton
          @click="toggleShowAll"
          variant="outline"
          class="px-8 py-3 border-dracula-purple/50 text-dracula-purple hover:bg-dracula-purple hover:text-dracula-background transition-all duration-300 font-mono"
        >
          <span v-if="!showAll">{{ $t('projects.buttons.seeMore') }}</span>
          <span v-else>{{ $t('projects.buttons.seeLess') }}</span>
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { portfolioData } from '@/data/portfolio'
import BaseButton from '@/components/ui/BaseButton.vue'

const showAll = ref<boolean>(false)
const maxItems = 6

const displayedProjects = computed(() => {
  if (!showAll.value && portfolioData.projects.length > maxItems) {
    return portfolioData.projects.slice(0, maxItems)
  }
  return portfolioData.projects
})

const shouldShowSeeMore = computed(() => {
  return !showAll.value && portfolioData.projects.length > maxItems
})

const toggleShowAll = () => {
  showAll.value = !showAll.value
}

const openUrl = (url: string) => {
  window.open(url, '_blank')
}
</script>
