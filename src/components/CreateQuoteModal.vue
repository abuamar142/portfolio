<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="$emit('close')">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div class="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md p-8 z-10">
          <button @click="$emit('close')" class="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>

          <h2 class="text-2xl font-bold text-zinc-900 dark:text-white mb-6">New Quote</h2>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Quote</label>
              <textarea v-model="form.content" required maxlength="500" rows="4" class="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" placeholder="Your quote..." />
              <p class="text-xs text-zinc-400 mt-1 text-right">{{ form.content.length }}/500</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Author Name</label>
                <input v-model="form.author_name" type="text" class="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your name" />
              </div>
              <div>
                <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Source</label>
                <input v-model="form.source" type="text" class="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Book, article..." />
              </div>
            </div>

            <div class="flex items-center gap-3">
              <label class="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                <input type="checkbox" v-model="form.is_anonymous" class="rounded border-zinc-300 dark:border-zinc-600" />
                Post anonymously
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Tags</label>
              <div class="flex flex-wrap gap-2 mb-2">
                <span v-for="tag in form.tags" :key="tag" class="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center gap-1">
                  {{ tag }}
                  <button type="button" @click="removeTag(tag)" class="hover:text-red-500">&times;</button>
                </span>
              </div>
              <input v-model="tagInput" @keydown.enter.prevent="addTag" type="text" class="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Add tag (Enter to confirm)" :disabled="form.tags.length >= 5" />
            </div>

            <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

            <button type="submit" :disabled="loading || !form.content.trim()" class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors">
              {{ loading ? 'Posting...' : 'Post Quote' }}
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { createQuote } from '@/services/quote'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits<{ close: []; created: [] }>()

const loading = ref(false)
const error = ref('')
const tagInput = ref('')

const form = reactive({
  content: '',
  author_name: '',
  is_anonymous: false,
  source: '',
  tags: [] as string[],
})

function addTag() {
  const tag = tagInput.value.trim().toLowerCase()
  if (tag && !form.tags.includes(tag) && form.tags.length < 5) {
    form.tags.push(tag)
    tagInput.value = ''
  }
}

function removeTag(tag: string) {
  form.tags = form.tags.filter(t => t !== tag)
}

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    await createQuote({
      content: form.content.trim(),
      author_name: form.author_name.trim(),
      is_anonymous: form.is_anonymous,
      source: form.source.trim(),
      tags: form.tags,
    })
    // Reset form
    form.content = ''
    form.author_name = ''
    form.is_anonymous = false
    form.source = ''
    form.tags = []
    emit('created')
    emit('close')
  } catch (e: any) {
    error.value = e.response?.data?.error?.details || e.response?.data?.message || 'Failed to create quote'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
