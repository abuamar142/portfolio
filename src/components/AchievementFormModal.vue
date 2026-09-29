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
            <option value="contribution">{{ $t('achievements.categories.contribution') }}</option>
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

      <!-- File card -->
      <div>
        <label class="label"><span class="label-text">{{ $t('dashboard.achievements.fileLabel') }}</span></label>

        <!-- Hidden file input for both pick and replace -->
        <input
          ref="fileInputRef"
          type="file"
          accept=".pdf,application/pdf,image/png,image/jpeg,image/webp"
          class="hidden"
          @change="onFileChange"
        />

        <!-- EMPTY state: clickable pick area -->
        <div
          v-if="!uploading && !attachedFileKey && !selectedFile"
          class="rounded border border-dashed border-base-300 bg-base-200/50 p-6 text-center cursor-pointer hover:border-primary/40 transition-colors"
          @click="triggerFilePicker"
        >
          <component :is="FilePlusIcon" :size="28" class="mx-auto mb-2 text-ink-3" />
          <p class="text-sm font-medium">{{ $t('dashboard.achievements.filePick') }}</p>
          <p class="text-ink-4 text-xs mt-1">{{ $t('dashboard.achievements.fileHint') }}</p>
        </div>

        <!-- PROGRESS state -->
        <div v-else-if="uploading" class="rounded border border-base-300 p-3">
          <div class="flex items-center gap-2 mb-2">
            <component :is="FileTextIcon" :size="18" class="text-primary shrink-0" />
            <span class="text-sm truncate">{{ selectedFile?.name || $t('dashboard.achievements.fileLabel') }}</span>
            <span class="badge badge-primary badge-xs ml-auto">{{ uploadProgress }}%</span>
          </div>
          <progress class="progress progress-primary w-full" :value="uploadProgress" max="100" />
          <p class="text-ink-4 text-xs mt-1">{{ $t('dashboard.achievements.fileUploading') }}</p>
        </div>

        <!-- ATTACHED state: file card -->
        <div
          v-else-if="attachedFileKey"
          class="rounded border border-base-300 p-3"
        >
          <div class="flex items-center gap-3">
            <component :is="FileTextIcon" :size="18" class="text-primary shrink-0" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium truncate">{{ attachedFileName || $t('dashboard.achievements.fileDefaultName') }}</p>
              <p v-if="attachedFileSize || attachedExt" class="text-ink-4 text-xs">
                <span v-if="attachedExt" class="badge badge-ghost badge-xs uppercase">{{ attachedExt }}</span>
                <span v-if="attachedFileSize" class="ml-1">{{ formatBytes(attachedFileSize) }}</span>
              </p>
            </div>
            <div class="flex shrink-0 gap-1">
              <a
                :href="`${FILES_URL}/${attachedFileKey}`"
                target="_blank"
                rel="noopener"
                class="btn btn-ghost btn-sm"
              >{{ $t('dashboard.achievements.fileOpen') }}</a>
              <button
                type="button"
                class="btn btn-ghost btn-sm"
                @click="triggerFilePicker"
              >{{ $t('dashboard.achievements.fileReplace') }}</button>
              <button
                v-if="!confirmDelete"
                type="button"
                class="btn btn-ghost btn-sm text-error"
                @click="confirmDelete = true"
              >{{ $t('dashboard.achievements.fileDelete') }}</button>
              <div v-else class="flex items-center gap-1">
                <button
                  type="button"
                  class="btn btn-error btn-sm"
                  @click="handleDeleteFile"
                >{{ $t('dashboard.achievements.fileDeleteConfirm') }}</button>
                <button
                  type="button"
                  class="btn btn-ghost btn-sm"
                  @click="confirmDelete = false"
                >{{ $t('dashboard.achievements.fileDeleteCancel') }}</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected file preview (before submit) -->
        <div
          v-else-if="selectedFile"
          class="rounded border border-base-300 p-3"
        >
          <div class="flex items-center gap-3">
            <component :is="FileTextIcon" :size="18" class="text-primary shrink-0" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium truncate">{{ selectedFile.name }}</p>
              <p class="text-ink-4 text-xs">
                <span class="badge badge-ghost badge-xs uppercase">{{ fileExtension }}</span>
                <span class="ml-1">{{ formatBytes(selectedFile.size) }}</span>
              </p>
            </div>
            <button
              type="button"
              class="btn btn-ghost btn-sm text-error"
              @click="clearSelectedFile"
            >{{ $t('dashboard.achievements.fileDeleteCancel') }}</button>
          </div>
        </div>

        <p v-if="fileError" class="text-error text-xs mt-1">{{ fileError }}</p>
      </div>

      <p v-if="error" class="text-sm text-error">{{ error }}</p>

      <div class="modal-action">
        <button type="button" @click="$emit('close')" class="btn btn-ghost">
          {{ $t('dashboard.achievements.cancel') }}
        </button>
        <button type="submit" class="btn btn-primary" :disabled="submitting || uploading">
          {{ submitting ? $t('dashboard.achievements.saving') : $t('dashboard.achievements.save') }}
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { FilePlus as FilePlusIcon, FileText as FileTextIcon } from 'lucide-vue-next'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useToast } from '@/composables/useToast'
import {
  createAchievement,
  updateAchievement,
  uploadAchievementFile,
  deleteAchievementFile,
} from '@/services/achievement'
import { FILES_URL } from '@/site'
import type { Achievement } from '@/types/portfolio'

