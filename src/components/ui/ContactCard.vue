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
  email: defineComponent({
    render: () =>
      h(
        'svg',
        {
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24',
        },
        [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
          }),
        ],
      ),
  }),
  location: defineComponent({
    render: () =>
      h(
        'svg',
        {
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24',
        },
        [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
          }),
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M15 11a3 3 0 11-6 0 3 3 0 016 0z',
          }),
        ],
      ),
  }),
  phone: defineComponent({
    render: () =>
      h(
        'svg',
        {
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24',
        },
        [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
          }),
        ],
      ),
  }),
  link: defineComponent({
    render: () =>
      h(
        'svg',
        {
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24',
        },
        [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14',
          }),
        ],
      ),
  }),
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
