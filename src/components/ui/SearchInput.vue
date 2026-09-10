<template>
  <div class="w-full max-w-md">
    <label :for="inputId" class="sr-only">{{ placeholder || $t('search.placeholder') }}</label>

    <div class="relative">
      <SearchIcon
        class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-4"
        aria-hidden="true"
      />

      <input
        :id="inputId"
        :value="modelValue"
        type="search"
        :placeholder="placeholder"
        class="input input-sm min-h-11 w-full border-base-300 bg-base-200 pl-9 pr-12 text-sm text-base-content placeholder:text-ink-4 focus:border-primary/40 [&::-webkit-search-cancel-button]:hidden"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />

      <button
        v-if="modelValue"
        type="button"
        class="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center rounded-r-lg text-ink-3 transition-colors hover:text-base-content"
        :aria-label="$t('search.clearSearch')"
        @click="$emit('update:modelValue', '')"
      >
        <X class="size-4" aria-hidden="true" />
      </button>
    </div>

    <p v-if="resultsCount !== undefined" class="mt-2 font-mono text-[11px] text-ink-4">
      {{ resultsCount }} {{ $t('search.results') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import { Search as SearchIcon, X } from 'lucide-vue-next'

interface Props {
  modelValue: string
  placeholder?: string
  resultsCount?: number
}

defineProps<Props>()
defineEmits<{ 'update:modelValue': [value: string] }>()

const inputId = `search-${useId()}`
</script>
