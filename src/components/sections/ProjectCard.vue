<template>
  <div class="flex flex-col">
    <img
      v-if="project.imageUrl"
      :src="project.imageUrl"
      :alt="project.title"
      class="aspect-[16/10] w-full object-cover border-b border-hairline-light"
    />

    <div v-if="primaryTech" class="figure-block-head">
      <span class="label label-voltage">{{ primaryTech }}</span>
    </div>

    <div class="figure-block-body flex flex-col flex-1">
      <h3 class="row-title">
        {{ project.title }}
      </h3>

      <p
        v-if="project.description"
        class="mt-1.5 text-base leading-relaxed text-ink-3"
      >
        {{ project.description }}
      </p>

      <div
        v-if="project.technologies.length"
        class="mt-4 flex flex-wrap items-center gap-1.5"
      >
        <span v-for="tech in project.technologies.slice(0, 5)" :key="tech" class="chip">
          {{ tech }}
        </span>
        <span
          v-if="project.technologies.length > 5"
          class="data"
        >
          +{{ project.technologies.length - 5 }}
        </span>
      </div>
    </div>

    <div
      v-if="project.githubUrl || project.liveUrl"
      class="figure-block-foot mt-auto flex-row items-center gap-x-5"
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
import { ArrowUpRight, Github } from 'lucide-vue-next'
import type { Project } from '@/types/portfolio'

const props = defineProps<{
  project: Project
}>()

/** Lead framework label, like the reference's card eyebrow. Falls back to first tech. */
const primaryTech = computed(() => props.project.technologies[0] ?? 'Project')
</script>
