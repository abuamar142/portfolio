<template>
  <section id="skills" class="section">
    <div class="wrap">
      <SectionHeader
        index="04"
        :label="$t('navigation.skills')"
        :title="$t('headings.skills')"
        :lead="$t('skills.subtitle')"
      >
        <template #meta>
          <p class="font-mono text-[11px] uppercase tracking-wider text-ink-4">
            {{ technologyCount }} {{ $t('meta.technologies') }}
          </p>
        </template>
      </SectionHeader>

      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="category in skillCategories" :key="category.key" class="panel p-5">
          <h3 class="eyebrow">{{ $t('skills.categories.' + category.key) }}</h3>
          <div class="mt-4 flex flex-wrap gap-1.5">
            <span v-for="skill in category.skills" :key="skill.name" class="chip">
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
import { useStats } from '@/composables/useStats'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import type { Skill } from '@/types/portfolio'

const { portfolio } = usePortfolio()
const { technologyCount } = useStats()

const skillCategories = computed(() => {
  const all = portfolio.value?.skills || []
  const groups: { key: Skill['category']; skills: Skill[] }[] = [
    { key: 'mobile', skills: all.filter((s) => s.category === 'mobile').slice(0, 12) },
    { key: 'web', skills: all.filter((s) => s.category === 'web').slice(0, 12) },
    { key: 'backend', skills: all.filter((s) => s.category === 'backend').slice(0, 12) },
    { key: 'tools', skills: all.filter((s) => s.category === 'tools').slice(0, 12) },
  ]
  return groups.filter((group) => group.skills.length > 0)
})
</script>
