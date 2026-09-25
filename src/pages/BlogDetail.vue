<template>
  <section id="blog-post" class="page-top">
    <div class="wrap pb-20 md:pb-28">
      <router-link
        to="/blogs"
        class="inline-flex min-h-11 items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-3 transition-colors hover:text-base-content"
      >
        <ArrowLeft class="size-4" aria-hidden="true" />
        {{ $t('blog.backToList') }}
      </router-link>

      <!-- Loading -->
      <div v-if="loading" class="mt-8 max-w-[45rem] animate-pulse" role="status">
        <div class="h-3 w-1/4 bg-hairline-light"></div>
        <div class="mt-4 h-8 w-3/4 bg-hairline-light"></div>
        <div class="mt-4 h-64 bg-hairline-light"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="panel mt-8 max-w-[45rem] p-8" role="alert">
        <p class="text-base-content">{{ $t('blog.postNotFound') }}</p>
        <BaseButton class="mt-6" variant="outline" size="sm" to="/blogs">
          {{ $t('blog.backToList') }}
        </BaseButton>
      </div>

      <article
        v-else
        class="mt-8 grid items-start gap-12 overflow-x-clip lg:grid-cols-[minmax(0,45rem)_minmax(0,16rem)]"
      >
        <div class="min-w-0">
          <div v-if="post?.tags?.length" class="flex flex-wrap gap-2">
            <span v-for="tag in post.tags" :key="tag.tag || String(tag)" class="chip">
              {{ tag.tag || tag }}
            </span>
          </div>

          <h1 class="display-2 mt-4 text-balance text-base-content">{{ post?.title }}</h1>

          <!-- Language switcher: toggles vue-i18n locale and refetches same slug -->
          <div v-if="post" class="mt-5">
            <button
              type="button"
              class="chip min-h-11 px-4 transition-colors hover:border-primary/40 hover:text-primary"
              :aria-label="$t('blog.switchLanguageAria')"
              @click="toggleLocale"
            >
              <Languages class="size-4" aria-hidden="true" />
              {{ $t('blog.switchLanguage') }}
            </button>
          </div>

          <p
            class="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-base-300 pb-6 font-mono text-[11px] uppercase tracking-wider text-ink-3"
          >
            <time :datetime="post?.publishedAt">{{ formatDate(post?.publishedAt) }}</time>
            <span aria-hidden="true">·</span>
            <span>{{ readingTime }} {{ $t('blog.readTime') }}</span>
          </p>

          <div v-if="coverUrl" class="panel mt-8 overflow-hidden">
            <img :src="coverUrl" :alt="post?.title || ''" loading="lazy" decoding="async" width="800" height="450" class="w-full object-cover" />
          </div>

          <div class="blog-content mt-8" v-html="contentHtml"></div>

          <div
            class="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-base-300 pt-6"
          >
            <BaseButton variant="ghost" size="sm" to="/blogs" :icon-left="ArrowLeft">
              {{ $t('blog.backToList') }}
            </BaseButton>
            <button
              ref="shareBtnRef"
              type="button"
              class="btn btn-ghost btn-sm gap-2"
              :aria-label="$t('blog.shareAria')"
              @click="handleShare"
            >
              <Share2 class="size-4" aria-hidden="true" />
              {{ $t('blog.share') }}
            </button>
          </div>
        </div>

        <!-- Reading rail -->
        <aside class="panel sticky top-24 hidden p-5 lg:block">
          <p class="text-sm font-medium text-base-content">{{ $t('blog.details') }}</p>
          <dl class="mt-5 space-y-4 border-t border-base-300 pt-5">
            <div>
              <dt class="font-mono text-[11px] uppercase tracking-wider text-ink-4">
                {{ $t('blog.published') }}
              </dt>
              <dd class="mt-1 font-mono text-[11px] text-ink-2">
                {{ formatDate(post?.publishedAt) }}
              </dd>
            </div>
            <div>
              <dt class="font-mono text-[11px] uppercase tracking-wider text-ink-4">
                {{ $t('blog.readingTime') }}
              </dt>
              <dd class="mt-1 font-mono text-[11px] text-ink-2">
                {{ readingTime }} {{ $t('blog.readTimeShort') }}
              </dd>
            </div>
            <div v-if="post?.tags?.length">
              <dt class="font-mono text-[11px] uppercase tracking-wider text-ink-4">
                {{ $t('blog.tags') }}
              </dt>
              <dd class="mt-2 flex flex-wrap gap-1.5">
                <span v-for="tag in post.tags" :key="tag.tag || String(tag)" class="chip">
                  {{ tag.tag || tag }}
                </span>
              </dd>
            </div>
          </dl>
        </aside>
      </article>
    </div>

    <Teleport to="body">
      <div v-if="showShareModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div
          class="absolute inset-0 bg-base-100/80 backdrop-blur-sm"
          aria-hidden="true"
          @click="closeModal"
        ></div>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-title"
          class="panel relative w-full max-w-md p-5 shadow-xl sm:p-6"
          @click.stop
          @keydown.esc="closeModal"
        >
          <div class="flex items-start justify-between gap-4">
            <h2 id="share-title" class="font-display text-lg text-base-content">
              {{ $t('blog.shareTitle') }}
            </h2>
            <button
              type="button"
              class="btn btn-ghost btn-square btn-sm"
              :aria-label="$t('blog.closeAria')"
              @click="closeModal"
            >
              <X class="size-4" aria-hidden="true" />
            </button>
          </div>

          <label
            for="share-url-input"
            class="mt-5 block font-mono text-[11px] uppercase tracking-wider text-ink-3"
          >
            {{ $t('blog.shareLink') }}
          </label>
          <input
            id="share-url-input"
            ref="shareInputRef"
            :value="shareUrl"
            readonly
            class="input mt-2 h-11 w-full font-mono text-sm"
            @focus="selectAll"
            @click="selectAll"
          />

          <div class="mt-6 flex justify-end gap-2">
            <button type="button" class="btn btn-ghost btn-sm" @click="closeModal">
              {{ $t('blog.close') }}
            </button>
            <button
              type="button"
              class="btn btn-sm"
              :class="copied ? 'btn-success' : 'btn-primary'"
              @click="copyText"
            >
              {{ copied ? $t('blog.copied') : $t('blog.copy') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { SITE_URL } from '@/site'
import { ArrowLeft, Languages, Share2, X } from 'lucide-vue-next'
import { useBlogPost } from '@/composables/useBlogPost'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const slug = computed(() => {
  const raw = route.params.slug as string
  try {
    return decodeURIComponent(String(raw || '').trim())
  } catch {
    return String(raw || '').trim()
  }
})

const { post, loading, error, contentHtml, coverUrl, readingTime, formatDate, toggleLocale } = useBlogPost(slug)

// — Per-page SEO head —
const canonical = computed(() => `${SITE_URL}/blogs/${encodeURIComponent(slug.value)}`)

useHead({
  title: computed(() => (post.value ? post.value.title : 'Blog Post')),
  titleTemplate: '%s - Abu Amar',
  meta: computed(() => [
    { name: 'description', content: post.value?.excerpt || 'Blog post by Abu Amar' },
    { property: 'og:title', content: post.value ? `${post.value.title} - Abu Amar` : 'Blog Post - Abu Amar' },
    { property: 'og:description', content: post.value?.excerpt || 'Blog post by Abu Amar' },
    { property: 'og:type', content: 'article' },
  ]),
  script: computed(() => {
    if (!post.value) return []
    return [
      {
        type: 'application/ld+json',
        textContent: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.value.title,
          description: post.value.excerpt || '',
          datePublished: post.value.publishedAt || undefined,
          author: { '@type': 'Person', name: 'M. Abu Amar Al Badawi' },
          mainEntityOfPage: { '@type': 'WebPage', '@id': canonical.value },
        }),
      },
    ]
  }),
})

