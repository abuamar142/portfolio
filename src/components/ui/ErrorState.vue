<template>
  <div
    role="alert"
    class="page-top flex min-h-[70vh] items-center justify-center px-5 pb-20 md:px-8"
  >
    <div class="panel w-full max-w-md p-6 text-center md:p-8">
      <h2 class="display-2 text-base-content">Something went wrong</h2>

      <p class="data mt-4 break-words">{{ message }}</p>

      <BaseButton variant="primary" full-width class="mt-6" @click="$emit('retry')">
        Try again
      </BaseButton>

      <p class="label mt-4">
        Check your connection or try again later
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'

interface Props {
  message: string
}
defineProps<Props>()
defineEmits<{ retry: [] }>()
</script>
