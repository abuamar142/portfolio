<template>
  <div class="border-t border-base-300 md:hidden">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="open" id="mobile-menu" class="wrap pb-4">
        <ul class="border-t border-base-300 pt-3">
          <li v-for="item in fullNav" :key="item.href">
            <component
              :is="item.route ? 'router-link' : 'a'"
              :to="item.route ? item.href : undefined"
              :href="item.route ? undefined : item.href"
              class="flex min-h-11 items-center justify-between rounded-md px-2 text-[15px] text-ink-2 transition-colors hover:bg-base-200 hover:text-base-content"
              @click="$emit('close')"
            >
              <span>{{ $t(item.label) }}</span>
              <ArrowUpRight class="size-4 text-ink-4" aria-hidden="true" />
            </component>
          </li>
        </ul>
        <div class="mt-3 flex items-center justify-between gap-3 border-t border-base-300 pt-3">
          <LanguageDropdown />
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

interface MenuItem {
  href: string
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
