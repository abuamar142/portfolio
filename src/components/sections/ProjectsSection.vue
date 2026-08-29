<template>
  <section id="projects" class="scroll-mt-14 border-b" style="background: var(--color-bg); border-color: var(--color-border)">
    <div class="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
      <div class="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <div class="text-[11px] font-mono tracking-[0.14em] uppercase mb-3" style="color: var(--color-text-faint)">03 — Projects</div>
          <h2 class="text-[22px] md:text-[26px] font-semibold tracking-tighter leading-none" style="color: var(--color-text-primary); letter-spacing: -0.03em">
            {{ $t('projects.title') }}
          </h2>
          <p class="mt-3 text-sm max-w-[520px] leading-relaxed" style="color: var(--color-text-muted)">
            Selected work — 3 deployed products, minimal cards, generous gap.
          </p>
        </div>
        <div class="text-[11px] font-mono" style="color: var(--color-text-faint)">{{ portfolio?.projects?.length || 0 }} total</div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        <article
          v-for="(project, index) in displayedProjects"
          :key="index"
          class="group flex flex-col rounded-xl border overflow-hidden transition-colors hover:brightness-[1.02]"
          style="background: var(--color-surface); border-color: var(--color-border)"
        >
          <!-- Media placeholder / image -->
          <div class="h-36 md:h-40 border-b relative overflow-hidden" style="background: var(--color-surface-raised); border-color: var(--color-border)">
            <img
              v-if="project.imageUrl"
              :src="project.imageUrl"
              :alt="project.title"
              loading="lazy"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-[11px] font-mono tracking-[0.14em] uppercase" style="color: var(--color-text-faint)">{{ project.title.slice(0, 12) }} — IMG</span>
            </div>
            <div class="absolute top-3 left-3 text-[11px] font-mono px-2 py-1 rounded border" style="background: var(--color-bg); border-color: var(--color-border); color: var(--color-text-faint)">
              {{ index + 1 < 10 ? `0${index + 1}` : index + 1 }} / {{ String(displayedProjects.length).padStart(2, '0') }}
            </div>
          </div>

          <div class="p-5 flex flex-col flex-1">
            <h3 class="text-sm font-medium tracking-tight leading-tight" style="color: var(--color-text-primary)">
              {{ project.title }}
            </h3>
            <p class="mt-2 text-[11px] font-mono leading-relaxed line-clamp-3" style="color: var(--color-text-muted)">
              {{ project.description }}
            </p>

            <div class="mt-4 flex flex-wrap gap-1.5">
              <span
                v-for="tech in project.technologies.slice(0, 6)"
                :key="tech"
                class="px-2 py-1 text-[11px] font-mono tracking-wide rounded border"
                style="border-color: var(--color-border); background: var(--color-surface-raised); color: var(--color-text-muted)"
              >
                {{ tech }}
              </span>
              <span
                v-if="project.technologies.length > 6"
                class="px-2 py-1 text-[11px] font-mono rounded"
                style="color: var(--color-text-faint)"
              >
                +{{ project.technologies.length - 6 }}
              </span>
            </div>

            <div class="mt-5 flex items-center gap-3 pt-4 border-t" style="border-color: var(--color-border)">
              <a
                v-if="project.githubUrl"
                :href="project.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium transition-colors"
                style="color: var(--color-text-muted)"
              >
                <Github class="w-3.5 h-3.5" />
                Source
              </a>
              <a
                v-if="project.liveUrl"
                :href="project.liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium transition-colors"
                style="color: var(--color-text-primary)"
              >
                <ExternalLink class="w-3.5 h-3.5" />
                Live
              </a>
              <span v-if="!project.githubUrl && !project.liveUrl" class="text-[11px] font-mono" style="color: var(--color-text-faint)">Private — no links</span>
            </div>
          </div>
        </article>
      </div>

      <div v-if="shouldShowSeeMore || showAll" class="mt-8 flex justify-center">
        <button
          @click="toggleShowAll"
          class="px-4 py-2 rounded-full border text-[11px] font-mono tracking-wide transition-colors"
          style="border-color: var(--color-border); color: var(--color-text-muted); background: var(--color-surface)"
        >
          <span v-if="!showAll">{{ $t('projects.buttons.seeMore') }} — {{ (portfolio?.projects.length || 0) - maxItems }} more</span>
          <span v-else>{{ $t('projects.buttons.seeLess') }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ExternalLink, Github } from 'lucide-vue-next'
import { usePortfolio } from '@/composables/usePortfolio'

const { portfolio } = usePortfolio()

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
