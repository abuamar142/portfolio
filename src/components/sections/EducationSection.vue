<template>
  <section id="education" class="section">
    <div class="wrap">
      <SectionHeader
        index="05"
        :label="$t('navigation.education')"
        :title="$t('headings.education')"
        :lead="$t('education.subtitle')"
      />

      <div class="grid gap-5 sm:grid-cols-2 md:gap-6">
        <article
          v-for="edu in education"
          :key="`${edu.institution}-${edu.degree}`"
          class="panel flex flex-col p-6"
        >
          <h3 class="font-medium tracking-tight text-base-content">{{ edu.institution }}</h3>

          <p class="mt-3 text-sm text-ink-2">
            {{ edu.degree }}
            <span aria-hidden="true" class="mx-1.5 text-ink-4">·</span>
            <span class="text-ink-3">{{ edu.field }}</span>
          </p>

          <p class="mt-2 font-mono text-xs text-ink-3">{{ edu.duration }}</p>

          <p v-if="edu.gpa" class="mt-6 border-t border-base-300 pt-4">
            <span class="chip">{{ $t('education.labels.gpa') }} {{ edu.gpa }}</span>
          </p>
        </article>
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
