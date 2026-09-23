<template>
  <section id="skills" class="section">
    <div class="wrap">
      <SectionHeader
        :title="$t('headings.skills')"
        :lead="$t('skills.subtitle')"
        index="04"
        :kicker="$t('navigation.skills')"
      >
        <template #meta>
          <p class="data">{{ technologyCount }} {{ $t('meta.technologies') }}</p>
        </template>
      </SectionHeader>

      <div class="mt-8 grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-0">
        <div
          v-for="(category, index) in skillCategories"
          :key="category.key"
          v-reveal
          :style="{ '--rv-i': index }"
          class="py-6 sm:py-8 border-t border-hairline-light"
        >
          <div class="flex items-baseline justify-between gap-4">
            <span class="label">{{ $t('skills.categories.' + category.key) }}</span>
            <span class="data">{{ category.skills.length }}</span>
          </div>
          <div class="mt-4">
            <SkillChips
              :skills="category.skills"
              :label="$t('skills.categories.' + category.key)"
            />
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
import SkillChips from '@/components/sections/SkillChips.vue'
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
