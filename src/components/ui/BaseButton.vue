<template>
  <component
    :is="tag"
    :href="href"
    :to="to"
    :class="buttonClasses"
    :disabled="disabled"
    @click="handleClick"
  >
    <component v-if="iconLeft" :is="iconLeft" class="w-5 h-5 mr-2" />
    <slot />
    <component v-if="iconRight" :is="iconRight" class="w-5 h-5 ml-2" />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  to?: string
  disabled?: boolean
  iconLeft?: object
  iconRight?: object
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

const buttonClasses = computed(() => [
  'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface',
  {
    'w-full': props.fullWidth,
  },
  {
    'bg-accent text-white hover:bg-accent-hover': props.variant === 'primary',
    'bg-surface-overlay text-text-primary border border-border hover:border-text-muted': props.variant === 'secondary',
    'bg-transparent text-accent border border-accent hover:bg-accent hover:text-white': props.variant === 'outline',
    'bg-transparent text-text-muted hover:text-text-primary hover:bg-surface-overlay': props.variant === 'ghost',
  },
  {
    'px-4 py-2 text-sm': props.size === 'sm',
    'px-5 py-2.5 text-sm': props.size === 'md',
    'px-6 py-3 text-base': props.size === 'lg',
  },
])

const handleClick = (event: Event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>
