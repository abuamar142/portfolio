<template>
  <section id="experiences" class="section">
    <div v-reveal class="wrap">
      <SectionHeader
        :title="$t('headings.experience')"
        :lead="$t('experience.subtitle')"
        :index="'02'"
        :kicker="$t('navigation.experience')"
      >
        <template #meta>
          <p v-if="roleCount" class="data">
            {{ roleCount }} {{ $t('meta.roles') }}
          </p>
        </template>
      </SectionHeader>

      <div class="border-t border-base-300">
        <ExperienceRow
          v-for="experience in portfolio?.experiences"
          :key="`${experience.company}-${experience.position}`"
          :experience="experience"
        />

        <p
          v-if="!portfolio?.experiences?.length"
          class="border-b border-base-300 py-12 text-center data"
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
import ExperienceRow from '@/components/sections/ExperienceRow.vue'

const { portfolio } = usePortfolio()
const { roleCount } = useStats()
</script>
