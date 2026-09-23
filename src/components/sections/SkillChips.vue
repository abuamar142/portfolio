<template>
  <div class="flex flex-wrap gap-1.5" role="list" :aria-label="label">
    <span v-for="skill in skills" :key="skill.name" role="listitem" class="chip">
      {{ skill.name }}
      <span class="text-ink-4 ml-0.5">{{ levelLabel(skill.level) }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Skill } from '@/types/portfolio'

defineProps<{
  skills: Skill[]
  label: string
}>()

const levelLabels: Record<Skill['level'], string> = {
  beginner: '·1',
  intermediate: '·2',
  advanced: '·3',
  expert: '·4',
}

function levelLabel(level: Skill['level']): string {
  return levelLabels[level] || ''
}
</script>
