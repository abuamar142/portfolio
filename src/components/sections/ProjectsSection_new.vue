<template>
  <section id="projects" class="py-24 bg-white dark:bg-dark-900">
    <div class="max-w-4xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-light text-gray-900 dark:text-white mb-6">Projects</h2>
      </div>

      <div class="space-y-8">
        <div
          v-for="project in portfolioData.projects"
          :key="project.id"
          class="border border-gray-100 dark:border-gray-800 rounded-lg p-6 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
        >
          <div class="space-y-4">
            <!-- Project Header -->
            <div>
              <h3 class="text-xl font-medium text-gray-900 dark:text-white">
                {{ project.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                {{ project.description }}
              </p>
            </div>

            <!-- Technologies -->
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tech in project.technologies"
                :key="tech"
                class="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
              >
                {{ tech }}
              </span>
            </div>

            <!-- Links -->
            <div class="flex gap-4">
              <a
                v-if="project.githubUrl"
                :href="project.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a
                v-if="project.liveUrl"
                :href="project.liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { portfolioData } from '@/data/portfolio'
</script>
