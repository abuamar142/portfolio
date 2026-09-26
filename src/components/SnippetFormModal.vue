<template>
  <BaseModal
    :open="show"
    :close-label="$t('common.close')"
    labelled-by="snippet-form-title"
    @close="$emit('close')"
  >
    <h2 id="snippet-form-title" class="font-bold text-lg mb-4">
      {{ snippet ? $t('snippets.editTitle') : $t('snippets.createTitle') }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="snippet-title" class="label"><span class="label-text">{{ $t('snippets.titleLabel') }}</span></label>
          <input
            id="snippet-title"
            v-model="form.title"
            type="text"
            required
            maxlength="255"
            autocomplete="off"
            class="input input-bordered w-full"
            :placeholder="$t('snippets.titleLabel')"
          />
        </div>
        <div>
          <label for="snippet-language" class="label"><span class="label-text">{{ $t('snippets.language') }}</span></label>
          <input
            id="snippet-language"
            v-model="form.language"
            type="text"
            required
            maxlength="50"
            autocomplete="off"
            spellcheck="false"
            class="input input-bordered w-full"
            :placeholder="$t('snippets.language')"
          />
        </div>
      </div>

      <div>
        <label for="snippet-description" class="label"><span class="label-text">{{ $t('snippets.description') }}</span></label>
        <textarea
          id="snippet-description"
          v-model="form.description"
          rows="2"
          class="textarea textarea-bordered w-full resize-none"
          :placeholder="$t('snippets.description')"
        />
      </div>

      <div>
        <label for="snippet-code" class="label"><span class="label-text">{{ $t('snippets.code') }}</span></label>
        <textarea
          id="snippet-code"
          v-model="form.code"
          required
          rows="10"
          class="textarea textarea-bordered w-full font-mono text-sm resize-y"
          autocomplete="off"
          autocapitalize="none"
          spellcheck="false"
          :placeholder="$t('snippets.code')"
        />
      </div>

      <div>
        <label for="snippet-tags" class="label"><span class="label-text">{{ $t('snippets.tags') }}</span></label>
        <TagInput
          id="snippet-tags"
          v-model="form.tags"
          :max="20"
          :placeholder="$t('snippets.tagsPlaceholder')"
        />
      </div>

      <p v-if="error" class="text-sm text-error">{{ error }}</p>

      <BaseButton
        type="submit"
        variant="primary"
        full-width
        :loading="loading"
        :loading-label="snippet ? $t('snippets.saving') : $t('snippets.posting')"
        :disabled="loading || !form.title.trim() || !form.language.trim() || !form.code.trim()"
      >
        {{ snippet ? $t('snippets.save') : $t('snippets.submit') }}
      </BaseButton>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useToast } from '@/composables/useToast'
import { createSnippet, updateSnippet } from '@/services/snippet'
import type { Snippet } from '@/types/snippet'
import TagInput from '@/components/ui/TagInput.vue'

const props = defineProps<{ show: boolean; snippet?: Snippet | null }>()
const emit = defineEmits<{ close: []; saved: [] }>()

const { t } = useI18n()
const toast = useToast()
const loading = ref(false)
const error = ref('')

const form = reactive({
  title: '',
  language: '',
  description: '',
  code: '',
  tags: [] as string[],
})

function resetForm() {
  form.title = ''
  form.language = ''
  form.description = ''
  form.code = ''
  form.tags = []
}

watch(
  () => props.show,
  (isOpen) => {
    if (!isOpen) return
    error.value = ''
    if (props.snippet) {
      form.title = props.snippet.title
      form.language = props.snippet.language
      form.description = props.snippet.description || ''
      form.code = props.snippet.code
      form.tags = [...(props.snippet.tags || [])]
    } else {
      resetForm()
    }
  },
)

async function handleSubmit() {
  loading.value = true
  error.value = ''

  const payload = {
    title: form.title.trim(),
    language: form.language.trim(),
    code: form.code,
    description: form.description.trim(),
    tags: form.tags,
  }

  try {
    if (props.snippet) {
      await updateSnippet(props.snippet.id, payload)
      toast.success(t('snippets.updatedToast'))
    } else {
      await createSnippet(payload)
      resetForm()
      toast.success(t('snippets.postedToast'))
    }
    emit('saved')
    emit('close')
  } catch (e: unknown) {
    type AxiosLike = { response?: { data?: { error?: { details?: string }; message?: string } } }
    const err = (e && typeof e === 'object' && 'response' in e) ? (e as AxiosLike) : null
    const fallback = props.snippet ? t('snippets.updateFailed') : t('snippets.createFailed')
    const msg = err?.response?.data?.error?.details || err?.response?.data?.message || fallback
    error.value = msg
    toast.error(msg)
  } finally {
    loading.value = false
  }
}
</script>
