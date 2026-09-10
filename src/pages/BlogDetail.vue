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
        <div class="h-3 w-1/4 rounded bg-base-300"></div>
        <div class="mt-4 h-8 w-3/4 rounded bg-base-300"></div>
        <div class="mt-4 h-64 rounded bg-base-200"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="panel mt-8 max-w-[45rem] p-8" role="alert">
        <p class="text-base-content">{{ $t('blog.postNotFound') }}</p>
        <p class="mt-2 font-mono text-[11px] text-ink-3">{{ error }}</p>
        <BaseButton class="mt-6" variant="outline" size="sm" to="/blogs">
          {{ $t('blog.backToList') }}
        </BaseButton>
      </div>

      <article
        v-else
        class="mt-8 grid items-start gap-12 lg:grid-cols-[minmax(0,45rem)_minmax(0,16rem)]"
      >
        <div class="min-w-0">
          <div v-if="post?.tags?.length" class="flex flex-wrap gap-2">
            <span v-for="tag in post.tags" :key="tag.tag || tag" class="chip">
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
            <img :src="coverUrl" :alt="post?.title || ''" loading="lazy" class="w-full object-cover" />
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
          <p class="eyebrow">{{ $t('blog.details') }}</p>
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
                <span v-for="tag in post.tags" :key="tag.tag || tag" class="chip">
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
import { onMounted, onServerPrefetch, ref, computed, nextTick, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, Languages, Share2, X } from 'lucide-vue-next'
import { usePosts } from '@/composables/usePosts'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const { locale } = useI18n()
const slug = computed(() => {
  const raw = route.params.slug as string
  try {
    return decodeURIComponent(String(raw || '').trim())
  } catch {
    return String(raw || '').trim()
  }
})
const { getBySlug } = usePosts()
const post = ref<any | null>(null)
const loading = ref(true)
const error = ref('')

// — Prerender-time data fetch —
// onServerPrefetch runs only during SSG/SSR: the post is fetched at build time
// so the static HTML carries the real article content, head tags and JSON-LD.
// The try/catch keeps a bad slug or API hiccup from failing the build (the
// error state renders instead). On the client this hook never fires — the
// existing onMounted flow below keeps the loading/empty states working.
onServerPrefetch(async () => {
  try {
    const fetched = await getBySlug(slug.value, locale.value)
    if (!fetched || fetched.status === 'draft') throw new Error('Not found')
    post.value = fetched
  } catch (e) {
    console.warn('[BlogDetail] prerender fetch failed', slug.value, locale.value, e)
    error.value = 'Post not found'
  } finally {
    loading.value = false
  }
})

// — Per-page SEO head (baked into the prerendered HTML + SPA client) —
const SITE_URL = 'https://abuamar.online'
const canonical = computed(() => `${SITE_URL}/blogs/${encodeURIComponent(slug.value)}`)

useHead({
  // Override App.vue's `| Abu Amar` titleTemplate so the title is exactly
  // "<post title> — Abu Amar" without doubling the site name.
  title: computed(() => (post.value ? post.value.title : 'Blog Post')),
  titleTemplate: '%s — Abu Amar',
  meta: computed(() => [
    { name: 'description', content: post.value?.excerpt || 'Blog post by Abu Amar' },
    { property: 'og:title', content: post.value ? `${post.value.title} — Abu Amar` : 'Blog Post — Abu Amar' },
    { property: 'og:description', content: post.value?.excerpt || 'Blog post by Abu Amar' },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: canonical.value },
  ]),
  link: computed(() => [{ rel: 'canonical', href: canonical.value }]),
  // JSON-LD BlogPosting — emitted once real data exists, so the prerendered
  // HTML always carries the structured data.
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

const contentHtml = computed(() => post.value?.contentHtml || post.value?.content?.html || post.value?.excerpt || '')
const coverUrl = computed(() => post.value?.coverImage?.url || post.value?.cover?.url || '')
const readingTime = computed(() => {
  if (!post.value) return 0
  const words = (post.value.contentHtml || post.value.content?.html || post.value.excerpt || '').replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
})

function formatDate(iso?: string | null) {
  if (!iso) return ''
  try {
    const dateLocale = locale.value === 'en' ? 'en-US' : 'id-ID'
    return new Date(iso).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return String(iso)
  }
}

// — Locale switcher (bilingual 1-doc-2-locale: slug localized per locale, same document ID)
// Clicking toggles vue-i18n locale (persisted like LanguageDropdown) and watcher refetches same slug with new locale.
// If translation missing, Payload fallback:true returns defaultLocale (id) content.
function toggleLocale() {
  const next = locale.value === 'en' ? 'id' : 'en'
  locale.value = next as any
  try {
    localStorage.setItem('portfolio-language', next)
  } catch {}
}

async function fetchPost() {
  loading.value = true
  error.value = ''
  try {
    const fetched = await getBySlug(slug.value, locale.value)
    if (import.meta.env.DEV) {
      console.debug('[BlogDetail] slug=', slug.value, 'locale=', locale.value, 'fetched=', fetched)
    }
    post.value = fetched
    if (!post.value) throw new Error('Not found')
    if (post.value.status === 'draft') throw new Error('Not found')
  } catch (e) {
    console.warn('[BlogDetail] failed to load', slug.value, 'locale', locale.value, e)
    // Keep existing post if refetch fails due to localized slug mismatch, but show error only on initial load
    if (!post.value) error.value = 'Post not found'
  } finally {
    loading.value = false
  }
}

// — Share state & helpers
const showShareModal = ref(false)
const copied = ref(false)
const shareInputRef = ref<HTMLInputElement | null>(null)
const shareBtnRef = ref<HTMLButtonElement | null>(null)

const shareUrl = computed(() => {
  if (typeof window !== 'undefined' && window.location?.href) return window.location.href
  const s = (post.value?.slug as string) || slug.value
  return s ? `https://abuamar.online/blogs/${encodeURIComponent(s)}` : 'https://abuamar.online/blogs'
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
    if (typeof navigator !== 'undefined' && navigator.clipboard && (window as any).isSecureContext) {
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
      const nav: any = navigator as any
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
      await (navigator as any).share({ title, text, url })
      return
    } catch (e: any) {
      if (e?.name === 'AbortError') return
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
    // prevent background scroll
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

watch(locale, () => {
  // Refetch same slug with new locale when user switches language via dropdown or switcher button
  fetchPost()
})

watch(slug, () => {
  fetchPost()
})

onMounted(fetchPost)
</script>
