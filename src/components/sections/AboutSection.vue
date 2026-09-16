<template>
  <section id="about" class="section">
    <div v-reveal class="wrap">
      <SectionHeader :title="$t('headings.about')" />

      <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
        <!-- Facts, straight from portfolio data -->
        <dl class="order-2 border-t border-base-300 lg:order-1">
          <div
            v-if="yearsBuilding"
            class="flex items-baseline justify-between gap-4 border-b border-base-300 py-3.5"
          >
            <dt class="text-xs text-ink-3">{{ $t('about.stats.years') }}</dt>
            <dd class="font-mono text-sm text-base-content">{{ yearsBuilding }}+</dd>
          </div>

          <div class="flex items-baseline justify-between gap-4 border-b border-base-300 py-3.5">
            <dt class="text-xs text-ink-3">{{ $t('about.stats.projects') }}</dt>
            <dd class="font-mono text-sm text-base-content">{{ projectCount }}</dd>
          </div>

          <div class="flex items-baseline justify-between gap-4 border-b border-base-300 py-3.5">
            <dt class="text-xs text-ink-3">{{ $t('about.stats.technologies') }}</dt>
            <dd class="font-mono text-sm text-base-content">{{ technologyCount }}</dd>
          </div>
        </dl>

        <div class="order-1 min-w-0 lg:order-2">
          <p class="lead">{{ aboutBody }}</p>

          <div v-if="identity" class="mt-8">
            <BaseButton variant="outline" size="sm" :href="`mailto:${identity.email}`">
              <Mail class="size-4 shrink-0" aria-hidden="true" />
              {{ identity.email }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Mail } from 'lucide-vue-next'
import { usePortfolio } from '@/composables/usePortfolio'
import { useStats } from '@/composables/useStats'
import { useIdentity } from '@/composables/useIdentity'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const { locale } = useI18n()
const { portfolio } = usePortfolio()
const { identity } = useIdentity()
const { yearsBuilding, projectCount, technologyCount } = useStats()

/** About body from CMS, in the active locale. */
const aboutBody = computed(() =>
  locale.value === 'id' ? (identity.value?.about_id ?? '') : (identity.value?.about_en ?? ''),
)
</script>
