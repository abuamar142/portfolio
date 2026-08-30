<template>
  <section class="pt-14 min-h-screen" style="background: var(--color-bg)">
    <div class="max-w-[1280px] mx-auto px-6 md:px-8 py-10 md:py-12">
      <router-link
        to="/blogs"
        class="inline-flex items-center gap-1.5 text-[11px] font-mono mb-8 transition-colors"
        style="color: var(--color-text-faint)"
      >
        ← All posts
      </router-link>

      <div v-if="loading" class="max-w-[720px] space-y-4">
        <div class="h-4 rounded w-3/4 animate-pulse" style="background: var(--color-surface-raised)"></div>
        <div class="h-3 rounded w-1/4 animate-pulse" style="background: var(--color-surface-raised)"></div>
        <div class="h-64 rounded-xl animate-pulse" style="background: var(--color-surface)"></div>
      </div>

      <div v-else-if="error" class="max-w-[720px] py-12 rounded-xl border p-8" style="background: var(--color-surface); border-color: var(--color-border)">
        <p class="text-sm mb-4" style="color: var(--color-error)">{{ error }}</p>
        <router-link to="/blogs" class="text-[11px] font-mono" style="color: var(--color-text-muted)">← Back to blog</router-link>
      </div>

      <article v-else class="grid lg:grid-cols-[720px_1fr] gap-10 lg:gap-12 items-start">
        <div class="min-w-0">
          <div v-if="post?.tags?.length" class="flex flex-wrap gap-1.5 mb-4">
            <span
              v-for="(tag, i) in post.tags"
              :key="tag.tag || tag"
              class="text-[11px] font-mono tracking-wide px-2.5 py-1 rounded-full border"
              :style="{ borderColor: 'var(--color-border)', background: 'var(--color-surface-raised)', color: 'var(--color-text-muted)' }"
            >
              {{ tag.tag || tag }}
            </span>
          </div>

          <h1 class="text-[26px] md:text-[32px] font-semibold tracking-tighter leading-[1.05]" style="color: var(--color-text-primary); letter-spacing: -0.03em">
            {{ post?.title }}
          </h1>

          <!-- Language switcher: toggles vue-i18n locale and refetches same slug with ?locale= -->
          <div v-if="post" class="mt-4 flex items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-mono tracking-wide transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2"
              :style="{ borderColor: 'var(--color-border)', background: 'var(--color-surface-raised)', color: 'var(--color-text-secondary)' }"
              :aria-label="switcherAriaLabel"
              @click="toggleLocale"
            >
              <Languages :size="14" aria-hidden="true" />
              {{ switcherLabel }}
            </button>
            <span class="text-[11px] font-mono" style="color: var(--color-text-faint)">· {{ locale.toUpperCase() }}</span>
          </div>

          <div class="flex flex-wrap items-center gap-3 text-[11px] font-mono mt-4 pb-6 border-b" style="color: var(--color-text-faint); border-color: var(--color-border)">
            <time :datetime="post?.publishedAt">{{ formatDate(post?.publishedAt) }}</time>
            <span>·</span>
            <span>{{ readingTime }} min read</span>
            <span v-if="post?.tags?.length" class="hidden sm:inline">·</span>
            <span v-if="post?.tags?.length" class="hidden sm:inline truncate max-w-[260px]">{{ (post.tags || []).map((t:any)=>t.tag||t).join(', ') }}</span>
          </div>

          <div v-if="coverUrl" class="mt-6 mb-8 rounded-xl overflow-hidden border" style="border-color: var(--color-border)">
            <img :src="coverUrl" :alt="post?.title" loading="lazy" class="w-full object-cover" />
          </div>

          <div class="blog-content max-w-none" v-html="contentHtml"></div>

          <div class="mt-12 pt-6 border-t flex items-center justify-between" style="border-color: var(--color-border)">
            <router-link to="/blogs" class="text-[11px] font-mono inline-flex items-center gap-1.5" style="color: var(--color-text-muted)">← More posts</router-link>
            <button
              ref="shareBtnRef"
              type="button"
              class="text-[11px] font-mono inline-flex items-center gap-1.5 rounded-md px-2 py-1 -mr-2 transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style="color: var(--color-text-faint)"
              aria-label="Share this post"
              @click="handleShare"
            >
              <Share2 :size="14" aria-hidden="true" />
              Share
            </button>
          </div>
        </div>

        <!-- Right meta — sticky TOC placeholder -->
        <div class="hidden lg:block sticky top-20">
          <div class="rounded-xl border p-5" style="background: var(--color-surface); border-color: var(--color-border)">
            <div class="text-[11px] font-mono tracking-[0.14em] uppercase mb-3" style="color: var(--color-text-faint)">On this page</div>
            <div class="pt-4 border-t space-y-2" style="border-color: var(--color-border)">
              <div class="text-[11px] font-mono" style="color: var(--color-text-faint)">Published</div>
              <div class="text-[11px] font-mono" style="color: var(--color-text-secondary)">{{ formatDate(post?.publishedAt) }}</div>
              <div class="text-[11px] font-mono mt-3" style="color: var(--color-text-faint)">Reading time</div>
              <div class="text-[11px] font-mono" style="color: var(--color-text-secondary)">{{ readingTime }} minutes</div>
            </div>
          </div>
        </div>
      </article>
    </div>

    <Teleport to="body">
      <div
        v-if="showShareModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        aria-hidden="false"
      >
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          aria-hidden="true"
          @click="closeModal"
        ></div>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-title"
          class="relative w-full max-w-md rounded-xl border p-5 sm:p-6 shadow-xl"
          style="background: var(--color-surface); border-color: var(--color-border)"
          @click.stop
          @keydown.esc="closeModal"
        >
          <div class="flex items-start justify-between gap-4 mb-4">
            <h2 id="share-title" class="text-sm font-mono tracking-tight font-semibold" style="color: var(--color-text-primary)">Share this post</h2>
            <button
              type="button"
              class="inline-flex h-7 w-7 items-center justify-center rounded-md border text-[11px] font-mono transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2"
              style="border-color: var(--color-border); color: var(--color-text-muted); background: var(--color-surface-raised)"
              aria-label="Close share dialog"
              @click="closeModal"
            >
              ✕
            </button>
          </div>

          <label for="share-url-input" class="block text-[11px] font-mono mb-1.5" style="color: var(--color-text-faint)">Link</label>
          <input
            id="share-url-input"
            ref="shareInputRef"
            :value="shareUrl"
            readonly
            class="w-full rounded-lg border px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2"
            style="background: var(--color-surface-raised); border-color: var(--color-border); color: var(--color-text-secondary)"
            @focus="selectAll"
            @click="selectAll"
          />

          <div class="mt-4 flex gap-2 justify-end">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-lg border px-4 py-2 text-[11px] font-mono font-medium transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2"
              style="border-color: var(--color-border); color: var(--color-text-muted); background: transparent"
              @click="closeModal"
            >
              Close
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-lg px-4 py-2 text-[11px] font-mono font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-60"
              :style="{
                background: copied ? 'var(--color-success, #16a34a)' : 'var(--color-text-primary)',
                color: 'var(--color-bg)',
              }"
              @click="copyText"
            >
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, nextTick, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n'
import { Languages, Share2 } from 'lucide-vue-next'
import { usePosts } from '@/composables/usePosts'

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

useHead({
  title: computed(() => (post.value ? `${post.value.title} | Abu Amar` : 'Blog Post')),
  meta: computed(() => [
    { property: 'og:title', content: post.value?.title || 'Blog Post' },
    { property: 'og:description', content: post.value?.excerpt || 'Blog post by Abu Amar' },
    { property: 'og:type', content: 'article' },
  ]),
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
const switcherLabel = computed(() => (locale.value === 'en' ? 'Baca versi Indonesia' : 'Read in English'))
const switcherAriaLabel = computed(() => (locale.value === 'en' ? 'Switch to Indonesian' : 'Switch to English'))

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
      ta.style.position = 'fixed'
      ta.style.top = '-9999px'
      ta.style.opacity = '0'
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
