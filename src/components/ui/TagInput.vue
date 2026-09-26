<template>
  <div>
    <div v-if="modelValue.length" class="flex flex-wrap gap-2 mb-2">
      <span v-for="tag in modelValue" :key="tag" class="chip chip-primary flex items-center gap-1">
        {{ tag }}
        <button
          type="button"
          class="text-xs hover:text-error"
          :aria-label="t('common.removeTag', { tag })"
          @click="remove(tag)"
        >×</button>
      </span>
    </div>
    <input
      :id="id"
      v-model="draft"
      type="text"
      autocomplete="off"
      class="input input-bordered w-full"
      :class="inputClass"
      :placeholder="placeholder"
      @keydown.enter.prevent="add"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/composables/useToast'

const props = withDefaults(
  defineProps<{
    modelValue: string[]
    id?: string
    max?: number
    lowercase?: boolean
    placeholder?: string
    inputClass?: string
  }>(),
  { max: 5, lowercase: false, placeholder: '', inputClass: '' },
)

const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const { t } = useI18n()
const toast = useToast()
const draft = ref('')

function add() {
  const raw = draft.value.trim()
  if (!raw) return
  // Comma separates tags in ?tag=a,b filters — a tag name must not contain one.
  if (raw.includes(',')) {
    toast.error(t('common.tagNoComma'))
    return
  }
  const tag = props.lowercase ? raw.toLowerCase() : raw
  if (props.modelValue.length >= props.max) {
    toast.error(t('common.tagsMax', { max: props.max }))
    return
  }
  if (props.modelValue.includes(tag)) return
  emit('update:modelValue', [...props.modelValue, tag])
  draft.value = ''
}

function remove(tag: string) {
  emit('update:modelValue', props.modelValue.filter((v) => v !== tag))
}
</script>
