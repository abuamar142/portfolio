<template>
  <section class="relative py-12 sm:py-16 lg:py-20 bg-dracula-background overflow-hidden">
    <div class="relative max-w-4xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-dracula-foreground font-mono">{{ isEdit ? 'Edit Post' : 'New Post' }}</h1>
        <router-link to="/admin" class="text-dracula-comment hover:text-dracula-purple">Back</router-link>
      </div>

      <div v-if="forbidden" class="text-red-400">403 · You are not authorized.</div>

      <form v-else @submit.prevent="onSubmit" class="space-y-4 bg-dracula-selection border border-gray-500 rounded-lg p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-dracula-comment mb-1">Title</label>
            <input v-model="title" class="w-full px-3 py-2 bg-transparent border border-gray-600 rounded text-dracula-foreground focus:outline-none focus:border-dracula-purple" required />
          </div>
          <div>
            <label class="block text-sm text-dracula-comment mb-1">Slug</label>
            <input v-model="slug" class="w-full px-3 py-2 bg-transparent border border-gray-600 rounded text-dracula-foreground focus:outline-none focus:border-dracula-purple" required />
            <div class="text-xs text-dracula-comment mt-1">Auto-generated from title; you can edit.</div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
          <div class="lg:col-span-2">
            <label class="block text-sm text-dracula-comment mb-1">Cover Image URL</label>
            <input v-model="cover" class="w-full px-3 py-2 bg-transparent border border-gray-600 rounded text-dracula-foreground focus:outline-none focus:border-dracula-purple" />
          </div>
          <div>
            <label class="block text-sm text-dracula-comment mb-1">Status</label>
            <select v-model="status" class="w-full px-3 py-2 bg-transparent border border-gray-600 rounded text-dracula-foreground focus:outline-none focus:border-dracula-purple">
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm text-dracula-comment mb-1">Tags (comma separated)</label>
          <input v-model="tagsInput" class="w-full px-3 py-2 bg-transparent border border-gray-600 rounded text-dracula-foreground focus:outline-none focus:border-dracula-purple" placeholder="vue, vite, supabase" />
        </div>

        <MarkdownEditor v-model="contentMd" />

        <div class="flex gap-3">
          <button type="submit" class="px-4 py-2 rounded bg-dracula-purple text-dracula-foreground hover:bg-dracula-pink transition-colors">Save</button>
          <button v-if="isEdit && status !== 'published'" type="button" @click="doPublish" class="px-4 py-2 rounded border border-dracula-green text-dracula-green hover:bg-dracula-green/10">Publish</button>
          <button v-if="isEdit && status === 'published'" type="button" @click="doUnpublish" class="px-4 py-2 rounded border border-gray-600 text-dracula-foreground hover:border-dracula-purple hover:text-dracula-purple">Unpublish</button>
        </div>

        <div v-if="formError" class="text-red-400">{{ formError }}</div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import { usePosts } from '@/composables/usePosts'
import { slugify } from '@/utils/slugify'
import { isAdmin } from '@/lib/auth'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
const forbidden = ref(false)

const { getById, createPost, updatePost, publishPost, unpublishPost } = usePosts()

const id = ref<string | null>(null)
const title = ref('')
const slug = ref('')
const cover = ref('')
const status = ref<'draft' | 'published'>('draft')
const tagsInput = ref('')
const contentMd = ref('')
const formError = ref('')

watch(title, (t) => {
  if (!isEdit.value) slug.value = slugify(t)
})

onMounted(async () => {
  const ok = await isAdmin()
  if (!ok) { forbidden.value = true; return }

  if (isEdit.value) {
    id.value = route.params.id as string
    const data = await getById(id.value)
    if (data) {
      title.value = data.title
      slug.value = data.slug
      cover.value = data.cover_image_url || ''
      status.value = data.status
      tagsInput.value = (data.tags || []).join(', ')
      contentMd.value = data.content_md || ''
    }
  }
})

async function onSubmit() {
  formError.value = ''
  const tags = tagsInput.value.split(',').map((t) => t.trim()).filter(Boolean)
  try {
    if (isEdit.value && id.value) {
      await updatePost(id.value, {
        title: title.value,
        slug: slug.value,
        status: status.value,
        tags,
        cover_image_url: cover.value || null,
        content_md: contentMd.value,
      })
    } else {
      const res = await createPost({
        title: title.value,
        slug: slug.value,
        status: status.value,
        tags,
        cover_image_url: cover.value || null,
        content_md: contentMd.value,
      })
      id.value = res?.id || null
    }
    router.push('/admin')
  } catch (e: any) {
    if (e?.code === '23505') formError.value = 'Slug already exists. Please choose another.'
    else formError.value = e?.message || 'Failed to save post'
  }
}

async function doPublish() {
  if (!id.value) return
  await publishPost(id.value)
  status.value = 'published'
}

async function doUnpublish() {
  if (!id.value) return
  await unpublishPost(id.value)
  status.value = 'draft'
}
</script>
