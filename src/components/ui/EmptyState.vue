<template>
  <div class="text-center py-20">
    <component :is="icon" v-if="icon" :size="64" class="mx-auto mb-4 text-ink-4" />
    <p class="display-2 mb-2">{{ title }}</p>
    <p v-if="dek" class="text-ink-3 mb-4">{{ dek }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon?: Component
  title: string
  dek?: string
}>()
</script>
