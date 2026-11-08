import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
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
    plugins: [vue(), tailwindcss()],
    // vue-i18n's default build compiles message strings at runtime with
    // `new Function(...)`, which a strict Content-Security-Policy blocks (no
    // 'unsafe-eval'). The production build therefore ships the runtime-only
    // build and turns on its JIT mode instead: `__INTLIFY_JIT_COMPILATION__`
    // makes it parse each message into an AST and compose the formatter as
    // plain closures — no eval, and `{placeholder}` interpolation works.
    //
    // Without the flag the runtime build registers NO message compiler
    // (`compileMessageFormat` falls back to `() => format`), so every message
    // came back verbatim: dev showed raw keys, and production showed
    // `{n} bulan lalu` instead of "3 bulan lalu". Both are the same bug.
    //
    // The define is scoped to the production build because the dev server
    // pre-bundles dependencies with its own config; dev falls through to the
    // default build, which compiles messages itself.
    define: mode === 'production' ? { __INTLIFY_JIT_COMPILATION__: 'true' } : {},
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
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
          // /qr, /remove-bg and the /json, /base64, /hash, /uuid tools are
          // thin utility surfaces with no indexable copy; listing them only
          // dilutes crawl budget.
          exclude: [
            '/dashboard',
            '/qr',
            '/remove-bg',
            '/json',
            '/base64',
            '/hash',
            '/uuid',
            '/timestamp',
            '/jwt',
            '/tebak-kata',
            '/waktu',
            '/feedback',
          ],
        })
      },
    },
  }
})
