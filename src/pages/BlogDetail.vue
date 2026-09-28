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
      <ErrorState v-else-if="error" variant="inline" class="mt-8 max-w-[45rem]" :message="$t('blog.postNotFound')">
        <BaseButton class="mt-6" variant="outline" size="sm" to="/blogs">
          {{ $t('blog.backToList') }}
        </BaseButton>
      </ErrorState>

      <article
        v-else
        class="mt-8 grid items-start gap-12 overflow-x-clip lg:grid-cols-[minmax(0,45rem)_minmax(0,15rem)] lg:gap-16"
      >
        <div class="min-w-0">
          <div v-if="post?.tags?.length" class="flex flex-wrap gap-2">
            <TagChip
              v-for="tag in post.tags"
              :key="tag.tag || String(tag)"
              :tag="tag.tag || String(tag)"
            />
          </div>

          <h1 class="display-2 mt-4 text-balance text-base-content">{{ post?.title }}</h1>

          <!-- Dek: the excerpt as a lead paragraph, so the page opens with the
               argument rather than jumping straight into body copy. -->
          <p v-if="post?.excerpt" class="lead mt-5 max-w-[62ch] text-ink-2">
            {{ post.excerpt }}
          </p>

          <div
            class="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-base-300 pb-6 font-mono text-[11px] uppercase tracking-wider text-ink-3"
          >
            <time v-if="displayDate" :datetime="displayDate">{{ formatDate(displayDate) }}</time>
            <span v-if="displayDate" aria-hidden="true">·</span>
            <span>{{ readingTime }} {{ $t('blog.readTime') }}</span>

            <button
              type="button"
              class="ml-auto inline-flex min-h-9 items-center gap-1.5 rounded-none border border-base-300 px-2.5 transition-colors hover:border-primary/40 hover:text-primary"
              :aria-label="$t('blog.switchLanguageAria')"
              @click="toggleLocale"
            >
              <Languages class="size-3.5" aria-hidden="true" />
              {{ $t('blog.switchLanguage') }}
            </button>
          </div>

          <div v-if="coverUrl" class="panel mt-8 overflow-hidden">
            <img :src="coverUrl" :alt="post?.title || ''" loading="lazy" decoding="async" width="800" height="450" class="w-full object-cover" />
          </div>

          <!-- On narrow screens the table of contents sits above the body,
               folded away: it is a shortcut, not the article. -->
          <details v-if="toc.length" class="panel mt-8 p-4 lg:hidden">
            <summary class="cursor-pointer font-mono text-[11px] uppercase tracking-wider text-ink-3">
              {{ $t('blog.contents') }}
            </summary>
            <nav class="mt-3">
              <ul class="space-y-2">
                <li v-for="item in toc" :key="item.id" :class="item.level === 3 ? 'pl-4' : ''">
                  <a :href="`#${item.id}`" class="text-sm text-ink-2 transition-colors hover:text-primary">
                    {{ item.text }}
                  </a>
                </li>
              </ul>
            </nav>
          </details>

          <div class="blog-content mt-10" v-html="contentHtml"></div>

          <div
            class="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-base-300 pt-6"
          >
            <BaseButton variant="ghost" size="sm" to="/blogs" :icon-left="ArrowLeft">
              {{ $t('blog.backToList') }}
            </BaseButton>
            <button
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

        <!-- Reading rail: a table of contents with scroll position. The date,
             reading time and tags already sit under the title, so repeating
             them here only duplicated what the reader had just passed. -->
        <aside v-if="toc.length" class="sticky top-24 hidden lg:block">
          <p class="label">{{ $t('blog.contents') }}</p>
          <nav class="mt-4 border-t border-base-300 pt-4">
            <ul class="space-y-2.5">
              <li v-for="item in toc" :key="item.id" :class="item.level === 3 ? 'pl-3' : ''">
                <a
                  :href="`#${item.id}`"
                  class="block border-l-2 pl-3 text-sm leading-snug transition-colors"
                  :class="
                    activeId === item.id
                      ? 'border-primary text-base-content'
                      : 'border-transparent text-ink-3 hover:border-base-300 hover:text-base-content'
                  "
                  :aria-current="activeId === item.id ? 'location' : undefined"
                >
                  {{ item.text }}
                </a>
              </li>
            </ul>
          </nav>
        </aside>
      </article>
    </div>

    <BaseModal
      :open="showShareModal"
      :close-label="$t('blog.closeAria')"
      labelled-by="share-title"
      box-class="max-w-md"
      initial-focus="#share-url-input"
      @close="closeModal"
    >
      <h2 id="share-title" class="font-display text-lg text-base-content">
        {{ $t('blog.shareTitle') }}
      </h2>

      <label
        for="share-url-input"
        class="mt-5 block font-mono text-[11px] uppercase tracking-wider text-ink-3"
      >
        {{ $t('blog.shareLink') }}
      </label>
      <input
        id="share-url-input"
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
    </BaseModal>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { SITE_URL } from '@/site'
