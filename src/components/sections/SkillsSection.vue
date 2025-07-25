<template>
  <section id="skills" class="py-24 bg-gray-50 dark:bg-dark-800">
    <div class="max-w-4xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-light text-gray-900 dark:text-white mb-6">Skills</h2>
      </div>

      <!-- Simple Skills List -->
      <div class="space-y-8">
        <div v-for="category in skillCategories" :key="category.name" class="space-y-4">
          <!-- Clean Category Header -->
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {{ category.name }}
          </h3>

          <!-- Simple Skills Grid -->
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            <div v-for="skill in category.skills" :key="skill.id">
              <div
                class="text-center p-3 bg-white dark:bg-dark-900 rounded-lg border border-gray-100 dark:border-gray-800"
              >
                <!-- Simple Skill Initial -->
                <div
                  class="w-8 h-8 mx-auto bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm font-medium mb-2"
                >
                  {{ getSkillInitial(skill.name) }}
                </div>
                <!-- Skill Name -->
                <h4 class="text-xs text-gray-700 dark:text-gray-300 text-center">
                  {{ skill.name }}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { portfolioData } from '@/data/portfolio'

const skillCategories = computed(() =>
  [
    {
      name: 'Mobile',
      skills: portfolioData.skills.filter((skill) => skill.category === 'frontend'),
    },
    {
      name: 'Web',
      skills: portfolioData.skills.filter((skill) => skill.category === 'backend'),
    },
    {
      name: 'Database',
      skills: portfolioData.skills.filter((skill) => skill.category === 'database'),
    },
    {
      name: 'Tools',
      skills: portfolioData.skills.filter((skill) => skill.category === 'tools'),
    },
  ].filter((category) => category.skills.length > 0),
)

const getSkillInitial = (name: string): string => {
  return name.charAt(0).toUpperCase()
}
</script>
