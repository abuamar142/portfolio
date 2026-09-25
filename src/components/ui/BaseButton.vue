<template>
  <component
    :is="tag"
    :href="href"
    :to="to"
    :class="buttonClasses"
    :disabled="tag === 'button' ? isInert : undefined"
    :aria-busy="loading || undefined"
    :aria-disabled="tag !== 'button' && isInert ? 'true' : undefined"
    :aria-label="label"
    @click="handleClick"
  >
    <span v-if="loading" class="loading loading-spinner loading-xs" aria-hidden="true" />
    <component v-else-if="iconLeft" :is="iconLeft" class="size-4 shrink-0" aria-hidden="true" />
    <slot v-if="!loading || !loadingLabel" />
    <template v-else>{{ loadingLabel }}</template>
    <component :is="iconRight" v-if="iconRight && !loading" class="size-4 shrink-0" aria-hidden="true" />
  </component>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  to?: string
  disabled?: boolean
  /**
   * Busy state for form submits: shows a spinner, disables the control and
   * blocks clicks so a double submit can't be queued.
   */
  loading?: boolean
  loadingLabel?: string
  iconLeft?: Component
  iconRight?: Component
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const tag = computed(() => {
  if (props.href) return 'a'
  if (props.to) return 'router-link'
  return 'button'
})

/** Screen readers should hear the outcome, not just "busy". */
const isInert = computed(() => props.disabled || props.loading)
const label = computed(() => (props.loading ? props.loadingLabel : undefined))

const variantClass: Record<NonNullable<Props['variant']>, string> = {
  primary: 'btn-primary',
  secondary: 'btn-outline',
  outline: 'btn-outline btn-primary',
  ghost: 'btn-ghost',
}

const sizeClass: Record<NonNullable<Props['size']>, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
}

const buttonClasses = computed(() => [
  'btn gap-2',
  variantClass[props.variant],
  sizeClass[props.size],
  props.fullWidth ? 'btn-block' : '',
  isInert.value ? 'btn-disabled' : '',
])

const handleClick = (event: Event) => {
  if (isInert.value) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>
