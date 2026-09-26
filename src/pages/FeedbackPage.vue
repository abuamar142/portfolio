<template>
  <section id="feedback" class="page-top">
    <div class="wrap pb-20 md:pb-28">
      <SectionHeader level="h1" :title="$t('feedback.title')" :lead="$t('feedback.dek')" />

      <div class="panel p-6 md:p-8">
        <div v-if="submitted" class="py-6 text-center">
          <p class="display-2 mb-2">{{ $t('feedback.successTitle') }}</p>
          <p class="text-ink-3 mb-6">{{ $t('feedback.successBody') }}</p>
          <button class="btn btn-primary btn-sm" @click="resetForm">
            {{ $t('feedback.sendAgain') }}
          </button>
        </div>

        <form v-else class="flex flex-col gap-5" @submit.prevent="handleSubmit">
          <div>
            <label class="label">
              <span class="label-text">{{ $t('feedback.messageLabel') }} *</span>
            </label>
            <textarea
              v-model="message"
              rows="4"
              maxlength="500"
              required
              class="textarea textarea-bordered w-full resize-none"
              :placeholder="$t('feedback.messagePlaceholder')"
            />
            <div class="flex items-center justify-between mt-1">
              <p v-if="errorMsg" class="text-sm text-error">{{ errorMsg }}</p>
              <span class="text-ink-4 ml-auto text-xs">{{ $t('feedback.charCount', { count: message.length }) }}</span>
            </div>
          </div>

          <div>
            <label class="label">
              <span class="label-text">{{ $t('feedback.contactLabel') }}</span>
            </label>
            <input
              v-model="contact"
              type="text"
              maxlength="120"
              class="input input-bordered w-full"
              :placeholder="$t('feedback.contactPlaceholder')"
            />
          </div>

          <!-- Honeypot — visually hidden; bots auto-fill it -->
          <div
            class="hidden"
            aria-hidden="true"
            tabindex="-1"
            autocomplete="off"
          >
            <label for="hp-website">Website</label>
            <input id="hp-website" v-model="website" name="website" type="text" tabindex="-1" autocomplete="off" />
          </div>

          <div>
            <button
              type="submit"
              class="btn btn-primary btn-sm"
              :disabled="submitting"
            >
              {{ submitting ? $t('feedback.submitting') : $t('feedback.submit') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import { useToast } from '@/composables/useToast'
import { submitFeedback } from '@/services/feedback'

const { t } = useI18n()
const toast = useToast()

const message = ref('')
const contact = ref('')
const website = ref('') // honeypot
const submitting = ref(false)
const submitted = ref(false)
const errorMsg = ref('')

useHead({
  title: computed(() => t('head.feedback.title')),
  meta: [
    { name: 'description', content: computed(() => t('head.feedback.dek')) },
    { property: 'og:title', content: computed(() => `${t('head.feedback.title')} - Abu Amar`) },
    { property: 'og:description', content: computed(() => t('head.feedback.dek')) },
  ],
})

async function handleSubmit() {
  if (!message.value.trim()) {
    errorMsg.value = t('feedback.messageRequired')
    return
  }
  errorMsg.value = ''
  submitting.value = true
  try {
    await submitFeedback({
      message: message.value.trim(),
      contact: contact.value.trim() || undefined,
      page_url: !import.meta.env.SSR ? window.location.href : undefined,
      website: website.value || undefined,
    })
    submitted.value = true
    toast.success(t('feedback.successTitle'))
  } catch {
    toast.error(t('feedback.errorDefault'))
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  message.value = ''
  contact.value = ''
  website.value = ''
  submitted.value = false
  errorMsg.value = ''
}
</script>
