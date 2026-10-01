import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import generateSitemap from 'vite-ssg-sitemap'
import { readPostSlugs } from './scripts/blog/slugs'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  /**
   * Post slugs come from `content/blog/*.md`, so every blog detail page is
   * prerendered as a real HTML file (dist/blogs/<slug>.html).
   *
   * This used to fetch the slug list from the CMS over HTTP. Reading the same
   * files the pages render from removes that dependency entirely: a slug can no
   * longer be in the sitemap without a matching page, or the reverse.
   */
  function postSlugs(): string[] {
    return readPostSlugs()
  }

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        // vue-i18n's default build compiles message strings at runtime with
        // `new Function(...)`, which a strict Content-Security-Policy blocks
        // (no 'unsafe-eval'). Every message in this app is plain text with
        // simple {placeholder} interpolation, which the runtime-only build
        // handles without eval.
        //
        // Applied to the production build only. The runtime-only build
        // registers no message compiler unless `__INTLIFY_JIT_COMPILATION__`
        // is defined at bundle time, and the dev server's dependency pre-bundle
        // does not define it: with the alias active in dev, every message came
        // back as its key (`hero.greeting Abu Amar.` on screen) plus one console
        // warning per string. Dev has no CSP, so dev gets the default build;
        // builds keep the runtime-only alias exactly as before.
        ...(mode === 'production'
          ? { 'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js' }
          : {}),
      },
    },
    ssgOptions: {
      script: 'async',
      // Keep static routes ('/', '/blogs', '/explore'), swap '/blogs/:slug' for one
      // concrete path per post slug, and drop the ':pathMatch' catch-all.
      includedRoutes(paths: string[]) {
        const staticPaths = paths.filter((p) => !p.includes(':') && !p.includes('*'))
        return staticPaths.concat(postSlugs().map((s) => `/blogs/${s}`))
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
          // /qr, /remove-bg and /feedback are thin utility surfaces with no
          // indexable copy; listing them only dilutes crawl budget.
          exclude: ['/dashboard', '/qr', '/remove-bg', '/feedback'],
        })
      },
    },
  }
})
