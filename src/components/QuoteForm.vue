<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <!-- Intentional: the parent modal owns the reactive form and passes it by
       reference; fields v-model straight into it so create and edit share one
       body without copy-back plumbing. -->
  <div class="space-y-3">
    <div>
      <label :for="`${idPrefix}-content`" class="label"><span class="label-text">{{ $t('quotes.contentLabel') }}</span></label>
      <textarea :id="`${idPrefix}-content`" v-model="form.content" required maxlength="500" rows="4" class="textarea textarea-bordered w-full resize-none" :placeholder="$t('quotes.contentPlaceholder')" />
      <p class="text-xs text-ink-4 mt-1 text-right">{{ form.content.length }}/500</p>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label :for="`${idPrefix}-author`" class="label"><span class="label-text">{{ $t('quotes.authorLabel') }}</span></label>
        <input :id="`${idPrefix}-author`" v-model="form.author_name" type="text" autocomplete="off" class="input input-bordered w-full" :placeholder="$t('quotes.authorPlaceholder')" />
      </div>
      <div>
        <label :for="`${idPrefix}-source`" class="label"><span class="label-text">{{ $t('quotes.sourceLabel') }}</span></label>
        <input :id="`${idPrefix}-source`" v-model="form.source" type="text" autocomplete="off" class="input input-bordered w-full" :placeholder="$t('quotes.sourcePlaceholder')" />
      </div>
    </div>

    <div class="form-control">
      <label class="label cursor-pointer justify-start gap-2">
        <input type="checkbox" v-model="form.is_anonymous" class="checkbox checkbox-primary checkbox-sm" />
        <span class="label-text">{{ $t('quotes.anonymousLabel') }}</span>
      </label>
    </div>

    <div>
      <label :for="`${idPrefix}-tags`" class="label"><span class="label-text">{{ $t('quotes.tagsLabel') }}</span></label>
      <TagInput :id="`${idPrefix}-tags`" v-model="form.tags" :max="5" lowercase :placeholder="$t('quotes.tagsPlaceholder')" />
    </div>

    <p v-if="error" class="text-sm text-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import TagInput from '@/components/ui/TagInput.vue'

interface QuoteFormModel {
  content: string
  author_name: string
  is_anonymous: boolean
  source: string
  tags: string[]
}

withDefaults(
  defineProps<{
    form: QuoteFormModel
    error?: string
    /** Keeps field ids unique when create and edit modals coexist in the DOM. */
    idPrefix?: string
  }>(),
  { error: '', idPrefix: 'quote' },
)
</script>
