<template>
  <section id="not-found" class="page-top">
    <div
      class="wrap flex min-h-[60vh] flex-col items-center justify-center pb-20 text-center md:pb-28"
    >
      <p class="eyebrow">{{ $t('blog.notFoundLabel') }}</p>
      <h1 class="display-1 mt-6 text-base-content">404</h1>
      <p class="mt-6 max-w-[46ch] text-ink-2">{{ $t('blog.notFoundBody') }}</p>
      <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
        <BaseButton variant="primary" size="lg" to="/" :icon-left="ArrowLeft">
          {{ $t('blog.backHome') }}
        </BaseButton>
        <BaseButton variant="ghost" size="lg" to="/blogs">
          {{ $t('navigation.blog') }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { ArrowLeft } from 'lucide-vue-next'
import BaseButton from '@/components/ui/BaseButton.vue'

useHead({ title: '404', titleTemplate: '%s | Abu Amar' })
</script>
