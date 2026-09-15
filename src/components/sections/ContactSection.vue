<template>
  <section id="contact" class="section">
    <div v-reveal class="wrap">
      <div class="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <!-- Invitation -->
        <div class="min-w-0">
          <SectionHeader :title="$t('headings.contact')" :lead="$t('contact.subtitle')" />

          <div class="mt-8">
            <a
              :href="`mailto:${profile.email}`"
              class="link-sweep text-lg font-medium tracking-tight text-base-content md:text-xl"
            >
              {{ profile.email }}
            </a>
            <p class="mt-3 flex items-center gap-2 text-sm text-ink-3">
              <span class="size-1.5 rounded-full bg-primary" aria-hidden="true"></span>
              {{ $t('contact.badge') }} {{ profile.timeZoneLabel }}
            </p>
          </div>

          <div class="mt-8 flex flex-wrap items-center gap-3">
            <BaseButton class="min-h-11" :href="`mailto:${profile.email}`" :icon-left="Mail">
              {{ $t('contact.cards.email.title') }}
            </BaseButton>

            <BaseButton
              class="min-h-11"
              variant="secondary"
              :href="profile.whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              :icon-left="MessageCircle"
            >
              WhatsApp
            </BaseButton>
          </div>
        </div>

        <!-- Details -->
        <aside class="panel p-6 md:p-7">
          <dl>
            <div class="flex items-baseline justify-between gap-4 py-3.5">
              <dt class="text-xs text-ink-3">{{ $t('contact.cards.email.title') }}</dt>
              <dd class="min-w-0 text-right">
                <a
                  :href="`mailto:${profile.email}`"
                  class="break-all text-sm text-ink-2 transition-colors hover:text-primary"
                >
                  {{ profile.email }}
                </a>
              </dd>
            </div>

            <div class="flex items-baseline justify-between gap-4 border-t border-base-300 py-3.5">
              <dt class="text-xs text-ink-3">{{ $t('contact.cards.phone.title') }}</dt>
              <dd class="text-right">
                <a
                  :href="profile.phoneHref"
                  class="text-sm text-ink-2 transition-colors hover:text-primary"
                >
                  {{ profile.phone }}
                </a>
              </dd>
            </div>

            <div class="flex items-baseline justify-between gap-4 border-t border-base-300 py-3.5">
              <dt class="text-xs text-ink-3">{{ $t('contact.cards.location.title') }}</dt>
              <dd class="text-right">
                <span class="block text-sm text-ink-2">{{ profile.location }}</span>
                <span class="mt-1 block font-mono text-[11px] text-ink-4">
                  {{ profile.timeZoneLabel }}
                </span>
              </dd>
            </div>
          </dl>

          <div class="border-t border-base-300 pt-5">
            <p class="text-sm font-medium text-base-content">{{ $t('contact.social') }}</p>

            <ul class="mt-3">
              <li v-for="link in socialLinks" :key="link.platform" class="border-t border-base-300">
                <SocialLink
                  :platform="link.platform"
                  :href="link.href"
                  :label="link.label"
                  class="py-2.5"
                />
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Mail, MessageCircle } from 'lucide-vue-next'
import BaseButton from '@/components/ui/BaseButton.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import SocialLink from '@/components/ui/SocialLink.vue'
import { profile } from '@/data/profile'

const { t } = useI18n()

/** Profile links, labelled with the platform names already translated in the locales. */
const socialLinks = computed<
  { platform: 'github' | 'linkedin' | 'instagram'; href: string; label: string }[]
>(() => [
  { platform: 'github', href: profile.social.github, label: t('hero.labels.github') },
  { platform: 'linkedin', href: profile.social.linkedin, label: t('hero.labels.linkedin') },
  { platform: 'instagram', href: profile.social.instagram, label: 'Instagram' },
])
</script>
