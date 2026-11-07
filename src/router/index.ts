import type { RouteRecordRaw } from 'vue-router'

// Routes only — the router instance itself is created by ViteSSG in src/main.ts
// (routerOptions, incl. scrollBehavior, are passed there).
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/HomePage.vue'),
  },
  {
    path: '/blogs',
    name: 'blogs',
    component: () => import('../pages/BlogsList.vue'),
  },
  {
    path: '/blogs/:slug',
    name: 'blog-detail',
    component: () => import('../pages/BlogDetail.vue'),
  },
  {
    path: '/explore',
    name: 'explore',
    component: () => import('../pages/ExplorePage.vue'),
  },
  {
    path: '/quotes/:id',
    name: 'quote-detail',
    component: () => import('../pages/QuoteDetailPage.vue'),
  },
  {
    path: '/quotes',
    name: 'quotes',
    component: () => import('../pages/QuotesPage.vue'),
  },
  {
    path: '/remove-bg',
    name: 'remove-bg',
    component: () => import('../pages/RemoveBgPage.vue'),
  },
  {
    path: '/qr',
    name: 'qr',
    component: () => import('../pages/QrMakerPage.vue'),
  },
  {
    path: '/json',
    name: 'json',
    component: () => import('../pages/JsonToolPage.vue'),
  },
  {
    path: '/base64',
    name: 'base64',
    component: () => import('../pages/Base64ToolPage.vue'),
  },
  {
    path: '/hash',
    name: 'hash',
    component: () => import('../pages/HashToolPage.vue'),
  },
  {
    path: '/uuid',
    name: 'uuid',
    component: () => import('../pages/UuidToolPage.vue'),
  },
  {
    path: '/timestamp',
    name: 'timestamp',
    component: () => import('../pages/TimestampToolPage.vue'),
  },
  {
    path: '/jwt',
    name: 'jwt',
    component: () => import('../pages/JwtToolPage.vue'),
  },
  {
    path: '/links',
    name: 'links',
    component: () => import('../pages/LinksPage.vue'),
  },
  {
    path: '/snippets',
    name: 'snippets',
    component: () => import('../pages/SnippetsPage.vue'),
  },
  {
    path: '/snippets/:id',
    name: 'snippet-detail',
    component: () => import('../pages/SnippetDetailPage.vue')
  },
  {
    path: '/tebak-kata',
    name: 'tebak-kata',
    component: () => import('../pages/TebakKataPage.vue'),
  },
  {
    path: '/waktu',
    name: 'waktu',
    component: () => import('../pages/FocusPage.vue'),
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: () => import('../pages/FeedbackPage.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../pages/DashboardPage.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/NotFound.vue'),
  },
]
