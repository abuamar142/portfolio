<template>
  <div class="flex items-center gap-1">
    <template v-for="item in sectionNav" :key="item.id">
      <a
        :href="`#${item.id}`"
        class="rounded-full px-4 py-2 text-sm font-medium transition-colors"
        :class="activeId === item.id ? 'pill-active' : 'text-ink-3 hover:text-base-content'"
        :aria-current="activeId === item.id ? 'true' : undefined"
      >
        {{ $t(item.label) }}
      </a>
    </template>
    <router-link
      to="/blogs"
      class="rounded-full px-4 py-2 text-sm font-medium transition-colors"
      :class="isBlogRoute ? 'pill-active' : 'text-ink-3 hover:text-base-content'"
      :aria-current="isBlogRoute ? 'page' : undefined"
    >
      {{ $t('navigation.blog') }}
    </router-link>
    <span class="mx-1 h-5 w-px bg-base-300" aria-hidden="true"></span>
    <LanguageDropdown compact />
  </div>
</template>

<script setup lang="ts">
import LanguageDropdown from '@/components/LanguageDropdown.vue'

interface NavItem {
  id: string
  label: string
}

defineProps<{
  sectionNav: NavItem[]
  activeId: string
  isBlogRoute: boolean
}>()
</script>
