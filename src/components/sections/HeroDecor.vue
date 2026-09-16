<template>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 hidden overflow-hidden md:block"
  >
    <Sparkle
      class="deco-float absolute right-[10%] top-16 size-9 text-primary/50 [animation-duration:3s]"
    />
    <Plus class="deco-float absolute left-[8%] top-24 size-6 text-ink-3/40 [animation-duration:5s]" />
    <CircleDashed
      class="deco-spin absolute bottom-24 right-[12%] size-10 text-ink-3/30 [animation-duration:8s]"
    />
    <Asterisk
      class="deco-float absolute bottom-32 left-[10%] size-8 text-primary/40 [animation-duration:4s]"
    />
  </div>
</template>

<script setup lang="ts">
import { Asterisk, CircleDashed, Plus, Sparkle } from 'lucide-vue-next'
</script>
