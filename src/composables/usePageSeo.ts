import { computed, unref, type MaybeRef } from 'vue'
import { useHead } from '@unhead/vue'
import { SITE_URL } from '@/site'

/**
 * The one owner of the per-page SEO head shape:
 * document title, meta description, the og:title/og:description pair
 * (og:title always carries the site suffix), and — for sub-pages — a
 * BreadcrumbList so Google can render the page's place in the hierarchy.
 *
 * Pages that need article/schema markup or a different title template keep
 * their own useHead call.
 *
 * Every meta value is computed so locale switches update the head live.
 */
export function usePageSeo(opts: {
  title: MaybeRef<string>
  description: MaybeRef<string>
  /** Extra name/content metas — e.g. robots noindex on the dashboard. */
  meta?: { name: string; content: string }[]
  /**
   * Breadcrumb trail for sub-pages, e.g.
   * `[{ name: 'Jelajahi', path: '/explore' }]`. The page itself is appended
   * automatically, so callers list only the ancestors. Omit on top-level
   * pages (home, /explore) — a single-item trail is noise.
   */
  breadcrumbs?: { name: string; path: string }[]
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
    script: computed(() => {
      if (!opts.breadcrumbs?.length) return []
      const trail = [
        { name: 'Beranda', path: '/' },
        ...opts.breadcrumbs,
        { name: title.value, path: '' },
      ]
      return [
        {
          type: 'application/ld+json',
          textContent: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: trail.map((crumb, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: crumb.name,
              ...(crumb.path ? { item: `${SITE_URL}${crumb.path}` } : {}),
            })),
          }),
        },
      ]
    }),
  })
}
