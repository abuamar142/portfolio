<template>
  <section id="about" class="py-24 bg-gray-50 dark:bg-dark-800">
    <div class="max-w-4xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-light text-gray-900 dark:text-white mb-6">About</h2>
        <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
          {{ portfolioData.about }}
        </p>
      </div>

      <!-- Simple Stats -->
      <div class="grid grid-cols-3 gap-8 mb-16">
        <div class="text-center">
          <div class="text-2xl font-light text-gray-900 dark:text-white">
            {{ portfolioData.experiences.length }}+
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-500 mt-1">Experience</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-light text-gray-900 dark:text-white">
            {{ portfolioData.projects.length }}+
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-500 mt-1">Projects</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-light text-gray-900 dark:text-white">
            {{ portfolioData.skills.length }}+
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-500 mt-1">Skills</div>
        </div>
      </div>

      <!-- Clean Contact Info -->
      <div class="text-center space-y-2">
        <div class="text-gray-600 dark:text-gray-400">
          {{ portfolioData.personalInfo.email }}
        </div>
        <div class="text-gray-600 dark:text-gray-400">
          {{ portfolioData.personalInfo.location }}
        </div>
      </div>

      <!-- Simple Download CV Button -->
      <div class="text-center mt-12">
        <BaseButton
          @click="downloadCV"
          variant="outline"
          class="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Download Resume
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { portfolioData } from '@/data/portfolio'
import BaseButton from '@/components/ui/BaseButton.vue'

const downloadCV = () => {
  const link = document.createElement('a')
  link.href = '/cv.pdf'
  link.download = `${portfolioData.personalInfo.name}_CV.pdf`
  link.click()
}
</script>
