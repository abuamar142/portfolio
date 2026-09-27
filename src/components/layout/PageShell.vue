<template>
  <section :id="id" class="page-top">
    <div class="wrap pb-20 md:pb-28">
      <!-- Pages own exactly one h1; in-page sections stay at h2. -->
      <SectionHeader level="h1" :title="title" :lead="lead">
        <template v-if="$slots.meta" #meta>
          <slot name="meta" />
        </template>
      </SectionHeader>
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import SectionHeader from '@/components/ui/SectionHeader.vue'

/**
 * The standard page frame: page-top section, the shared wrap column, and the
 * page's single h1 header. The default slot is the page body and may include
 * teleported modals — template position has no effect on them once mounted.
 */
defineProps<{ id?: string; title: string; lead?: string }>()
</script>
