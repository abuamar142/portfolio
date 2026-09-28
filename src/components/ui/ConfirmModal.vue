<template>
  <BaseModal
    :open="open"
    :close-label="$t('common.cancel')"
    :labelled-by="titleId"
    box-class="max-w-md"
    @close="$emit('cancel')"
  >
    <h2 :id="titleId" class="display-2 text-base-content">{{ title }}</h2>
    <p v-if="message" class="mt-3 text-sm text-ink-2">{{ message }}</p>

    <div class="mt-6 flex flex-wrap justify-end gap-2">
      <BaseButton variant="ghost" size="sm" @click="$emit('cancel')">
        {{ $t('common.cancel') }}
      </BaseButton>
      <BaseButton
        variant="danger"
        size="sm"
        :loading="busy"
        @click="$emit('confirm')"
      >
        {{ confirmLabel || $t('common.delete') }}
      </BaseButton>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

/**
 * Themed replacement for window.confirm() on destructive actions: it matches
 * the rest of the UI, keeps the page scrollable/announceable (native confirm
 * blocks the main thread), and can show a busy state while the delete runs.
 *
 * The parent owns the request lifecycle: pass `busy` while the API call is in
 * flight and close the dialog on success.
 */
withDefaults(
  defineProps<{
    open: boolean
    title: string
    message?: string
    confirmLabel?: string
    /** Disables the confirm action and shows a spinner. */
    busy?: boolean
  }>(),
  { message: '', confirmLabel: '', busy: false },
)

defineEmits<{ confirm: []; cancel: [] }>()

const titleId = useId()
</script>
