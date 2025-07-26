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
  iconLeft?: any
  iconRight?: any
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
  'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2',

  // Full width
  {
    'w-full': props.fullWidth,
  },

  // Variants
  {
    'bg-gradient-to-r from-dracula-purple to-dracula-pink text-dracula-background hover:from-dracula-pink hover:to-dracula-purple shadow-button hover:shadow-button-hover focus:ring-dracula-purple':
      props.variant === 'primary',
    'bg-dracula-selection text-dracula-foreground border-2 border-gray-500 hover:border-dracula-purple hover:text-dracula-purple shadow-button hover:shadow-card focus:ring-dracula-purple':
      props.variant === 'secondary',
    'bg-transparent text-dracula-purple border-2 border-dracula-purple hover:bg-dracula-purple hover:text-dracula-background shadow-button hover:shadow-button-hover focus:ring-dracula-purple':
      props.variant === 'outline',
    'bg-transparent text-dracula-comment hover:text-dracula-foreground hover:bg-dracula-selection focus:ring-dracula-purple':
      props.variant === 'ghost',
  },

  // Sizes
  {
    'px-4 py-2 text-sm': props.size === 'sm',
    'px-6 py-3 text-base': props.size === 'md',
    'px-8 py-4 text-lg': props.size === 'lg',
  },
])

const handleClick = (event: Event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>
