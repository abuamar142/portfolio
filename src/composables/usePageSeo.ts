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
  /**
   * Social card for this page. Omit to get the generated card: the preview
   * server renders a 1200x630 SVG from the page's own label/title/description
   * (so every shared link previews with its real content instead of the
   * generic site image). Pass a full URL to override — blog posts use their
   * cover image that way.
   */
  ogImage?: MaybeRef<string>
  /** Card label for the generated image (defaults to the page title). */
  ogLabel?: string
}) {
  const title = computed(() => unref(opts.title))
  const description = computed(() => unref(opts.description))

  // Generated card URL: the preview server renders label/title/subtitle into a
  // 1200x630 SVG. Every list/tool page gets its own card without shipping an
  // image per route.
  const generatedCard = computed(() => {
    const params = new URLSearchParams({
      label: opts.ogLabel || title.value,
      title: title.value,
      subtitle: unref(opts.description),
    })
    return `${SITE_URL}/api/og/page?${params.toString()}`
  })
  const ogImage = computed(() => unref(opts.ogImage) || generatedCard.value)

  useHead({
    title,
    meta: [
      ...(opts.meta ?? []),
      { name: 'description', content: description },
      { property: 'og:title', content: computed(() => `${title.value} - Abu Amar`) },
      { property: 'og:description', content: description },
      { property: 'og:image', content: ogImage },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
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
