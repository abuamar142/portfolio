<template>
  <section id="about" class="section">
    <div v-reveal class="wrap">
      <SectionHeader
        :title="$t('headings.about')"
        :index="'01'"
        :kicker="$t('navigation.about')"
      />

      <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
        <!-- Facts ledger (left on desktop) -->
        <dl class="order-2 lg:order-1 metric-ladder">
          <div v-if="yearsBuilding" class="metric-row">
            <dt class="metric-name">{{ $t('about.stats.years') }}</dt>
            <dd class="metric-value">{{ yearsBuilding }}<em>+</em></dd>
          </div>

          <div class="metric-row">
            <dt class="metric-name">{{ $t('about.stats.projects') }}</dt>
            <dd class="metric-value">{{ projectCount }}</dd>
          </div>

          <div class="metric-row">
            <dt class="metric-name">{{ $t('about.stats.technologies') }}</dt>
            <dd class="metric-value">{{ technologyCount }}</dd>
          </div>
        </dl>

        <!-- Prose column (right on desktop) -->
        <div class="order-1 min-w-0 lg:order-2">
          <p class="lead max-w-[62ch]">{{ aboutBody }}</p>

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
import { useStats } from '@/composables/useStats'
import { useIdentity } from '@/composables/useIdentity'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const { locale } = useI18n()
const { identity } = useIdentity()
const { yearsBuilding, projectCount, technologyCount } = useStats()

/** About body from CMS, in the active locale. */
const aboutBody = computed(() =>
  locale.value === 'id' ? (identity.value?.about_id ?? '') : (identity.value?.about_en ?? ''),
)
</script>