const props = defineProps<{ show: boolean; achievement?: Achievement | null }>()
const emit = defineEmits<{ close: []; saved: [] }>()

const { t } = useI18n()
const toast = useToast()
const submitting = ref(false)
const error = ref('')

const ALLOWED_TYPES = new Set(['application/pdf', 'image/png', 'image/jpeg', 'image/webp'])
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const fileError = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)
const confirmDelete = ref(false)

// Attached file state (from server).
const attachedFileKey = ref<string | null>(null)
const attachedFileName = ref<string | null>(null)
const attachedFileSize = ref<number | null>(null)

const attachedExt = computed(() => {
  const name = attachedFileName.value || ''
  const dot = name.lastIndexOf('.')
  return dot > -1 ? name.slice(dot + 1) : null
})

const fileExtension = computed(() => {
  const name = selectedFile.value?.name || ''
  const dot = name.lastIndexOf('.')
  return dot > -1 ? name.slice(dot + 1) : ''
})

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function triggerFilePicker() {
  fileInputRef.value?.click()
}

function clearSelectedFile() {
  selectedFile.value = null
  fileError.value = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  fileError.value = ''

  if (!file) {
    selectedFile.value = null
    return
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    fileError.value = t('dashboard.achievements.fileTypeError')
    input.value = ''
    selectedFile.value = null
    return
  }

  if (file.size > MAX_SIZE) {
    fileError.value = t('dashboard.achievements.fileSizeError')
    input.value = ''
    selectedFile.value = null
    return
  }

  selectedFile.value = file
  confirmDelete.value = false
}

const form = reactive({
  title: '',
  organizer: '',
  date: '',
  type: 'certificate' as Achievement['type'],
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
    fileError.value = ''
    selectedFile.value = null
    uploading.value = false
    uploadProgress.value = 0
    confirmDelete.value = false
    if (fileInputRef.value) fileInputRef.value.value = ''

    if (props.achievement) {
      form.title = props.achievement.title
      form.organizer = props.achievement.organizer || ''
      form.date = props.achievement.date
      form.type = props.achievement.type
      form.certificate_number = props.achievement.certificate_number || ''
      form.participant_as = props.achievement.participant_as || ''
      form.description = props.achievement.description || ''
      form.valid_until = props.achievement.valid_until || ''
      form.order_index = props.achievement.order_index ?? 0
      attachedFileKey.value = props.achievement.file_key || null
      attachedFileName.value = props.achievement.file_name || null
      attachedFileSize.value = props.achievement.file_size ?? null
    } else {
      resetForm()
      attachedFileKey.value = null
      attachedFileName.value = null
      attachedFileSize.value = null
    }
  },
)

async function handleDeleteFile() {
  if (!props.achievement) return
  try {
    const updated = await deleteAchievementFile(props.achievement.id)
    attachedFileKey.value = null
    attachedFileName.value = null
    attachedFileSize.value = null
    confirmDelete.value = false
    toast.success(t('dashboard.achievements.fileDeleted'))
    Object.assign(props.achievement, updated)
  } catch {
    toast.error(t('dashboard.achievements.fileDeleteFailed'))
  }
}

async function handleSubmit() {
  submitting.value = true
  error.value = ''

  const payload = {
    title: form.title.trim(),
    organizer: form.organizer.trim(),
    date: form.date,
    type: form.type,
    certificate_number: form.certificate_number.trim() || undefined,
    participant_as: form.participant_as.trim() || undefined,
    description: form.description.trim() || undefined,
    valid_until: form.valid_until || undefined,
    order_index: form.order_index,
  }

  let savedAchievement: Achievement | null = null

  try {
    if (props.achievement) {
      savedAchievement = await updateAchievement(props.achievement.id, payload)
      toast.success(t('dashboard.achievements.updatedToast'))
    } else {
      savedAchievement = await createAchievement(payload)
      toast.success(t('dashboard.achievements.createdToast'))
    }
  } catch (e: unknown) {
    const fallback = props.achievement
      ? t('dashboard.achievements.updateFailed')
      : t('dashboard.achievements.createFailed')
    const msg = e instanceof Error ? e.message : fallback
    error.value = msg
    toast.error(msg)
    submitting.value = false
    return
  }

  // File upload — metadata already saved; file failure is non-fatal.
  if (savedAchievement && selectedFile.value) {
    uploading.value = true
    uploadProgress.value = 0
    try {
      const updated = await uploadAchievementFile(
        savedAchievement.id,
        selectedFile.value,
        (p) => { uploadProgress.value = p },
      )
      attachedFileKey.value = updated.file_key || null
      attachedFileName.value = updated.file_name || null
      attachedFileSize.value = updated.file_size ?? null
      toast.success(t('dashboard.achievements.fileUploaded'))
      if (props.achievement) {
        Object.assign(props.achievement, updated)
      }
    } catch {
      toast.error(t('dashboard.achievements.fileUploadFailed'))
    } finally {
      uploading.value = false
    }
  }

  submitting.value = false
  emit('saved')
  emit('close')
}
</script>
