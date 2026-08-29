<template>
  <div class="flex-1 flex items-center justify-center p-6 md:p-8">
    <div class="text-center max-w-sm w-full mx-auto rounded-xl border p-6 md:p-8" style="background: var(--color-surface); border-color: var(--color-border)">
      <div class="w-8 h-8 rounded-full border flex items-center justify-center mx-auto mb-4" style="border-color: var(--color-border); color: var(--color-error); background: var(--color-surface-raised)">!</div>
      <h2 class="text-sm font-semibold tracking-tight mb-2" style="color: var(--color-text-primary)">
        Oops! Something went wrong
      </h2>
      <div class="text-xs mb-6">
        <div class="rounded-lg p-3 border text-left break-words" style="background: var(--color-surface-raised); border-color: var(--color-border)">
          <span class="font-medium" style="color: var(--color-error)">Error:</span>
          <div class="mt-1" style="color: var(--color-text-muted)">
            {{ message }}
          </div>
        </div>
      </div>
      <button
        @click="$emit('retry')"
        class="w-full px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
        style="background: var(--color-text-primary); color: var(--color-bg)"
      >
        Try Again
      </button>
      <p class="mt-4 text-xs font-mono" style="color: var(--color-text-faint)">
        Check your connection or try again later.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string
}
defineProps<Props>()
defineEmits<{ retry: [] }>()
</script>
