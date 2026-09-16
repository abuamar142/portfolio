<template>
  <div class="flex flex-wrap gap-1.5" role="list" :aria-label="label">
    <span v-for="skill in skills" :key="skill.name" role="listitem" class="chip group/skill">
      {{ skill.name }}
      <Sparkle
        class="size-3 shrink-0 text-primary/60 transition-transform duration-300 group-hover/skill:rotate-12 group-hover/skill:scale-110"
        aria-hidden="true"
      />
    </span>
  </div>
</template>

<script setup lang="ts">
import { Sparkle } from 'lucide-vue-next'
import type { Skill } from '@/types/portfolio'

defineProps<{
  skills: Skill[]
  label: string
}>()
</script>
