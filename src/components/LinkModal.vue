<template>
  <BaseModal
    :open="show"
    :close-label="$t('common.close')"
    labelled-by="link-modal-title"
    box-class="rounded-none"
    @close="$emit('close')"
  >
    <h3 id="link-modal-title" class="font-bold text-lg mb-4">{{ link ? $t('links.editTitle') : $t('links.createTitle') }}</h3>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <div>
        <label for="link-url" class="label"><span class="label-text">{{ $t('links.urlLabel') }}</span></label>
        <input
          id="link-url"
          v-model="form.url"
          type="url"
          required
          autocomplete="off"
          spellcheck="false"
          placeholder="https://"
          class="input input-bordered w-full rounded-none"
        />
        <p v-if="formErrors.url" class="text-error text-xs mt-1">{{ formErrors.url }}</p>
      </div>
      <div>
        <label for="link-title" class="label"><span class="label-text">{{ $t('links.titleLabel') }}</span></label>
        <input
          id="link-title"
          v-model="form.title"
          type="text"
          required
          autocomplete="off"
          class="input input-bordered w-full rounded-none"
        />
      </div>
      <div>
        <label for="link-description" class="label"><span class="label-text">{{ $t('links.descriptionLabel') }}</span></label>
        <textarea
          id="link-description"
          v-model="form.description"
          rows="3"
          class="textarea textarea-bordered w-full rounded-none"
        />
      </div>
      <div>
        <label for="link-tags" class="label"><span class="label-text">{{ $t('links.tagsLabel') }}</span></label>
        <TagInput
          id="link-tags"
          v-model="form.tags"
          :max="5"
          :placeholder="$t('links.tagsPlaceholder')"
          input-class="rounded-none"
        />
      </div>
      <div class="modal-action">
        <button type="button" @click="$emit('close')" class="btn btn-ghost">
          {{ $t('links.cancel') }}
        </button>
        <button type="submit" class="btn btn-primary" :disabled="submitting">
          {{ submitting ? $t('links.saving') : $t('links.save') }}
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseModal from '@/components/ui/BaseModal.vue'
import TagInput from '@/components/ui/TagInput.vue'
import { useToast } from '@/composables/useToast'
import { createLink, updateLink } from '@/services/link'
import type { Link } from '@/services/link'

const props = defineProps<{ show: boolean; link?: Link | null }>()
const emit = defineEmits<{ close: []; saved: [] }>()

const { t } = useI18n()
const toast = useToast()
const submitting = ref(false)
const form = reactive({ url: '', title: '', description: '', tags: [] as string[] })
const formErrors = ref<{ url?: string }>({})

// Edit mode prefills from the link; create mode starts blank.
watch(
  () => props.show,
  (isOpen) => {
    if (!isOpen) return
    formErrors.value = {}
    if (props.link) {
      form.url = props.link.url
      form.title = props.link.title
      form.description = props.link.description || ''
      form.tags = [...props.link.tags]
    } else {
      form.url = ''
      form.title = ''
      form.description = ''
      form.tags = []
    }
  },
)

function validate(): boolean {
  formErrors.value = {}
  if (!form.url.startsWith('http://') && !form.url.startsWith('https://')) {
    formErrors.value.url = t('links.urlInvalid')
    return false
  }
  if (!form.title.trim()) return false
  return true
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  try {
    const payload = {
      url: form.url,
      title: form.title.trim(),
      description: form.description.trim(),
      tags: form.tags,
    }
    if (props.link) {
      await updateLink(props.link.id, payload)
      toast.success(t('links.updatedToast'))
    } else {
      await createLink(payload)
      toast.success(t('links.createdToast'))
    }
    emit('saved')
    emit('close')
  } catch {
    toast.error(props.link ? t('links.updateFailed') : t('links.createFailed'))
  } finally {
    submitting.value = false
  }
}
</script>
