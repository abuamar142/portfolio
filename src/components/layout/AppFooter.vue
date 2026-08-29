<template>
  <footer class="border-t mt-8" style="border-color: var(--color-border); background: var(--color-bg)">
    <div class="max-w-[1280px] mx-auto px-6 md:px-8 py-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <!-- Left: identity -->
        <div class="flex items-center gap-3">
          <span
            class="w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-medium tracking-widest border shrink-0"
            style="background: var(--color-surface-raised); border-color: var(--color-border); color: var(--color-text-primary)"
          >
            A
          </span>
          <div>
            <div class="text-sm font-medium tracking-tight leading-none" style="color: var(--color-text-primary)">
              Abu Amar
            </div>
            <div class="text-[11px] font-mono tracking-[0.08em] mt-1" style="color: var(--color-text-faint)">
              © {{ new Date().getFullYear() }} — Mobile & Full Stack
            </div>
          </div>
        </div>

        <!-- Middle: links -->
        <div class="flex items-center gap-5 flex-wrap">
          <a
            v-for="social in socialLinks"
            :key="social.label"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs transition-colors duration-150"
            style="color: var(--color-text-muted)"
          >
            {{ social.label }}
          </a>
        </div>

        <!-- Right: built -->
        <div class="text-xs flex items-center gap-2" style="color: var(--color-text-faint)">
          <span class="w-1.5 h-1.5 rounded-full" style="background: var(--color-border-contrast)"></span>
          <span class="font-mono text-[11px] tracking-wide">Built with Vue + Vite — Dark slate</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const socialLinks = [
  { label: 'GitHub', url: 'https://github.com/abuamar142' },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/abu-amar' },
  { label: 'Instagram', url: 'https://instagram.com/abuuamar_' },
  { label: 'Email', url: 'mailto:abuamar.albadawi@gmail.com' },
]
</script>
