<template>
  <section id="hero" class="wrap pb-14 pt-10 md:pb-20 md:pt-14">
    <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
      <p class="label label-ink">{{ identity?.title }}</p>
      <p class="label label-voltage inline-flex items-center gap-2">
        <span class="pulse-dot size-1.5 bg-voltage" aria-hidden="true"></span>
        {{ $t('hero.badge') }}
      </p>
    </div>
    <hr class="hairline mt-4" />

    <div class="grid gap-12 pt-9 md:pt-11 lg:grid-cols-[1fr_minmax(240px,32%)] lg:gap-10">
      <HeroIntro />
      <HeroStats />
    </div>
  </section>
</template>

<script setup lang="ts">
import HeroIntro from '@/components/sections/HeroIntro.vue'
import HeroStats from '@/components/sections/HeroStats.vue'
import { useIdentity } from '@/composables/useIdentity'

const { identity } = useIdentity()
</script>
