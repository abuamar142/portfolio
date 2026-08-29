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
            {{ category.name }}
          </h3>

          <div class="flex flex-wrap gap-3">
            <div
              v-for="(skill, index) in category.skills"
              :key="index"
              class="inline-flex items-center gap-2 px-4 py-2 bg-surface-raised border border-border rounded-lg hover:border-accent/30 hover:bg-accent-subtle transition-all duration-200 group"
            >
              <span class="text-sm text-text-secondary font-medium group-hover:text-text-primary transition-colors duration-200">
                {{ skill.name }}
              </span>
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

const MAX_SKILLS_PER_CATEGORY = 6

const skillCategories = computed(() =>
  [
    {
      name: 'Mobile',
      key: 'mobile',
      skills: (portfolio.value?.skills || [])
        .filter((skill) => skill.category === 'mobile')
        .slice(0, MAX_SKILLS_PER_CATEGORY),
    },
    {
      name: 'Web',
      key: 'web',
      skills: (portfolio.value?.skills || [])
        .filter((skill) => skill.category === 'web')
        .slice(0, MAX_SKILLS_PER_CATEGORY),
    },
    {
      name: 'Backend',
      key: 'backend',
      skills: (portfolio.value?.skills || [])
        .filter((skill) => skill.category === 'backend')
        .slice(0, MAX_SKILLS_PER_CATEGORY),
    },
    {
      name: 'Tools',
      key: 'tools',
      skills: (portfolio.value?.skills || [])
        .filter((skill) => skill.category === 'tools')
        .slice(0, MAX_SKILLS_PER_CATEGORY),
    },
  ].filter((category) => category.skills.length > 0),
)
</script>
