<template>
  <section id="experience" class="py-24 bg-white dark:bg-dark-900">
    <div class="max-w-4xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-light text-gray-900 dark:text-white mb-6">Experience</h2>
      </div>

      <div class="space-y-12">
        <div
          v-for="experience in portfolioData.experiences"
          :key="experience.id"
          class="border-l-2 border-gray-100 dark:border-gray-800 pl-8 pb-8"
        >
          <div class="space-y-4">
            <!-- Simple Header -->
            <div>
              <h3 class="text-xl font-medium text-gray-900 dark:text-white">
                {{ experience.position }}
              </h3>
              <div class="text-gray-600 dark:text-gray-400 mt-1">
                {{ experience.company }} • {{ experience.duration }}
              </div>
            </div>

            <!-- Clean Description -->
            <div class="text-gray-600 dark:text-gray-400 leading-relaxed space-y-2">
              <p v-for="desc in experience.description" :key="desc" class="text-sm">
                {{ desc }}
              </p>
            </div>

            <!-- Simple Technologies -->
            <div class="flex flex-wrap gap-2 mt-4">
              <span
                v-for="tech in experience.technologies"
                :key="tech"
                class="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
              >
                {{ tech }}
              </span>
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
