<template>
  <component
    :is="tag"
    :href="href"
    :to="to"
    :class="buttonClasses"
    :disabled="tag === 'button' ? disabled : undefined"
    @click="handleClick"
  >
    <component :is="iconLeft" v-if="iconLeft" class="size-4 shrink-0" aria-hidden="true" />
    <slot />
    <component :is="iconRight" v-if="iconRight" class="size-4 shrink-0" aria-hidden="true" />
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
  iconLeft?: Component
  iconRight?: Component
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
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
  'btn gap-2 font-medium tracking-tight',
  variantClass[props.variant],
  sizeClass[props.size],
  props.fullWidth ? 'btn-block' : '',
])

const handleClick = (event: Event) => {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>
