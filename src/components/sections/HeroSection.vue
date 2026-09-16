<template>
  <section id="hero" class="relative overflow-hidden">
    <div
      aria-hidden="true"
      class="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[420px]"
    ></div>
    <HeroDecor />

    <div class="wrap relative pb-16 pt-28 md:pb-24 md:pt-36">
      <HeroIntro />
      <HeroStats />
    </div>
  </section>
</template>

<script setup lang="ts">
import HeroDecor from '@/components/sections/HeroDecor.vue'
import HeroIntro from '@/components/sections/HeroIntro.vue'
import HeroStats from '@/components/sections/HeroStats.vue'
</script>

