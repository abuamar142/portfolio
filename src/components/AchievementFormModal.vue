<template>
  <BaseModal
    :open="show"
    :close-label="$t('common.close')"
    labelled-by="achievement-form-title"
    @close="$emit('close')"
  >
    <h2 id="achievement-form-title" class="font-bold text-lg mb-4">
      {{ achievement ? $t('dashboard.achievements.editTitle') : $t('dashboard.achievements.createTitle') }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="ach-title" class="label"><span class="label-text">{{ $t('dashboard.achievements.titleLabel') }}</span></label>
          <input
            id="ach-title"
            v-model="form.title"
            type="text"
            required
            maxlength="255"
            autocomplete="off"
            class="input input-bordered w-full"
          />
        </div>
        <div>
          <label for="ach-type" class="label"><span class="label-text">{{ $t('dashboard.achievements.typeLabel') }}</span></label>
          <select
            id="ach-type"
            v-model="form.type"
            required
            class="select select-bordered w-full"
          >
            <option value="certificate">{{ $t('achievements.categories.certificate') }}</option>
            <option value="certification">{{ $t('achievements.categories.certification') }}</option>
            <option value="webinar">{{ $t('achievements.categories.webinar') }}</option>
            <option value="seminar">{{ $t('achievements.categories.seminar') }}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="ach-date" class="label"><span class="label-text">{{ $t('dashboard.achievements.dateLabel') }}</span></label>
          <input
            id="ach-date"
            v-model="form.date"
            type="date"
            required
            class="input input-bordered w-full"
          />
        </div>
        <div>
          <label for="ach-valid-until" class="label"><span class="label-text">{{ $t('dashboard.achievements.validUntilLabel') }}</span></label>
          <input
            id="ach-valid-until"
            v-model="form.valid_until"
            type="date"
            class="input input-bordered w-full"
          />
        </div>
      </div>

      <div>
        <label for="ach-organizer" class="label"><span class="label-text">{{ $t('dashboard.achievements.organizerLabel') }}</span></label>
        <input
          id="ach-organizer"
          v-model="form.organizer"
          type="text"
          maxlength="255"
          autocomplete="off"
          class="input input-bordered w-full"
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="ach-cert-number" class="label"><span class="label-text">{{ $t('dashboard.achievements.certificateNumberLabel') }}</span></label>
          <input
            id="ach-cert-number"
            v-model="form.certificate_number"
            type="text"
            maxlength="255"
            autocomplete="off"
            class="input input-bordered w-full"
          />
        </div>
        <div>
          <label for="ach-participant-as" class="label"><span class="label-text">{{ $t('dashboard.achievements.participantAsLabel') }}</span></label>
          <input
            id="ach-participant-as"
            v-model="form.participant_as"
            type="text"
            maxlength="255"
            autocomplete="off"
            class="input input-bordered w-full"
          />
        </div>
      </div>

      <div>
        <label for="ach-drive-id" class="label"><span class="label-text">{{ $t('dashboard.achievements.driveFileIdLabel') }}</span></label>
        <input
          id="ach-drive-id"
          v-model="form.drive_file_id"
          type="text"
          maxlength="255"
          autocomplete="off"
          placeholder="1aBcDeFgHiJkLmNoPqRsTuVwXyZ"
          class="input input-bordered w-full"
        />
      </div>

      <div>
        <label for="ach-description" class="label"><span class="label-text">{{ $t('dashboard.achievements.descriptionLabel') }}</span></label>
        <textarea
          id="ach-description"
          v-model="form.description"
          rows="2"
          class="textarea textarea-bordered w-full resize-none"
        />
      </div>

      <div>
        <label for="ach-order" class="label"><span class="label-text">{{ $t('dashboard.achievements.orderIndexLabel') }}</span></label>
        <input
          id="ach-order"
          v-model.number="form.order_index"
          type="number"
          min="0"
          class="input input-bordered w-24"
        />
      </div>

      <p v-if="error" class="text-sm text-error">{{ error }}</p>

      <div class="modal-action">
        <button type="button" @click="$emit('close')" class="btn btn-ghost">
          {{ $t('dashboard.achievements.cancel') }}
        </button>
        <button type="submit" class="btn btn-primary" :disabled="submitting">
          {{ submitting ? $t('dashboard.achievements.saving') : $t('dashboard.achievements.save') }}
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useToast } from '@/composables/useToast'
import { createAchievement, updateAchievement } from '@/services/achievement'
import type { Achievement } from '@/types/portfolio'

const props = defineProps<{ show: boolean; achievement?: Achievement | null }>()
const emit = defineEmits<{ close: []; saved: [] }>()

const { t } = useI18n()
const toast = useToast()
const submitting = ref(false)
const error = ref('')

const form = reactive({
  title: '',
  organizer: '',
  date: '',
  type: 'certificate' as Achievement['type'],
  drive_file_id: '',
  certificate_number: '',
  participant_as: '',
  description: '',
  valid_until: '',
  order_index: 0,
})

function resetForm() {
  form.title = ''
  form.organizer = ''
  form.date = ''
  form.type = 'certificate'
  form.drive_file_id = ''
  form.certificate_number = ''
  form.participant_as = ''
  form.description = ''
  form.valid_until = ''
  form.order_index = 0
}

watch(
  () => props.show,
  (isOpen) => {
    if (!isOpen) return
    error.value = ''
    if (props.achievement) {
      form.title = props.achievement.title
      form.organizer = props.achievement.organizer || ''
      form.date = props.achievement.date
      form.type = props.achievement.type
      form.drive_file_id = props.achievement.drive_file_id || ''
      form.certificate_number = props.achievement.certificate_number || ''
      form.participant_as = props.achievement.participant_as || ''
      form.description = props.achievement.description || ''
      form.valid_until = props.achievement.valid_until || ''
      form.order_index = props.achievement.order_index ?? 0
    } else {
      resetForm()
    }
  },
)

async function handleSubmit() {
  submitting.value = true
  error.value = ''

  const payload = {
    title: form.title.trim(),
    organizer: form.organizer.trim(),
    date: form.date,
    type: form.type,
    drive_file_id: form.drive_file_id.trim(),
    certificate_number: form.certificate_number.trim() || undefined,
    participant_as: form.participant_as.trim() || undefined,
    description: form.description.trim() || undefined,
    valid_until: form.valid_until || undefined,
    order_index: form.order_index,
  }

  try {
    if (props.achievement) {
      await updateAchievement(props.achievement.id, payload)
      toast.success(t('dashboard.achievements.updatedToast'))
    } else {
      await createAchievement(payload)
      resetForm()
      toast.success(t('dashboard.achievements.createdToast'))
    }
    emit('saved')
    emit('close')
  } catch (e: unknown) {
    const fallback = props.achievement
      ? t('dashboard.achievements.updateFailed')
      : t('dashboard.achievements.createFailed')
    const msg = e instanceof Error ? e.message : fallback
    error.value = msg
    toast.error(msg)
  } finally {
    submitting.value = false
  }
}
</script>
