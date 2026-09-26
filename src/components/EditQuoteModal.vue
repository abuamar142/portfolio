<template>
  <BaseModal
    :open="show"
    :close-label="$t('common.close')"
    labelled-by="edit-quote-title"
    @close="$emit('close')"
  >
    <h2 id="edit-quote-title" class="font-bold text-lg mb-4">{{ $t('quotes.editTitle') }}</h2>

                <form @submit.prevent="handleSubmit" class="space-y-3">
          <QuoteForm :form="form" :error="error" id-prefix="edit-quote" />

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
import QuoteForm from '@/components/QuoteForm.vue'
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
