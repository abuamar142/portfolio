import { computed, unref, type MaybeRef } from 'vue'
import { useHead } from '@unhead/vue'

/**
 * The one owner of the per-page SEO head shape:
 * document title, meta description, and the og:title/og:description pair
 * (og:title always carries the site suffix). Pages that need article/schema
 * markup or a different title template keep their own useHead call.
 *
 * Every meta value is computed so locale switches update the head live.
 */
export function usePageSeo(opts: {
  title: MaybeRef<string>
  description: MaybeRef<string>
  /** Extra name/content metas — e.g. robots noindex on the dashboard. */
  meta?: { name: string; content: string }[]
}) {
  const title = computed(() => unref(opts.title))
  const description = computed(() => unref(opts.description))
  useHead({
    title,
    meta: [
      ...(opts.meta ?? []),
      { name: 'description', content: description },
      { property: 'og:title', content: computed(() => `${title.value} - Abu Amar`) },
      { property: 'og:description', content: description },
    ],
  })
}
