<template>
  <section id="experiences" class="section">
    <div class="wrap">
      <SectionHeader
        index="02"
        :label="$t('navigation.experience')"
        :title="$t('headings.experience')"
        :lead="$t('experience.subtitle')"
      >
        <template #meta>
          <p v-if="roleCount" class="font-mono text-[11px] uppercase tracking-wider text-ink-4">
            {{ roleCount }} {{ $t('meta.roles') }}
          </p>
        </template>
      </SectionHeader>

      <div class="border-t border-base-300">
        <article
          v-for="experience in portfolio?.experiences"
          :key="`${experience.company}-${experience.position}`"
          class="grid gap-4 border-b border-base-300 py-7 md:grid-cols-[minmax(0,180px)_minmax(0,1fr)] md:gap-8 md:py-8"
        >
          <!-- Left: period and employer -->
          <div class="font-mono text-xs leading-relaxed text-ink-3">
            <p>{{ experience.duration }}</p>
            <p class="mt-1">{{ experience.company }}</p>
          </div>

          <!-- Right: role, scope, stack -->
          <div class="min-w-0">
            <h3 class="text-[15px] font-medium tracking-tight text-base-content md:text-base">
              {{ experience.position }}
            </h3>

            <ul class="mt-3 space-y-2">
              <li
                v-for="desc in experience.description"
                :key="desc"
                class="flex gap-2.5 text-sm leading-relaxed text-ink-2"
              >
                <span class="mt-2 size-1 shrink-0 rounded-full bg-ink-4" aria-hidden="true"></span>
                <span>{{ desc }}</span>
              </li>
            </ul>

            <ul v-if="experience.technologies?.length" class="mt-4 flex flex-wrap gap-1.5">
              <li v-for="tech in experience.technologies" :key="tech" class="chip">
                {{ tech }}
              </li>
            </ul>
          </div>
        </article>

        <p
          v-if="!portfolio?.experiences?.length"
          class="border-b border-base-300 py-12 text-center text-sm text-ink-3"
        >
          No experience data yet.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePortfolio } from '@/composables/usePortfolio'
import { useStats } from '@/composables/useStats'
import SectionHeader from '@/components/ui/SectionHeader.vue'

const { portfolio } = usePortfolio()
const { roleCount } = useStats()
</script>
