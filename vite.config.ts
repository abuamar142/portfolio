import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import generateSitemap from 'vite-ssg-sitemap'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBase = env.VITE_BACKEND_URL || 'https://backend.abuamar.online'

  /**
   * Fetch the published post slugs at build time so every blog detail page is
   * prerendered as a real HTML file (dist/blogs/<slug>.html). Handles the
   * backend's `{ success, data: [...] }` wrapper (array or `posts` key) and
   * never fails the build — an API hiccup just falls back to no slug routes.
   */
  async function fetchPostSlugs(): Promise<string[]> {
    try {
      const res = await fetch(`${apiBase}/api/v1/personal/posts?limit=100`)
      if (!res.ok) return []
      type PostSlugItem = { slug?: string }
      type PostsBody = { data?: unknown; posts?: PostSlugItem[] }
      const body = await res.json() as PostsBody
      const raw = body?.data ?? body
      const posts = Array.isArray(raw) ? raw as PostSlugItem[] : ((raw as PostsBody)?.posts || [])
      return posts.map((p) => String(p?.slug || '').trim()).filter(Boolean)
    } catch {
      // Never fail the build because the API hiccuped.
      return []
    }
  }

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    ssgOptions: {
      script: 'async',
      // Keep static routes ('/', '/blogs', '/explore'), swap '/blogs/:slug' for one
      // concrete path per post slug, and drop the ':pathMatch' catch-all.
      async includedRoutes(paths: string[]) {
        const staticPaths = paths.filter((p) => !p.includes(':') && !p.includes('*'))
        const slugs = await fetchPostSlugs()
        return staticPaths.concat(slugs.map((s) => `/blogs/${s}`))
      },
      // Route '/blogs' renders to 'blogs.html' in vite-ssg's default flat
      // dirStyle; remap it to 'blogs/index.html' so the prerendered blog list
      // is served as the directory index while '/blogs/<slug>' pages stay at
      // 'blogs/<slug>.html' (matches the nginx $uri.html layout).
      htmlFileName: (filename: string) => (filename === 'blogs.html' ? 'blogs/index.html' : undefined),
      async onFinished() {
        // Generate sitemap.xml only — robots.txt is a static file in public/.
        // The plugin auto-discovers every prerendered HTML file in dist, which
        // already yields '/', '/blogs' and each '/blogs/<slug>'; dynamicRoutes
        // is deliberately not passed because vite-ssg-sitemap does not dedupe
        // discovered files against it (it would emit duplicate <url> entries).
        generateSitemap({
          hostname: 'https://abuamar.online',
          generateRobotsTxt: false,
          // /dashboard is owner-only and served with robots noindex — a
          // submitted noindex URL shows up as a Search Console warning.
          exclude: ['/dashboard'],
        })
      },
    },
  }
})
