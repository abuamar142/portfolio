<template>
  <Teleport to="body">
    <dialog :class="['modal', show ? 'modal-open' : '']" @click.self="$emit('close')">
      <div class="modal-box">
        <button @click="$emit('close')" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><X :size="16" /></button>
        <h2 class="font-bold text-lg mb-4">Edit Quote</h2>

        <form @submit.prevent="handleSubmit" class="space-y-3">
          <div>
            <label class="label"><span class="label-text">Quote</span></label>
            <textarea v-model="form.content" required maxlength="500" rows="4" class="textarea textarea-bordered w-full resize-none" placeholder="Your quote..." />
            <p class="text-xs text-ink-4 mt-1 text-right">{{ form.content.length }}/500</p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="label"><span class="label-text">Author Name</span></label>
              <input v-model="form.author_name" type="text" class="input input-bordered w-full" placeholder="Your name" />
            </div>
            <div>
              <label class="label"><span class="label-text">Source</span></label>
              <input v-model="form.source" type="text" class="input input-bordered w-full" placeholder="Book, article..." />
            </div>
          </div>

          <div class="form-control">
            <label class="label cursor-pointer justify-start gap-2">
              <input type="checkbox" v-model="form.is_anonymous" class="checkbox checkbox-primary checkbox-sm" />
              <span class="label-text">Post anonymously</span>
            </label>
          </div>

          <div>
            <label class="label"><span class="label-text">Tags</span></label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span v-for="tag in form.tags" :key="tag" class="chip chip-primary flex items-center gap-1">
                {{ tag }}
                <button type="button" @click="removeTag(tag)" class="text-xs hover:text-error">&times;</button>
              </span>
            </div>
            <input v-model="tagInput" @keydown.enter.prevent="addTag" type="text" class="input input-bordered w-full" placeholder="Add tag (Enter to confirm)" :disabled="form.tags.length >= 5" />
          </div>

          <p v-if="error" class="text-sm text-error">{{ error }}</p>

          <div class="modal-action">
            <button type="button" @click="$emit('close')" class="btn btn-ghost">Cancel</button>
            <button type="submit" :disabled="loading || !form.content.trim()" class="btn btn-primary">
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop"><button>close</button></form>
    </dialog>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import { updateQuote } from '@/services/quote'
import type { Quote } from '@/types/quote'

const props = defineProps<{ show: boolean; quote: Quote | null }>()
const emit = defineEmits<{ close: []; updated: [] }>()

const toast = useToast()
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

// Populate form when quote changes
watch(() => props.quote, (q) => {
  if (q) {
    form.content = q.content
    form.author_name = q.author_name
    form.is_anonymous = q.is_anonymous
    form.source = q.source
    form.tags = [...(q.tags || [])]
  }
}, { immediate: true })

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
  if (!props.quote) return
  loading.value = true
  error.value = ''

  try {
    await updateQuote(props.quote.id, {
      content: form.content.trim(),
      author_name: form.author_name.trim(),
      is_anonymous: form.is_anonymous,
      source: form.source.trim(),
      tags: form.tags,
    })
    toast.success('Quote updated!')
    emit('updated')
    emit('close')
  } catch (e: unknown) {
    type AxiosLike = { response?: { data?: { error?: { details?: string }; message?: string } } }
    const err = (e && typeof e === 'object' && 'response' in e) ? (e as AxiosLike) : null
    const msg = err?.response?.data?.error?.details || err?.response?.data?.message || 'Failed to update quote'
    error.value = msg
    toast.error(msg)
  } finally {
    loading.value = false
  }
}
</script>
