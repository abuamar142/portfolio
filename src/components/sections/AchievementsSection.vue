<template>
  <section
    id="achievements"
    class="py-20 bg-surface scroll-mt-16"
  >
    <div class="max-w-5xl mx-auto px-6">
      <!-- Header -->
      <div class="mb-16 animate-fade-in">
        <h2 class="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-4">
          {{ $t('achievements.title') }}
        </h2>
        <div class="w-12 h-0.5 bg-accent"></div>
      </div>

      <!-- Filter Buttons -->
      <div class="flex flex-wrap gap-2 mb-8">
        <button
          @click="activeFilter = 'all'"
          :class="[
            'px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border',
            activeFilter === 'all'
              ? 'bg-accent text-white border-accent'
              : 'bg-surface-overlay text-text-muted border-border hover:border-text-muted hover:text-text-primary',
          ]"
        >
          {{ $t('achievements.filters.all') }} ({{ achievements.length }})
        </button>
        <button
          v-for="category in categories"
          :key="category.key"
          @click="activeFilter = category.key"
          :class="[
            'px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border',
            activeFilter === category.key
              ? 'bg-accent text-white border-accent'
              : 'bg-surface-overlay text-text-muted border-border hover:border-text-muted hover:text-text-primary',
          ]"
        >
          {{ $t(`achievements.filters.${category.key}`) }} ({{ getCountByCategory(category.key) }})
        </button>
      </div>

      <!-- Search -->
      <div class="mb-8">
        <SearchInput
          v-model="searchQuery"
          :placeholder="$t('search.placeholder')"
          :results-count="filteredAchievements.length"
        />
      </div>

      <!-- Achievements Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AchievementCard
          v-for="(achievement, index) in filteredAchievements"
          :key="index"
          :achievement="achievement"
        />
      </div>

      <!-- See More Button -->
      <div v-if="shouldShowSeeMore || showAll" class="mt-10 text-center">
        <button
          @click="toggleShowAll"
          class="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-text-secondary rounded-lg hover:text-text-primary hover:border-text-muted transition-colors duration-200 text-sm font-medium"
        >
          <span v-if="!showAll">{{ $t('achievements.buttons.seeMore') }}</span>
          <span v-else>{{ $t('achievements.buttons.seeLess') }}</span>
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="filteredAchievements.length === 0" class="text-center py-16">
        <Inbox class="w-12 h-12 mx-auto text-text-muted mb-4" />
        <p class="text-text-muted text-sm">
          {{ searchQuery.trim() ? $t('search.noResults') : $t('achievements.empty') }}
        </p>
        <button
          v-if="searchQuery.trim()"
          @click="searchQuery = ''"
          class="mt-3 text-sm text-accent hover:text-accent-hover transition-colors duration-200"
        >
          {{ $t('search.clearSearch') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Award, Inbox } from 'lucide-vue-next'
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
