<template>
  <div class="group relative">
    <Sparkle
      class="pointer-events-none absolute -top-6 right-3 size-6 scale-50 fill-primary/50 text-primary/50 opacity-0 transition-all duration-500 group-hover:rotate-12 group-hover:scale-100 group-hover:opacity-100"
      aria-hidden="true"
    />
    <p class="font-mono text-[11px] tracking-wider text-primary">
      {{ primaryTech }}
    </p>

    <h3 class="mt-2 text-lg font-semibold leading-snug tracking-tight text-base-content">
      {{ project.title }}
    </h3>

    <p v-if="project.description" class="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-2">
      {{ project.description }}
    </p>

    <div
      v-if="project.technologies.length"
      class="mt-4 mb-5 flex flex-wrap items-center gap-1.5"
    >
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
        class="group/link inline-flex min-h-11 items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-primary transition-opacity hover:opacity-80"
      >
        <ArrowUpRight
          class="size-3.5 transition-all duration-300 group-hover/link:-translate-y-1 group-hover/link:translate-x-1"
          aria-hidden="true"
        />
        {{ $t('projects.buttons.demo') }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight, Github, Sparkle } from 'lucide-vue-next'
import type { Project } from '@/types/portfolio'

const props = defineProps<{
  project: Project
}>()

/** Lead framework label, like the reference's card eyebrow. Falls back to first tech. */
const primaryTech = computed(() => props.project.technologies[0] ?? 'Project')
</script>
