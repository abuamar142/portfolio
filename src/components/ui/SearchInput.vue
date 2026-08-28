<template>
  <div class="relative w-full max-w-md">
    <div class="relative">
      <!-- Search Icon -->
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Input Field -->
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        type="text"
        id="search-input"
        name="search"
        :placeholder="placeholder"
        class="block w-full pl-10 pr-10 py-2.5 bg-surface-raised border border-border rounded-lg text-text-primary placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 hover:border-border"
      />

      <!-- Clear Button -->
      <button
        v-if="modelValue"
        @click="$emit('update:modelValue', '')"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary transition-colors duration-200"
        type="button"
        :aria-label="$t('search.clearSearch')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Search Results Count -->
    <div v-if="resultsCount !== undefined" class="mt-2 text-center">
      <span class="text-xs text-text-muted">
        {{ resultsCount }} {{ $t('search.results') }}
      </span>
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

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
