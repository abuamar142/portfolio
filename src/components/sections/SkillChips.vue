<template>
  <div class="flex flex-wrap gap-1.5" role="list" :aria-label="label">
    <span v-for="skill in skills" :key="skill.name" role="listitem" class="chip">
      {{ skill.name }}
      <!--
        Level as dots: four filled/hollow marks read at a glance, where the
        previous "·3" needed a legend nobody had. The dots are decorative —
        the level is stated in words for assistive tech, which cannot see
        "three out of four".
      -->
      <span class="skill-dots" :class="`skill-dots-${skill.level}`" aria-hidden="true">
        <span v-for="n in LEVEL_MAX" :key="n" class="skill-dot" />
      </span>
      <span class="sr-only">{{ levelWord(skill.level) }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Skill } from '@/types/portfolio'

defineProps<{
  skills: Skill[]
  label: string
}>()

const { t } = useI18n()

/** Four marks, matching the four levels the database stores. */
const LEVEL_MAX = 4

/** Spoken form of the level — the dots carry no text of their own. */
function levelWord(level: Skill['level']): string {
  return t(`skills.levels.${level}`)
}
</script>

<style scoped>
.skill-dots {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-left: 0.125rem;
}

.skill-dot {
  width: 4px;
  height: 4px;
  border-radius: 9999px;
  border: 1px solid currentColor;
  /* Hollow by default: an unfilled mark reads as "not reached" without
     needing a second colour or any opacity trickery. */
  background: transparent;
}

/* Filled marks take the accent, so the level is the only coloured part of
   the chip and the eye lands on it first. */
.skill-dots-beginner .skill-dot:nth-child(-n + 1),
.skill-dots-intermediate .skill-dot:nth-child(-n + 2),
.skill-dots-advanced .skill-dot:nth-child(-n + 3),
.skill-dots-expert .skill-dot:nth-child(-n + 4) {
  background: var(--color-voltage-ink);
  border-color: var(--color-voltage-ink);
}
</style>
