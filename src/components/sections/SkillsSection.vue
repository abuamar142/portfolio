<template>
  <section id="skills" class="py-16 bg-surface scroll-mt-14">
    <div class="max-w-3xl mx-auto px-6">
      <!-- Header -->
      <h2 class="text-lg font-semibold text-text-primary tracking-tight mb-8">
        {{ $t('skills.title') }}
      </h2>

      <!-- Skills by Category -->
      <div class="space-y-6">
        <div
          v-for="category in skillCategories"
          :key="category.name"
        >
          <h3 class="text-xs text-text-muted uppercase tracking-wider mb-3">
            {{ category.name }}
          </h3>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="(skill, index) in category.skills"
              :key="index"
              class="px-2.5 py-1 bg-surface-overlay text-text-secondary text-xs rounded font-mono"
            >
              {{ skill.name }}
            </span>
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

const MAX_SKILLS_PER_CATEGORY = 8

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
