import { ref, computed, watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { loadPost } from '../../scripts/blog/content'
import { formatDateLong } from '@/lib/formatDate'
import { addHeadingAnchors, type TocItem } from '@/lib/toc'

/**
 * A single blog post, read from the Markdown files in `content/blog/`.
 *
 * The loader is synchronous, so the first render already has the post — no
 * loading state, no `onServerPrefetch`. That is deliberate: the prerenderer
 * writes the body straight into HTML, and the browser bundle carries the same
 * strings, so there is nothing to wait for in either environment. (The previous
 * CMS version needed an async fetch plus DOMPurify; both are gone, because the
 * HTML now comes from files only this repository's authors can change.)
 *
 * Posts are written in one language. Switching locale changes the surrounding
 * chrome — dates, labels — not the body.
 */
export function useBlogPost(slugRef: Ref<string>) {
  const { locale } = useI18n()

  const post = ref(loadPost(slugRef.value))

  // An unknown slug is a soft 404: browsers get the SPA shell with HTTP 200
  // (nginx only proxies crawler user-agents to the preview server, which
  // answers a real 404), so the page must exclude itself from the index.
  const notFound = computed(() => post.value === null)
  const loading = ref(false)
  const error = computed(() => (notFound.value ? 'Post not found' : ''))

  function fetchPost() {
    post.value = loadPost(slugRef.value)
  }

  // Anchors are added so the table of contents and the headings agree by
  // construction — one pass produces both.
  const anchored = computed(() => addHeadingAnchors(post.value?.contentHtml || ''))
  const contentHtml = computed(() => anchored.value.html)
  const toc = computed<TocItem[]>(() => anchored.value.toc)

  const displayDate = computed(() => post.value?.date || '')
  const readingTime = computed(() => post.value?.readingTime ?? 0)

  function formatDate(iso?: string | null) {
    return formatDateLong(iso, locale.value)
  }

  watch(slugRef, fetchPost)

  return { post, loading, error, notFound, fetchPost, contentHtml, toc, displayDate, readingTime, formatDate }
}
