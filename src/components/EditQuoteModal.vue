<template>
  <BaseModal
    :open="show"
    :close-label="$t('common.close')"
    labelled-by="edit-quote-title"
    @close="$emit('close')"
  >
    <h2 id="edit-quote-title" class="font-bold text-lg mb-4">{{ $t('quotes.editTitle') }}</h2>

        <form @submit.prevent="handleSubmit" class="space-y-3">
          <div>
            <label for="edit-quote-content" class="label"><span class="label-text">{{ $t('quotes.contentLabel') }}</span></label>
            <textarea id="edit-quote-content" v-model="form.content" required maxlength="500" rows="4" class="textarea textarea-bordered w-full resize-none" :placeholder="$t('quotes.contentPlaceholder')" />
            <p class="text-xs text-ink-4 mt-1 text-right">{{ form.content.length }}/500</p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="edit-quote-author" class="label"><span class="label-text">{{ $t('quotes.authorLabel') }}</span></label>
              <input id="edit-quote-author" v-model="form.author_name" type="text" autocomplete="off" class="input input-bordered w-full" :placeholder="$t('quotes.authorPlaceholder')" />
            </div>
            <div>
              <label for="edit-quote-source" class="label"><span class="label-text">{{ $t('quotes.sourceLabel') }}</span></label>
              <input id="edit-quote-source" v-model="form.source" type="text" autocomplete="off" class="input input-bordered w-full" :placeholder="$t('quotes.sourcePlaceholder')" />
            </div>
          </div>

          <div class="form-control">
            <label class="label cursor-pointer justify-start gap-2">
              <input type="checkbox" v-model="form.is_anonymous" class="checkbox checkbox-primary checkbox-sm" />
              <span class="label-text">{{ $t('quotes.anonymousLabel') }}</span>
            </label>
          </div>

          <div>
            <label for="edit-quote-tags" class="label"><span class="label-text">{{ $t('quotes.tagsLabel') }}</span></label>
            <TagInput id="edit-quote-tags" v-model="form.tags" :max="5" lowercase :placeholder="$t('quotes.tagsPlaceholder')" />
          </div>

          <p v-if="error" class="text-sm text-error">{{ error }}</p>

          <div class="modal-action">
            <BaseButton type="button" variant="ghost" @click="$emit('close')">{{ $t('quotes.cancel') }}</BaseButton>
            <BaseButton
              type="submit"
              variant="primary"
              :loading="loading"
              :loading-label="$t('quotes.saving')"
              :disabled="loading || !form.content.trim()"
            >
              {{ $t('quotes.save') }}
            </BaseButton>
          </div>
        </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TagInput from '@/components/ui/TagInput.vue'
import { useToast } from '@/composables/useToast'
import { updateQuote } from '@/services/quote'
import type { Quote } from '@/types/quote'

const props = defineProps<{ show: boolean; quote: Quote | null }>()
const emit = defineEmits<{ close: []; updated: [] }>()

const { t } = useI18n()
const toast = useToast()
const loading = ref(false)
const error = ref('')

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
    toast.success(t('quotes.updatedToast'))
    emit('updated')
    emit('close')
  } catch (e: unknown) {
    type AxiosLike = { response?: { data?: { error?: { details?: string }; message?: string } } }
    const err = (e && typeof e === 'object' && 'response' in e) ? (e as AxiosLike) : null
    const msg = err?.response?.data?.error?.details || err?.response?.data?.message || t('quotes.updateFailed')
    error.value = msg
    toast.error(msg)
  } finally {
    loading.value = false
  }
}
</script>
