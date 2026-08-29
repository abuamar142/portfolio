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
              class="px-2.5 py-1 text-[11px] rounded font-mono text-white"
              :style="{ background: getSkillColor(skill.name, index) }"
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

const skillColors: Record<string, string> = {
  'flutter': '#02569B',
  'dart': '#0175C2',
  'react native': '#61DAFB',
  'kotlin': '#7F52FF',
  'swift': '#FA7343',
  'android': '#3DDC84',
  'ios': '#000000',
  'vue': '#4FC08D',
  'vue.js': '#4FC08D',
  'react': '#61DAFB',
  'angular': '#DD0031',
  'svelte': '#FF3E00',
  'next.js': '#000000',
  'nuxt': '#00DC82',
  'typescript': '#3178C6',
  'javascript': '#F7DF1E',
  'html': '#E34F26',
  'css': '#1572B6',
  'tailwind': '#06B6D4',
  'tailwindcss': '#06B6D4',
  'node.js': '#339933',
  'node': '#339933',
  'express': '#000000',
  'fastapi': '#009688',
  'django': '#092E20',
  'laravel': '#FF2D20',
  'php': '#777BB4',
  'python': '#3776AB',
  'java': '#ED8B00',
  'go': '#00ADD8',
  'rust': '#000000',
  'mongodb': '#47A248',
  'postgresql': '#4169E1',
  'mysql': '#4479A1',
  'redis': '#DC382D',
  'firebase': '#FFCA28',
  'supabase': '#3ECF8E',
  'docker': '#2496ED',
  'kubernetes': '#326CE5',
  'aws': '#FF9900',
  'gcp': '#4285F4',
  'azure': '#0078D4',
  'vercel': '#000000',
  'netlify': '#00C7B7',
  'nginx': '#009639',
  'linux': '#FCC624',
  'git': '#F05032',
  'figma': '#F24E1E',
  'graphql': '#E10098',
  'rest api': '#009688',
  'websocket': '#4FC08D',
  'sqlite': '#003B57',
  'prisma': '#2D3748',
}

const defaultColors = [
  '#7C3AED', '#3B82F6', '#10B981', '#F97316', '#EC4899',
  '#14B8A6', '#8B5CF6', '#EF4444', '#06B6D4', '#84CC16',
]

const getSkillColor = (name: string, index: number): string => {
  const normalized = name.toLowerCase()
  for (const [key, color] of Object.entries(skillColors)) {
    if (normalized.includes(key)) return color
  }
  return defaultColors[index % defaultColors.length]
}
</script>
