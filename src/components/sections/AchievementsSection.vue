<template>
  <section
    id="achievements"
    class="relative py-16 sm:py-24 lg:py-32 bg-dracula-background overflow-hidden transition-colors"
  >
    <!-- Background Elements -->
    <div class="absolute inset-0">
      <div
        class="absolute top-32 left-4 sm:left-16 w-56 h-56 sm:w-80 sm:h-80 bg-dracula-purple/10 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-20 right-4 sm:right-16 w-64 h-64 sm:w-96 sm:h-96 bg-dracula-pink/10 rounded-full blur-3xl"
      ></div>
    </div>

    <!-- Floating Code Elements -->
    <div class="absolute inset-0 overflow-hidden opacity-20 hidden md:block">
      <div class="absolute top-24 right-32 animate-float">
        <div
          class="bg-dracula-selection border border-gray-500 rounded-lg p-3 shadow-lg backdrop-blur-sm"
        >
          <code class="text-dracula-purple text-sm">class</code>
          <code class="text-dracula-cyan text-sm"> Achievement</code>
          <code class="text-dracula-foreground text-sm"> {</code>
        </div>
      </div>

      <div class="absolute bottom-32 left-24 animate-float" style="animation-delay: 1.2s">
        <div class="bg-dracula-selection border border-gray-500 rounded-lg p-3 shadow-lg">
          <code class="text-dracula-purple text-sm">String</code>
          <code class="text-dracula-cyan text-sm"> type</code>
          <code class="text-dracula-foreground text-sm"> = </code>
          <code class="text-dracula-green text-sm"
            >'{{ $t('achievements.categories.certification').toLowerCase() }}'</code
          >
          <code class="text-dracula-foreground text-sm">;</code>
        </div>
      </div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6">
      <!-- Enhanced Header -->
      <div class="text-center mb-12 sm:mb-16 lg:mb-20 animate-fade-in">
        <div
          class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-dracula-purple to-dracula-pink text-dracula-background mb-6 sm:mb-8 shadow-glow"
        >
          <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        </div>

        <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">
          <span class="text-dracula-foreground font-mono">
            {{ $t('achievements.title') }}
          </span>
        </h2>

        <p
          class="text-base sm:text-lg lg:text-xl text-dracula-comment max-w-2xl mx-auto px-4 sm:px-0"
        >
          {{ $t('achievements.subtitle') }}
        </p>
      </div>

      <!-- Filter Buttons -->
      <div class="flex flex-wrap justify-center gap-3 mb-12 sm:mb-16 animate-slide-up delay-200">
        <button
          @click="activeFilter = 'all'"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium font-mono transition-all duration-300 border',
            activeFilter === 'all'
              ? 'bg-dracula-purple text-dracula-background border-dracula-purple shadow-glow'
              : 'bg-dracula-selection text-dracula-comment border-gray-500 hover:border-dracula-purple/50 hover:text-dracula-purple',
          ]"
        >
          {{ $t('achievements.filters.all') }} ({{ achievements.length }})
        </button>
        <button
          v-for="category in categories"
          :key="category.key"
          @click="activeFilter = category.key"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium font-mono transition-all duration-300 border',
            activeFilter === category.key
              ? 'bg-dracula-purple text-dracula-background border-dracula-purple shadow-glow'
              : 'bg-dracula-selection text-dracula-comment border-gray-500 hover:border-dracula-purple/50 hover:text-dracula-purple',
          ]"
        >
          {{ $t(`achievements.filters.${category.key}`) }} ({{ getCountByCategory(category.key) }})
        </button>
      </div>

      <!-- Achievements Search -->
      <div class="mb-8 sm:mb-12 animate-slide-up delay-200">
        <SearchInput
          v-model="searchQuery"
          :placeholder="$t('search.placeholder')"
          :results-count="filteredAchievements.length"
        />
      </div>

      <!-- Achievements Grid -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-slide-up delay-300"
      >
        <AchievementCard
          v-for="(achievement, index) in filteredAchievements"
          :key="index"
          :achievement="achievement"
        />
      </div>

      <!-- See More Button -->
      <div v-if="shouldShowSeeMore || showAll" class="text-center mt-12 animate-fade-in">
        <BaseButton
          @click="toggleShowAll"
          variant="outline"
          class="px-8 py-3 border-dracula-purple/50 text-dracula-purple hover:bg-dracula-purple hover:text-dracula-background transition-all duration-300 font-mono"
        >
          <span v-if="!showAll">{{ $t('achievements.buttons.seeMore') }}</span>
          <span v-else>{{ $t('achievements.buttons.seeLess') }}</span>
        </BaseButton>
      </div>

      <!-- Empty State -->
      <div v-if="filteredAchievements.length === 0" class="text-center py-12 animate-fade-in">
        <div class="text-dracula-comment mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.516-.641-6.407-1.759C5.226 13.055 5 12.741 5 12.5v-1.25C5 11.112 5.112 11 5.25 11H6a2 2 0 002-2V7a2 2 0 00-2-2H5.25C5.112 5 5 4.888 5 4.75v-.5C5 4.112 5.112 4 5.25 4H6a2 2 0 002-2V1"
            />
          </svg>
        </div>
        <p class="text-dracula-comment font-mono">
          {{ searchQuery.trim() ? $t('search.noResults') : $t('achievements.empty') }}
        </p>
        <button
          v-if="searchQuery.trim()"
          @click="searchQuery = ''"
          class="mt-4 px-4 py-2 text-sm text-dracula-purple hover:text-dracula-pink transition-colors font-mono"
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
import BaseButton from '@/components/ui/BaseButton.vue'
import SearchInput from '@/components/ui/SearchInput.vue'

const { portfolio } = usePortfolio()

// Helper untuk backward compatibility
const portfolioData = computed(
  () =>
    portfolio.value || {
      personalInfo: { fullname: '', nickname: '', title: '', email: '', phone: '', location: '' },
      about: '',
      experiences: [],
      projects: [],
      skills: [],
      education: [],
      achievements: [],
    },
)

const achievements = computed(() => portfolioData.value.achievements)
const activeFilter = ref<string>('all')
const searchQuery = ref<string>('')
const showAll = ref<boolean>(false)
const maxItems = 6

// Reset showAll when filter or search changes
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

  // Filter by category
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter((achievement) => achievement.type === activeFilter.value)
  }

  // Filter by search query
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

  // Apply pagination
  if (!showAll.value && filtered.length > maxItems) {
    return filtered.slice(0, maxItems)
  }
  return filtered
})

const shouldShowSeeMore = computed(() => {
  let totalFiltered = achievements.value

  // Filter by category
  if (activeFilter.value !== 'all') {
    totalFiltered = totalFiltered.filter((achievement) => achievement.type === activeFilter.value)
  }

  // Filter by search query
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
