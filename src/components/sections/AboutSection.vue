<template>
  <section id="about" class="section">
    <div class="wrap">
      <SectionHeader index="01" :label="$t('navigation.about')" :title="$t('headings.about')" />

      <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
        <!-- Facts, straight from portfolio data -->
        <dl class="order-2 border-t border-base-300 lg:order-1">
          <div
            v-if="yearsBuilding"
            class="flex items-baseline justify-between gap-4 border-b border-base-300 py-3.5"
          >
            <dt class="eyebrow">{{ $t('about.stats.years') }}</dt>
            <dd class="font-mono text-sm text-base-content">{{ yearsBuilding }}+</dd>
          </div>

          <div class="flex items-baseline justify-between gap-4 border-b border-base-300 py-3.5">
            <dt class="eyebrow">{{ $t('about.stats.projects') }}</dt>
            <dd class="font-mono text-sm text-base-content">{{ projectCount }}</dd>
          </div>

          <div class="flex items-baseline justify-between gap-4 border-b border-base-300 py-3.5">
            <dt class="eyebrow">{{ $t('about.stats.technologies') }}</dt>
            <dd class="font-mono text-sm text-base-content">{{ technologyCount }}</dd>
          </div>
        </dl>

        <div class="order-1 min-w-0 lg:order-2">
          <p class="lead">{{ portfolio?.about || $t('about.body') }}</p>

          <div class="mt-8">
            <BaseButton variant="outline" size="sm" :href="`mailto:${profile.email}`">
              <Mail class="size-4 shrink-0" aria-hidden="true" />
              {{ profile.email }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Mail } from 'lucide-vue-next'
import { profile } from '@/data/profile'
import { usePortfolio } from '@/composables/usePortfolio'
import { useStats } from '@/composables/useStats'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const { portfolio } = usePortfolio()
const { yearsBuilding, projectCount, technologyCount } = useStats()
</script>
