<template>
  <div
    class="bg-surface-raised border border-border rounded-xl p-4 hover:border-border transition-all duration-200 group w-full"
  >
    <div class="flex items-start gap-3">
      <div
        class="w-10 h-10 bg-surface-overlay rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent-subtle transition-colors duration-200"
      >
        <component
          :is="iconComponent"
          class="w-5 h-5 text-text-muted group-hover:text-accent transition-colors duration-200"
        />
      </div>
      <div class="flex-1 min-w-0">
        <h3
          class="text-sm font-medium text-text-primary mb-1"
        >
          {{ title }}
        </h3>
        <div class="min-w-0">
          <component
            :is="contentComponent"
            :content="content"
            :href="href"
            class="text-sm block"
          />
        </div>
        <p class="text-text-muted text-xs mt-1">
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

const iconComponents = {
  email: Mail,
  location: MapPin,
  phone: Phone,
  link: ExternalLink,
}

const contentComponents = {
  email: defineComponent({
    props: ['content', 'href'],
    render() {
      return h(
        'a',
        {
          href: this.href,
          class: 'text-accent hover:text-accent-hover transition-colors break-words text-sm',
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
          class: 'text-text-secondary break-words text-sm',
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
          class: 'text-text-secondary break-words text-sm',
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
          class: 'text-accent hover:text-accent-hover transition-colors break-words text-sm',
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
