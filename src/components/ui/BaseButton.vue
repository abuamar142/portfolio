<template>
  <component
    :is="tag"
    :class="buttonClasses"
    :disabled="disabled"
    v-bind="$attrs"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  tag?: string
  href?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  tag: 'button',
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const buttonClasses = computed(() => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses = {
    primary:
      'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600',
    secondary:
      'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500 dark:bg-dark-800 dark:hover:bg-dark-700 dark:text-gray-100',
    outline:
      'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-primary-500 dark:border-dark-600 dark:hover:bg-dark-800 dark:text-gray-300',
    ghost:
      'hover:bg-gray-100 text-gray-700 focus:ring-primary-500 dark:hover:bg-dark-800 dark:text-gray-300',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return [baseClasses, variantClasses[props.variant], sizeClasses[props.size]].join(' ')
})

const handleClick = (event: Event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>
