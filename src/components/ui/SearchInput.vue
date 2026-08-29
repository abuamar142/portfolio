<template>
  <div class="relative w-full max-w-md">
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="w-4 h-4" style="color: var(--color-text-faint)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        type="text"
        :placeholder="placeholder"
        class="block w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all"
        style="background: var(--color-surface-raised); border-color: var(--color-border); color: var(--color-text-primary)"
        :style="{ '--tw-ring-color': 'var(--color-accent-ring)' } as any"
      />
      <button
        v-if="modelValue"
        @click="$emit('update:modelValue', '')"
        class="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors"
        type="button"
        :aria-label="$t('search.clearSearch')"
        style="color: var(--color-text-faint)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div v-if="resultsCount !== undefined" class="mt-2">
      <span class="text-xs font-mono" style="color: var(--color-text-faint)"> {{ resultsCount }} {{ $t('search.results') }} </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
  resultsCount?: number
}
defineProps<Props>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
