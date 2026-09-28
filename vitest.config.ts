import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

/**
 * Vitest runs against the same source as the app, so the Vue plugin and the
 * `@` alias must match vite.config.ts. Kept in a separate file because the
 * app config is a function of `mode` (it fetches CMS slugs at build time) and
 * importing it here would run that fetch during tests.
 */
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // NOTE: the app aliases vue-i18n to its runtime-only build (to keep
      // `new Function` out of the bundle so a strict CSP can ship). Tests must
      // NOT use that alias: the runtime build cannot compile message strings,
      // so every t() would return its raw key. The full build is used here and
      // the production bundle is verified separately.
    },
  },
  test: {
    // jsdom, not happy-dom: the blog sanitizer (DOMPurify) silently fails its
    // allow-list under happy-dom — `<script>` contents survived sanitizing
    // there, which would have made the security tests pass while proving
    // nothing. jsdom matches real browser behavior for this case.
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.spec.ts'],
    // Component tests mount real dialogs/teleports; a per-test reset keeps
    // localStorage from leaking between them.
    restoreMocks: true,
  },
})
