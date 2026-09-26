<template>
  <BaseModal
    :open="show"
    :close-label="$t('common.close')"
    labelled-by="create-quote-title"
    @close="$emit('close')"
  >
    <h2 id="create-quote-title" class="font-bold text-lg mb-4">{{ $t('quotes.createTitle') }}</h2>

                <form @submit.prevent="handleSubmit" class="space-y-3">
          <QuoteForm :form="form" :error="error" id-prefix="quote" />

          <BaseButton
            type="submit"
            variant="primary"
            full-width
            :loading="loading"
            :loading-label="$t('quotes.posting')"
            :disabled="loading || !form.content.trim()"
          >
            {{ $t('quotes.submit') }}
          </BaseButton>
        </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import QuoteForm from '@/components/QuoteForm.vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { createQuote } from '@/services/quote'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits<{ close: []; created: [] }>()

const { t } = useI18n()
const { user } = useAuth()
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

// Auto-fill author name when modal opens
watch(() => props.show, (isOpen) => {
  if (isOpen && user.value) {
    form.author_name = user.value.display_name || user.value.username || ''
  }
})

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
    form.content = ''
    form.author_name = ''
    form.is_anonymous = false
    form.source = ''
    form.tags = []
    toast.success(t('quotes.postedToast'))
    emit('created')
    emit('close')
  } catch (e: unknown) {
    type AxiosLike = { response?: { data?: { error?: { details?: string }; message?: string } } }
    const err = (e && typeof e === 'object' && 'response' in e) ? (e as AxiosLike) : null
    const msg = err?.response?.data?.error?.details || err?.response?.data?.message || t('quotes.createFailed')
    error.value = msg
    toast.error(msg)
  } finally {
    loading.value = false
  }
}
</script>
