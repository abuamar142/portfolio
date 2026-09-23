<template>
  <section id="education" class="section">
    <div v-reveal class="wrap">
      <SectionHeader
        :title="$t('headings.education')"
        :lead="$t('education.subtitle')"
        index="05"
        :kicker="$t('navigation.education')"
      />

      <div class="border-t border-base-300 mt-10">
        <div
          v-for="edu in education"
          :key="`${edu.institution}-${edu.degree}`"
          class="row grid md:grid-cols-[minmax(0,180px)_minmax(0,1fr)] gap-y-1 md:gap-x-8 py-5"
        >
          <div class="row-place">{{ edu.duration }}</div>
          <div>
            <div class="row-title">{{ edu.institution }}</div>
            <p class="row-dek mt-0.5">{{ edu.degree }} &middot; {{ edu.field }}</p>
            <p v-if="edu.gpa" class="mt-3">
              <span class="chip">{{ $t('education.labels.gpa') }} {{ edu.gpa }}</span>
            </p>
          </div>
        </div>

        <p v-if="education.length === 0" class="data py-8 text-center">
          {{ $t('education.empty') }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolio } from '@/composables/usePortfolio'
import SectionHeader from '@/components/ui/SectionHeader.vue'

const { portfolio } = usePortfolio()

const education = computed(() => portfolio.value?.education || [])
</script>