import { ArrowLeft, Languages, Share2 } from 'lucide-vue-next'
import { useBlogPost } from '@/composables/useBlogPost'
import TagChip from '@/components/ui/TagChip.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const route = useRoute()
const slug = computed(() => {
  const raw = route.params.slug as string
  try {
    return decodeURIComponent(String(raw || '').trim())
  } catch {
    return String(raw || '').trim()
  }
})

const { post, loading, error, notFound, contentHtml, toc, displayDate, coverUrl, readingTime, formatDate, toggleLocale } =
  useBlogPost(slug)

// ── Table of contents: scroll spy ────────────────────────────────────────────
// Which heading the reader is currently inside. The rail highlights it; the
// list stays plain links, so the article is fully usable without this running.
const activeId = ref('')
let observer: IntersectionObserver | null = null

function disconnectObserver() {
  observer?.disconnect()
  observer = null
}

watch(
  toc,
  async (items) => {
    disconnectObserver()
    if (!items.length || typeof IntersectionObserver === 'undefined') return
    // The heading ids live inside the v-html body, so they only exist after
    // Vue has rendered it.
    await nextTick()

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)
    if (!headings.length) return

    // A band near the top of the viewport decides the active heading, so a
    // short section still wins while it is the one being read.
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length) activeId.value = visible[0]!.target.id
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    )
    headings.forEach((el) => observer!.observe(el))
  },
  { immediate: true },
)

onBeforeUnmount(disconnectObserver)

const canonical = computed(() => `${SITE_URL}/blogs/${encodeURIComponent(slug.value)}`)

useHead({
  title: computed(() => (post.value ? post.value.title : 'Blog Post')),
  titleTemplate: '%s | Abu Amar',
  meta: computed(() => [
    // Soft-404 hygiene: an unknown slug is served the SPA shell with HTTP 200
    // for browsers (nginx only proxies crawler user-agents to the preview
    // server, which answers a real 404), so a JS-rendering client must keep
    // the page out of the index itself — the same rule NotFound.vue follows.
    ...(notFound.value ? [{ name: 'robots', content: 'noindex,nofollow' }] : []),
    { name: 'description', content: post.value?.excerpt || 'Blog post by Abu Amar' },
    { property: 'og:title', content: post.value ? `${post.value.title} - Abu Amar` : 'Blog Post - Abu Amar' },
    { property: 'og:description', content: post.value?.excerpt || 'Blog post by Abu Amar' },
    { property: 'og:type', content: 'article' },
    // Cover when the post has one, otherwise the preview server's generated
    // card for this slug (title + excerpt on the site's paper).
    { property: 'og:image', content: coverUrl.value || `${SITE_URL}/api/og/blog/${encodeURIComponent(slug.value)}` },
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
          // Rich results require an image; omit the key entirely when the
          // post has no cover rather than emitting `image: undefined`.
          ...(coverUrl.value ? { image: coverUrl.value } : {}),
          author: { '@type': 'Person', name: 'M. Abu Amar Al Badawi' },
          mainEntityOfPage: { '@type': 'WebPage', '@id': canonical.value },
        }),
      },
    ]
  }),
})

const showShareModal = ref(false)
const copied = ref(false)

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
  // Focus + select of the URL input is BaseModal's initialFocus job; the
  // input's @focus handler does the select.
  showShareModal.value = true
}

function closeModal() {
  // Focus return to the share button is BaseModal's deactivate() job.
  showShareModal.value = false
  copied.value = false
}

// Select the URL as soon as the dialog opens. The input's @focus handler
// does this too where focus events dispatch, but a direct select() also
// covers environments where they don't (background/headless windows).
watch(showShareModal, (open) => {
  if (!open) return
  nextTick(() => document.querySelector<HTMLInputElement>('#share-url-input')?.select())
})

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
</script>