// — Share state & helpers —
const showShareModal = ref(false)
const copied = ref(false)
const shareInputRef = ref<HTMLInputElement | null>(null)
const shareBtnRef = ref<HTMLButtonElement | null>(null)

const shareUrl = computed(() => {
  if (typeof window !== 'undefined' && window.location?.href) return window.location.href
  const s = (post.value?.slug as string) || slug.value
  return s ? `${SITE_URL}/blogs/${encodeURIComponent(s)}` : `${SITE_URL}/blogs`
})
const shareTitle = computed(() => post.value?.title || (typeof document !== 'undefined' ? document.title : '') || 'Blog post')
const shareText = computed(() => {
  const raw: string = post.value?.excerpt || ''
  const text = raw.replace(/<[^>]*>/g, '').trim()
  return text.slice(0, 200)
})

function isMobileUA(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

function openModal() {
  showShareModal.value = true
  nextTick(() => {
    shareInputRef.value?.focus()
    shareInputRef.value?.select()
  })
}

function closeModal() {
  showShareModal.value = false
  copied.value = false
  nextTick(() => {
    shareBtnRef.value?.focus()
  })
}

async function copyText(): Promise<boolean> {
  const text = shareUrl.value
  let ok = false
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && (window as { isSecureContext?: boolean }).isSecureContext) {
      await navigator.clipboard.writeText(text)
      ok = true
    } else {
      throw new Error('clipboard unavailable')
    }
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.className = 'sr-only'
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      ok = document.execCommand('copy')
      document.body.removeChild(ta)
    } catch {
      ok = false
    }
  }
  if (ok) {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
  return ok
}

async function handleShare() {
  const title = shareTitle.value
  const text = shareText.value
  const url = shareUrl.value
  const canNative = typeof navigator !== 'undefined' && !!navigator.share && isMobileUA()
  if (canNative) {
    try {
      const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean; share?: (data: ShareData) => Promise<void> }
      if (typeof nav.canShare === 'function') {
        try {
          if (!nav.canShare({ title, text, url })) {
            openModal()
            return
          }
        } catch {
          // ignore canShare throw, fall through to share attempt
        }
      }
      await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share({ title, text, url })
      return
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') return
      // fallthrough to modal for other errors
    }
  }
  openModal()
}

function selectAll(e: Event) {
  ;(e.target as HTMLInputElement)?.select()
}

function onEsc(e: KeyboardEvent) {
  if (e.key === 'Escape' && showShareModal.value) closeModal()
}

watch(showShareModal, (open) => {
  if (typeof window === 'undefined') return
  if (open) {
    window.addEventListener('keydown', onEsc)
    document.documentElement.style.overflow = 'hidden'
  } else {
    window.removeEventListener('keydown', onEsc)
    document.documentElement.style.overflow = ''
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('keydown', onEsc)
  if (typeof document !== 'undefined') document.documentElement.style.overflow = ''
})
</script>
