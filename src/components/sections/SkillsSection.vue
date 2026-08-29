<template>
  <section id="skills" class="py-16 scroll-mt-14" style="background: var(--color-surface)">
    <div class="max-w-3xl mx-auto px-6">
      <h2 class="text-lg font-semibold tracking-tight mb-8" style="color: var(--color-text-primary)">
        {{ $t('skills.title') }}
      </h2>

      <div class="space-y-6">
        <div v-for="category in skillCategories" :key="category.name">
          <h3 class="text-xs uppercase tracking-wider mb-3" style="color: var(--color-text-muted)">
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

const skillCategories = computed(() =>
  [
    { name: 'Mobile', key: 'mobile', skills: (portfolio.value?.skills || []).filter(s => s.category === 'mobile').slice(0, 8) },
    { name: 'Web', key: 'web', skills: (portfolio.value?.skills || []).filter(s => s.category === 'web').slice(0, 8) },
    { name: 'Backend', key: 'backend', skills: (portfolio.value?.skills || []).filter(s => s.category === 'backend').slice(0, 8) },
    { name: 'Tools', key: 'tools', skills: (portfolio.value?.skills || []).filter(s => s.category === 'tools').slice(0, 8) },
  ].filter(c => c.skills.length > 0),
)

const skillColors: Record<string, string> = {
  'flutter': '#02569B', 'dart': '#0175C2', 'react native': '#61DAFB', 'kotlin': '#7F52FF',
  'swift': '#FA7343', 'vue': '#4FC08D', 'react': '#61DAFB', 'typescript': '#3178C6',
  'node.js': '#339933', 'python': '#3776AB', 'mongodb': '#47A248', 'postgresql': '#4169E1',
  'docker': '#2496ED', 'tailwind': '#06B6D4', 'firebase': '#FFCA28', 'supabase': '#3ECF8E',
}

const defaultColors = ['#7C3AED', '#2563EB', '#059669', '#EA580C', '#DB2777', '#0D9488', '#7C3AED', '#DC2626']

const getSkillColor = (name: string, index: number): string => {
  const normalized = name.toLowerCase()
  for (const [key, color] of Object.entries(skillColors)) {
    if (normalized.includes(key)) return color
  }
  return defaultColors[index % defaultColors.length]
}
</script>
