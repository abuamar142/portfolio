<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div>
      <label class="block text-sm text-dracula-comment mb-1">Markdown</label>
      <textarea
        v-model="model"
        rows="16"
        class="w-full px-3 py-2 bg-transparent border border-gray-600 rounded text-dracula-foreground focus:outline-none focus:border-dracula-purple font-mono"
      />
    </div>
    <div>
      <label class="block text-sm text-dracula-comment mb-1">Preview</label>
      <div class="min-h-[12rem] p-3 border border-gray-600 rounded bg-dracula-selection prose prose-invert max-w-none" v-html="previewHtml"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdownToHtml } from '@/utils/markdown'

const modelValue = defineModel<string>({ default: '' })
const model = computed({
  get: () => modelValue.value,
  set: (v: string) => (modelValue.value = v),
})

const previewHtml = computed(() => renderMarkdownToHtml(model.value))
</script>

