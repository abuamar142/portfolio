<template>
  <section class="relative py-12 sm:py-16 lg:py-20 bg-dracula-background overflow-hidden">
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-dracula-foreground font-mono">Admin · Posts</h1>
        <div class="flex gap-3">
          <input v-model="q" placeholder="Search" class="px-3 py-2 bg-transparent border border-gray-600 rounded text-dracula-foreground focus:outline-none focus:border-dracula-purple" />
          <router-link to="/admin/new" class="px-4 py-2 rounded bg-dracula-purple text-dracula-foreground hover:bg-dracula-pink transition-colors">New</router-link>
        </div>
      </div>

      <div v-if="forbidden" class="text-red-400">403 · You are not authorized.</div>

      <div v-else>
        <div v-if="loading" class="text-dracula-comment">Loading...</div>
        <div v-else-if="error" class="text-red-400">{{ error }}</div>

        <div v-else class="space-y-3">
          <div
            v-for="post in filtered"
            :key="post.id"
            class="bg-dracula-selection border border-gray-500 rounded-lg p-5 flex items-center justify-between"
          >
            <div>
              <div class="text-dracula-foreground font-mono">{{ post.title }}</div>
              <div class="text-dracula-comment text-sm">/{{ post.slug }} • {{ post.status }} • Updated {{ formatDateTime(post.updated_at) }}</div>
            </div>
            <div class="flex gap-2">
              <router-link :to="`/admin/${post.id}/edit`" class="px-3 py-1 rounded border border-gray-600 text-dracula-foreground hover:border-dracula-purple hover:text-dracula-purple">Edit</router-link>
              <button @click="toggle(post)" class="px-3 py-1 rounded border border-gray-600 text-dracula-foreground hover:border-dracula-purple hover:text-dracula-purple">{{ post.status === 'published' ? 'Unpublish' : 'Publish' }}</button>
              <button @click="del(post.id)" class="px-3 py-1 rounded border border-red-500 text-red-400 hover:bg-red-500/10">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePosts } from '@/composables/usePosts'
import { isAdmin } from '@/lib/auth'

const route = useRoute()
const router = useRouter()
const forbidden = ref(false)

const { listAllForAdmin, deletePost, publishPost, unpublishPost } = usePosts()
const posts = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const q = ref('')

onMounted(async () => {
  const ok = await isAdmin()
  if (!ok) {
    forbidden.value = true
    return
  }
  await load()
})

async function load() {
  try {
    loading.value = true
    posts.value = await listAllForAdmin({})
  } catch (e: any) {
    error.value = e?.message || 'Failed to load posts'
  } finally {
    loading.value = false
  }
}

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return posts.value
  return posts.value.filter((p) => p.title.toLowerCase().includes(term) || p.slug.toLowerCase().includes(term))
})

async function del(id: string) {
  if (!confirm('Delete this post?')) return
  await deletePost(id)
  await load()
}

async function toggle(post: any) {
  if (post.status === 'published') await unpublishPost(post.id)
  else await publishPost(post.id)
  await load()
}

function formatDateTime(iso?: string | null) {
  if (!iso) return ''
  try { return new Date(iso).toLocaleString() } catch { return String(iso) }
}
</script>

