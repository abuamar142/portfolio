<template>
  <section id="projects" class="section">
    <div class="wrap">
      <SectionHeader
        index="03"
        :label="$t('navigation.projects')"
        :title="$t('headings.projects')"
        :lead="$t('projects.subtitle')"
      >
        <template #meta>
          <p class="font-mono text-[11px] uppercase tracking-wider text-ink-4">
            {{ projectCount }} {{ $t('meta.projects') }}
          </p>
        </template>
      </SectionHeader>

      <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(project, index) in displayedProjects"
          :key="project.title"
          class="panel flex flex-col p-5 transition-colors hover:border-primary/40"
        >
          <div class="flex items-center justify-between gap-3">
            <p class="font-mono text-[11px] tracking-wider text-ink-4">
              {{ String(index + 1).padStart(2, '0') }} / {{ String(projectCount).padStart(2, '0') }}
            </p>
            <span v-if="project.liveUrl" class="chip chip-accent">
              {{ $t('projects.buttons.demo') }}
            </span>
          </div>

          <h3 class="mt-4 text-[15px] font-medium leading-snug text-base-content">
            {{ project.title }}
          </h3>

          <p v-if="project.description" class="mt-2 line-clamp-3 text-sm text-ink-2">
            {{ project.description }}
          </p>

          <div v-if="project.technologies.length" class="mt-4 mb-5 flex flex-wrap items-center gap-1.5">
            <span v-for="tech in project.technologies.slice(0, 5)" :key="tech" class="chip">
              {{ tech }}
            </span>
            <span
              v-if="project.technologies.length > 5"
              class="font-mono text-[11px] leading-none text-ink-4"
            >
              +{{ project.technologies.length - 5 }}
            </span>
          </div>

          <div
            v-if="project.githubUrl || project.liveUrl"
            class="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-base-300 pt-3"
          >
            <a
              v-if="project.githubUrl"
              :href="project.githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex min-h-11 items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-2 transition-colors hover:text-base-content"
            >
              <Github class="size-3.5" aria-hidden="true" />
              {{ $t('projects.buttons.github') }}
            </a>
            <a
              v-if="project.liveUrl"
              :href="project.liveUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex min-h-11 items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-primary transition-opacity hover:opacity-80"
            >
              <ExternalLink class="size-3.5" aria-hidden="true" />
              {{ $t('projects.buttons.demo') }}
            </a>
          </div>
        </article>
      </div>

      <div v-if="shouldShowSeeMore || showAll" class="mt-8 flex justify-center">
        <BaseButton variant="ghost" size="sm" class="min-h-11" @click="toggleShowAll">
          {{ showAll ? $t('projects.buttons.seeLess') : $t('projects.buttons.seeMore') }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ExternalLink, Github } from 'lucide-vue-next'
import { usePortfolio } from '@/composables/usePortfolio'
import { useStats } from '@/composables/useStats'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const { portfolio } = usePortfolio()
const { projectCount } = useStats()

const showAll = ref(false)
const maxItems = 6

const displayedProjects = computed(() => {
  const all = portfolio.value?.projects || []
  if (!showAll.value && all.length > maxItems) return all.slice(0, maxItems)
  return all
})

const shouldShowSeeMore = computed(() => !showAll.value && (portfolio.value?.projects.length || 0) > maxItems)

const toggleShowAll = () => {
  showAll.value = !showAll.value
}
</script>
