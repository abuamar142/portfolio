<template>
  <section id="achievements" class="section">
    <div class="wrap">
      <SectionHeader
        index="06"
        :label="$t('navigation.achievements')"
        :title="$t('headings.achievements')"
        :lead="$t('achievements.subtitle')"
      >
        <template #meta>
          <p class="font-mono text-[11px] uppercase tracking-wider text-ink-4">
            {{ achievements.length }} {{ $t('meta.items') }}
          </p>
        </template>
      </SectionHeader>

      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="chip min-h-11 transition-colors"
            :class="
              activeFilter === 'all'
                ? 'border-primary bg-primary text-primary-content'
                : 'hover:border-ink-4 hover:text-base-content'
            "
            :aria-pressed="activeFilter === 'all'"
            @click="activeFilter = 'all'"
          >
            {{ $t('achievements.filters.all') }}
            <span class="font-mono text-[11px] opacity-70">{{ achievements.length }}</span>
          </button>
          <button
            v-for="category in categories"
            :key="category.key"
            type="button"
            class="chip min-h-11 transition-colors"
            :class="
              activeFilter === category.key
                ? 'border-primary bg-primary text-primary-content'
                : 'hover:border-ink-4 hover:text-base-content'
            "
            :aria-pressed="activeFilter === category.key"
            @click="activeFilter = category.key"
          >
            {{ $t('achievements.filters.' + category.key) }}
            <span class="font-mono text-[11px] opacity-70">
              {{ getCountByCategory(category.key) }}
            </span>
          </button>
        </div>

        <div class="w-full lg:w-80 lg:shrink-0">
          <SearchInput
            v-model="searchQuery"
            :placeholder="$t('search.placeholder')"
            :results-count="filteredAchievements.length"
          />
        </div>
      </div>

      <div
        v-if="filteredAchievements.length"
        class="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        <AchievementCard
          v-for="achievement in filteredAchievements"
          :key="`${achievement.title}-${achievement.date}`"
          :achievement="achievement"
        />
      </div>

      <div v-if="shouldShowSeeMore || showAll" class="mt-8 flex justify-center">
        <BaseButton variant="ghost" size="sm" class="min-h-11" @click="toggleShowAll">
          {{ showAll ? $t('achievements.buttons.seeLess') : $t('achievements.buttons.seeMore') }}
        </BaseButton>
      </div>

      <div v-if="filteredAchievements.length === 0" class="panel mt-6 p-8 text-center">
        <p class="text-sm text-ink-2">
          {{ searchQuery.trim() ? $t('search.noResults') : $t('achievements.empty') }}
        </p>
        <button
          v-if="searchQuery.trim()"
          type="button"
          class="mt-2 inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4 transition-opacity hover:opacity-80"
          @click="searchQuery = ''"
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
import SectionHeader from '@/components/ui/SectionHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

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
