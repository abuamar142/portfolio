<template>
  <div class="relative w-full max-w-md mx-auto">
    <div class="relative">
      <!-- Search Icon -->
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          class="w-5 h-5 text-dracula-comment"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <!-- Input Field -->
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        type="text"
        :placeholder="placeholder"
        class="block w-full pl-10 pr-12 py-3 bg-dracula-selection border border-gray-500 rounded-lg text-dracula-foreground placeholder-dracula-comment font-mono text-sm focus:outline-none focus:ring-2 focus:ring-dracula-purple focus:border-dracula-purple transition-all duration-300 hover:border-dracula-purple/50"
      />

      <!-- Clear Button -->
      <button
        v-if="modelValue"
        @click="$emit('update:modelValue', '')"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-dracula-comment hover:text-dracula-purple transition-colors duration-200"
        type="button"
        :aria-label="$t('search.clearSearch')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Search Results Count -->
    <div v-if="resultsCount !== undefined" class="mt-2 text-center">
      <span class="text-xs text-dracula-comment font-mono">
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
