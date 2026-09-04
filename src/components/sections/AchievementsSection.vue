<template>
  <section id="achievements" class="scroll-mt-14 border-b" style="background: var(--color-bg); border-color: var(--color-border)">
    <div class="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
      <div class="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div class="text-[11px] font-mono tracking-[0.14em] uppercase mb-3" style="color: var(--color-text-faint)">06 — Achievements</div>
          <h2 class="text-[22px] md:text-[26px] font-semibold tracking-tighter leading-none" style="color: var(--color-text-primary); letter-spacing: -0.03em">
            {{ $t('achievements.title') }}
          </h2>
        </div>
        <div class="text-[11px] font-mono" style="color: var(--color-text-faint)">{{ achievements.length }} items</div>
      </div>

      <div class="flex flex-wrap gap-2 mb-6">
        <button
          @click="activeFilter = 'all'"
          :class="['px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wide border transition-colors']"
          :style="activeFilter === 'all' ? { background: 'var(--color-text-primary)', color: 'var(--color-bg)', borderColor: 'var(--color-text-primary)' } : { background: 'var(--color-surface)', color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }"
        >
          {{ $t('achievements.filters.all') }} ({{ achievements.length }})
        </button>
        <button
          v-for="category in categories"
          :key="category.key"
          @click="activeFilter = category.key"
          :class="['px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wide border transition-colors']"
          :style="activeFilter === category.key ? { background: 'var(--color-text-primary)', color: 'var(--color-bg)', borderColor: 'var(--color-text-primary)' } : { background: 'var(--color-surface)', color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }"
        >
          {{ $t(`achievements.filters.${category.key}`) }} ({{ getCountByCategory(category.key) }})
        </button>
      </div>

      <div class="mb-6 max-w-md">
        <SearchInput v-model="searchQuery" :placeholder="$t('search.placeholder')" :results-count="filteredAchievements.length" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AchievementCard
          v-for="(achievement, index) in filteredAchievements"
          :key="index"
          :achievement="achievement"
        />
      </div>

      <div v-if="shouldShowSeeMore || showAll" class="mt-8 flex justify-center">
        <button
          @click="toggleShowAll"
          class="px-4 py-2 rounded-full border text-[11px] font-mono tracking-wide transition-colors"
          :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', background: 'var(--color-surface)' }"
        >
          <span v-if="!showAll">{{ $t('achievements.buttons.seeMore') }}</span>
          <span v-else>{{ $t('achievements.buttons.seeLess') }}</span>
        </button>
      </div>

      <div v-if="filteredAchievements.length === 0" class="text-center py-12 rounded-xl border mt-6" style="border-color: var(--color-border); background: var(--color-surface)">
        <p class="text-sm" style="color: var(--color-text-muted)">
          {{ searchQuery.trim() ? $t('search.noResults') : $t('achievements.empty') }}
        </p>
        <button
          v-if="searchQuery.trim()"
          @click="searchQuery = ''"
          class="mt-3 text-xs underline underline-offset-2"
          style="color: var(--color-text-secondary); text-decoration-color: var(--color-border-contrast)"
        >
          {{ $t('search.clearSearch') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { usePortfolio } from '@/composables/usePortfolio'
import AchievementCard from '@/components/ui/AchievementCard.vue'
import SearchInput from '@/components/ui/SearchInput.vue'

const { portfolio } = usePortfolio()

const achievements = computed(() => portfolio.value?.achievements || [])
const activeFilter = ref<string>('all')
const searchQuery = ref<string>('')
const showAll = ref<boolean>(false)
const maxItems = 6

watch([activeFilter, searchQuery], () => {
  showAll.value = false
})

const categories = [
  { key: 'certificate' },
  { key: 'certification' },
  { key: 'webinar' },
  { key: 'seminar' },
]

const filteredAchievements = computed(() => {
  let filtered = achievements.value

  if (activeFilter.value !== 'all') {
    filtered = filtered.filter((achievement) => achievement.type === activeFilter.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter((achievement) => {
      return (
        achievement.title.toLowerCase().includes(query) ||
        achievement.organizer.toLowerCase().includes(query) ||
        achievement.description?.toLowerCase().includes(query) ||
        achievement.certificate_number?.toLowerCase().includes(query) ||
        achievement.participant_as?.toLowerCase().includes(query)
      )
    })
  }

  if (!showAll.value && filtered.length > maxItems) {
    return filtered.slice(0, maxItems)
  }
  return filtered
})

const shouldShowSeeMore = computed(() => {
  let totalFiltered = achievements.value

  if (activeFilter.value !== 'all') {
    totalFiltered = totalFiltered.filter((achievement) => achievement.type === activeFilter.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    totalFiltered = totalFiltered.filter((achievement) => {
      return (
        achievement.title.toLowerCase().includes(query) ||
        achievement.organizer.toLowerCase().includes(query) ||
        achievement.description?.toLowerCase().includes(query) ||
        achievement.certificate_number?.toLowerCase().includes(query) ||
        achievement.participant_as?.toLowerCase().includes(query)
      )
    })
  }

  return !showAll.value && totalFiltered.length > maxItems
})

const getCountByCategory = (category: string) => {
  return achievements.value.filter((achievement) => achievement.type === category).length
}

const toggleShowAll = () => {
  showAll.value = !showAll.value
}
</script>
