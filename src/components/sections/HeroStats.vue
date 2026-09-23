<template>
  <figure v-if="identity" class="rise figure-block self-start" style="--rv-i: 3">
    <figcaption class="figure-block-head">
      <span class="label label-ink">Fig. 01 / Profile record</span>
    </figcaption>

    <div class="figure-block-body">
      <p class="figure-monogram" aria-hidden="true">{{ initials }}</p>

      <dl class="metric-ladder mt-5 border-t border-hairline-light">
        <div v-if="yearsBuilding" class="metric-row">
          <div class="metric-label">
            <dt class="metric-name">{{ $t('hero.stats.experience') }}</dt>
          </div>
          <dd class="metric-value">{{ yearsBuilding }}<em>+</em></dd>
        </div>

        <div class="metric-row">
          <div class="metric-label">
            <dt class="metric-name">{{ $t('hero.stats.projects') }}</dt>
          </div>
          <dd class="metric-value">{{ projectCount }}</dd>
        </div>

        <div class="metric-row">
          <div class="metric-label">
            <dt class="metric-name">{{ $t('hero.stats.technologies') }}</dt>
          </div>
          <dd class="metric-value">{{ technologyCount }}</dd>
        </div>
      </dl>
    </div>

    <div class="figure-block-foot">
      <span class="label">{{ $t('hero.labels.email') }}</span>
      <a
        :href="`mailto:${identity.email}`"
        class="data transition-colors hover:text-voltage-ink"
      >
        {{ identity.email }}
      </a>
    </div>
  </figure>
</template>

<script setup lang="ts">
import { useStats } from '@/composables/useStats'
import { useIdentity } from '@/composables/useIdentity'

const { yearsBuilding, projectCount, technologyCount } = useStats()
const { identity, initials } = useIdentity()
</script>
