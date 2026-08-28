<template>
  <section
    id="skills"
    class="py-20 bg-surface scroll-mt-16"
  >
    <div class="max-w-5xl mx-auto px-6">
      <!-- Header -->
      <div class="mb-16 animate-fade-in">
        <h2 class="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-4">
          {{ $t('skills.title') }}
        </h2>
        <div class="w-12 h-0.5 bg-accent"></div>
      </div>

      <!-- Skills by Category -->
      <div class="space-y-12">
        <div
          v-for="category in skillCategories"
          :key="category.name"
        >
          <h3 class="text-sm font-medium text-text-muted uppercase tracking-wider mb-5">
            {{ $t(`skills.categories.${category.key}`) }}
          </h3>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div
              v-for="(skill, index) in category.skills"
              :key="index"
              class="bg-surface-raised border border-border rounded-lg p-4 text-center hover:border-border transition-all duration-200 group"
            >
              <div class="text-lg font-semibold text-text-primary mb-1 group-hover:text-accent transition-colors duration-200">
                {{ skill.name.charAt(0).toUpperCase() }}
              </div>
              <h4 class="text-xs text-text-secondary font-medium leading-tight">
                {{ skill.name }}
              </h4>
              <div class="mt-2 w-full bg-surface-overlay rounded-full h-1">
                <div
                  class="h-1 rounded-full bg-accent transition-all duration-500"
                  :style="{ width: `${getSkillLevelPercentage(skill.level)}%` }"
                ></div>
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
import { usePortfolio } from '@/composables/usePortfolio'

const { portfolio } = usePortfolio()

const skillCategories = computed(() =>
  [
    {
      name: 'Mobile',
      key: 'mobile',
      skills: (portfolio.value?.skills || []).filter((skill) => skill.category === 'mobile'),
    },
    {
      name: 'Web',
      key: 'web',
      skills: (portfolio.value?.skills || []).filter((skill) => skill.category === 'web'),
    },
    {
      name: 'Backend',
      key: 'backend',
      skills: (portfolio.value?.skills || []).filter((skill) => skill.category === 'backend'),
    },
    {
      name: 'Tools',
      key: 'tools',
      skills: (portfolio.value?.skills || []).filter((skill) => skill.category === 'tools'),
    },
  ].filter((category) => category.skills.length > 0),
)

const getSkillLevelPercentage = (level: string): number => {
  switch (level) {
    case 'beginner': return 25
    case 'intermediate': return 50
    case 'advanced': return 75
    case 'expert': return 100
    default: return 0
  }
}
</script>
