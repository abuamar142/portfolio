<template>
  <BaseModal
    :open="show"
    :close-label="$t('common.close')"
    labelled-by="create-quote-title"
    @close="$emit('close')"
  >
    <h2 id="create-quote-title" class="font-bold text-lg mb-4">{{ $t('quotes.createTitle') }}</h2>

        <form @submit.prevent="handleSubmit" class="space-y-3">
          <div>
            <label for="quote-content" class="label"><span class="label-text">{{ $t('quotes.contentLabel') }}</span></label>
            <textarea id="quote-content" v-model="form.content" required maxlength="500" rows="4" class="textarea textarea-bordered w-full resize-none" :placeholder="$t('quotes.contentPlaceholder')" />
            <p class="text-xs text-ink-4 mt-1 text-right">{{ form.content.length }}/500</p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="quote-author" class="label"><span class="label-text">{{ $t('quotes.authorLabel') }}</span></label>
              <input id="quote-author" v-model="form.author_name" type="text" autocomplete="off" class="input input-bordered w-full" :placeholder="$t('quotes.authorPlaceholder')" />
            </div>
            <div>
              <label for="quote-source" class="label"><span class="label-text">{{ $t('quotes.sourceLabel') }}</span></label>
              <input id="quote-source" v-model="form.source" type="text" autocomplete="off" class="input input-bordered w-full" :placeholder="$t('quotes.sourcePlaceholder')" />
            </div>
          </div>

          <div class="form-control">
            <label class="label cursor-pointer justify-start gap-2">
              <input type="checkbox" v-model="form.is_anonymous" class="checkbox checkbox-primary checkbox-sm" />
              <span class="label-text">{{ $t('quotes.anonymousLabel') }}</span>
            </label>
          </div>

          <div>
            <label for="quote-tags" class="label"><span class="label-text">{{ $t('quotes.tagsLabel') }}</span></label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span v-for="tag in form.tags" :key="tag" class="chip chip-primary flex items-center gap-1">
                {{ tag }}
                <button type="button" :aria-label="$t('quotes.removeTag', { tag })" @click="removeTag(tag)" class="text-xs hover:text-error">×</button>
              </span>
            </div>
            <input id="quote-tags" v-model="tagInput" @keydown.enter.prevent="addTag" type="text" autocomplete="off" class="input input-bordered w-full" :placeholder="$t('quotes.tagsPlaceholder')" :disabled="form.tags.length >= 5" />
          </div>

          <p v-if="error" class="text-sm text-error">{{ error }}</p>

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
const tagInput = ref('')

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
