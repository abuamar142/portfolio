<template>
  <div class="border-t border-base-300 min-[1200px]:hidden">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="open" id="mobile-menu" class="wrap pb-4">
        <ul class="border-t border-hairline-light pt-2">
          <li v-for="item in fullNav" :key="item.href">
            <component
              :is="item.route ? 'router-link' : 'a'"
              :to="item.route ? item.href : undefined"
              :href="item.route ? undefined : item.href"
              class="flex min-h-11 items-center justify-between gap-3 px-1 text-[15px] text-ink-2 transition-colors hover:bg-surface-green hover:text-base-content"
              @click="$emit('close')"
            >
              <span class="flex items-baseline gap-3">
                <span v-if="item.no" class="row-place">{{ item.no }}</span>
                <span>{{ $t(item.label) }}</span>
              </span>
              <ArrowUpRight class="size-4 shrink-0 text-ink-4" aria-hidden="true" />
            </component>
          </li>
        </ul>
        <div class="mt-3 flex items-center justify-between gap-3 border-t border-hairline-light pt-3">
          <div class="flex items-center gap-4">
            <LanguageDropdown />
            <ThemeToggle />
          </div>
          <a :href="resumeHref" target="_blank" rel="noopener" class="btn btn-sm min-h-11">
            {{ $t('hero.cta.resume') }}
          </a>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import LanguageDropdown from '@/components/LanguageDropdown.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

interface MenuItem {
  href: string
  no?: string
  label: string
  route: boolean
}

defineProps<{
  open: boolean
  fullNav: MenuItem[]
  resumeHref: string
}>()

defineEmits<{
  close: []
}>()
</script>
