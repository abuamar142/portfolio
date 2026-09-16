<template>
  <dl
    v-if="projectCount"
    class="rise mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-4"
    style="--rv-i: 6"
  >
    <div class="panel flex flex-col items-center gap-1.5 p-5 text-center">
      <FolderGit2 class="size-4 text-ink-4" aria-hidden="true" />
      <dd class="font-mono text-2xl tracking-tight text-base-content">
        {{ projectCount }}
      </dd>
      <dt class="text-xs text-ink-3">{{ $t('hero.stats.projects') }}</dt>
    </div>
    <div class="panel flex flex-col items-center gap-1.5 p-5 text-center">
      <Layers class="size-4 text-ink-4" aria-hidden="true" />
      <dd class="font-mono text-2xl tracking-tight text-base-content">
        {{ technologyCount }}
      </dd>
      <dt class="text-xs text-ink-3">{{ $t('hero.stats.technologies') }}</dt>
    </div>
    <div v-if="yearsBuilding" class="panel flex flex-col items-center gap-1.5 p-5 text-center">
      <Sparkles class="size-4 text-ink-4" aria-hidden="true" />
      <dd class="font-mono text-2xl tracking-tight text-base-content">{{ yearsBuilding }}+</dd>
      <dt class="text-xs text-ink-3">{{ $t('hero.stats.experience') }}</dt>
    </div>
  </dl>
</template>

<script setup lang="ts">
import { FolderGit2, Layers, Sparkles } from 'lucide-vue-next'
import { useStats } from '@/composables/useStats'

const { yearsBuilding, projectCount, technologyCount } = useStats()
</script>
