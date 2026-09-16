<template>
  <section id="projects" class="section">
    <div class="wrap">
      <SectionHeader :title="$t('headings.projects')" :lead="$t('projects.subtitle')" align="center">
        <template #meta>
          <p class="flex min-h-11 flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span class="font-mono text-[11px] uppercase tracking-wider text-ink-4">
              {{ projectCount }} {{ $t('meta.projects') }}
            </span>
            <span class="text-ink-4" aria-hidden="true">·</span>
            <button
              v-if="shouldShowSeeMore || showAll"
              type="button"
              class="inline-flex items-center gap-1 text-sm font-medium text-ink-3 transition-colors hover:text-primary"
              @click="toggleShowAll"
            >
              {{ showAll ? $t('projects.buttons.seeLess') : $t('projects.buttons.viewAll') }}
              <ArrowUpRight class="size-4" aria-hidden="true" />
            </button>
          </p>
        </template>
      </SectionHeader>

      <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(project, index) in displayedProjects"
          v-reveal
          :key="project.title"
          :style="{ '--rv-i': index % 3 }"
          class="panel lift flex flex-col p-5"
        >
          <ProjectCard :project="project" />
        </article>
      </div>

      <div v-if="showAll" class="mt-8 flex justify-center">
        <BaseButton variant="ghost" size="sm" class="min-h-11" @click="toggleShowAll">
          {{ $t('projects.buttons.seeLess') }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowUpRight } from 'lucide-vue-next'
import { usePortfolio } from '@/composables/usePortfolio'
import { useStats } from '@/composables/useStats'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProjectCard from '@/components/sections/ProjectCard.vue'
const { portfolio } = usePortfolio()
const { projectCount } = useStats()

const showAll = ref(false)
const maxItems = 6

const displayedProjects = computed(() => {
  const all = portfolio.value?.projects || []
  if (!showAll.value && all.length > maxItems) return all.slice(0, maxItems)
  return all
})

const shouldShowSeeMore = computed(
  () => !showAll.value && (portfolio.value?.projects.length || 0) > maxItems,
)

const toggleShowAll = () => {
  showAll.value = !showAll.value
}
</script>
