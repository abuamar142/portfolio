<template>
  <div
    class="bg-dracula-selection backdrop-blur-sm border border-gray-500 rounded-xl p-3 sm:p-4 md:p-6 hover:border-dracula-purple/50 transition-all duration-300 group w-full max-w-full overflow-hidden"
  >
    <div class="flex items-start space-x-3 sm:space-x-3 md:space-x-4 min-w-0">
      <div
        class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-dracula-purple/20 rounded-lg flex items-center justify-center group-hover:bg-dracula-purple/30 transition-colors flex-shrink-0"
      >
        <component
          :is="iconComponent"
          class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-dracula-purple"
        />
      </div>
      <div class="flex-1 min-w-0 overflow-hidden">
        <h3
          class="text-sm sm:text-base md:text-lg font-semibold text-dracula-foreground mb-1 sm:mb-2 truncate"
        >
          {{ title }}
        </h3>
        <div class="min-w-0 overflow-hidden">
          <component
            :is="contentComponent"
            :content="content"
            :href="href"
            class="text-sm sm:text-base md:text-lg block"
          />
        </div>
        <p class="text-dracula-comment text-xs sm:text-sm mt-1 sm:mt-2 truncate">
          {{ subtitle }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import { Mail, MapPin, Phone, ExternalLink } from 'lucide-vue-next'

interface Props {
  icon: string
  title: string
  content: string
  subtitle: string
  href?: string
  type?: 'email' | 'phone' | 'location' | 'link'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'location',
})

// Icon component mapping
const iconComponents = {
  email: Mail,
  location: MapPin,
  phone: Phone,
  link: ExternalLink,
}

// Content component mapping
const contentComponents = {
  email: defineComponent({
    props: ['content', 'href'],
    render() {
      return h(
        'a',
        {
          href: this.href,
          class:
            'text-dracula-purple hover:text-dracula-pink transition-colors font-mono break-words text-sm sm:text-base md:text-lg leading-tight',
        },
        this.content,
      )
    },
  }),
  phone: defineComponent({
    props: ['content', 'href'],
    render() {
      return h(
        'p',
        {
          class:
            'text-dracula-foreground font-mono break-words text-sm sm:text-base md:text-lg leading-tight',
        },
        this.content,
      )
    },
  }),
  location: defineComponent({
    props: ['content'],
    render() {
      return h(
        'p',
        {
          class:
            'text-dracula-foreground break-words text-sm sm:text-base md:text-lg leading-tight',
        },
        this.content,
      )
    },
  }),
  link: defineComponent({
    props: ['content', 'href'],
    render() {
      return h(
        'a',
        {
          href: this.href,
          target: '_blank',
          rel: 'noopener noreferrer',
          class:
            'text-dracula-purple hover:text-dracula-pink transition-colors break-words text-sm sm:text-base md:text-lg leading-tight',
        },
        this.content,
      )
    },
  }),
}

const iconComponent = computed(
  () => iconComponents[props.icon as keyof typeof iconComponents] || iconComponents.location,
)
const contentComponent = computed(() => contentComponents[props.type] || contentComponents.location)
</script>
