<template>
  <section id="contact" class="py-24 bg-gray-50 dark:bg-dark-800">
    <div class="max-w-4xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-light text-gray-900 dark:text-white mb-6">Contact</h2>
      </div>

      <div class="max-w-2xl mx-auto">
        <!-- Simple Contact Info -->
        <div class="text-center space-y-6">
          <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            I'm always interested in hearing about new opportunities and collaborations.
          </p>

          <div class="space-y-4">
            <div>
              <a
                :href="`mailto:${portfolioData.personalInfo.email}`"
                class="text-xl text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {{ portfolioData.personalInfo.email }}
              </a>
            </div>

            <div class="text-gray-600 dark:text-gray-400">
              {{ portfolioData.personalInfo.location }}
            </div>

            <div v-if="portfolioData.personalInfo.phone" class="text-gray-600 dark:text-gray-400">
              {{ portfolioData.personalInfo.phone }}
            </div>
          </div>

          <!-- Social Links -->
          <div class="flex justify-center space-x-6 mt-8">
            <a
              v-if="portfolioData.personalInfo.github"
              :href="portfolioData.personalInfo.github"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              v-if="portfolioData.personalInfo.linkedin"
              :href="portfolioData.personalInfo.linkedin"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { portfolioData } from '@/data/portfolio'
</script>
