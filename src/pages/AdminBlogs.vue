<template>
  <section class="relative py-12 sm:py-16 lg:py-20 bg-dracula-background overflow-hidden">
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6">
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-dracula-foreground font-mono">Admin · Blogs</h1>
        <p class="text-dracula-comment mt-2">Create, edit, and publish blog posts</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Form -->
        <div class="bg-dracula-selection border border-gray-500 rounded-lg p-6">
          <h2 class="text-xl font-mono text-dracula-foreground mb-4">{{ state.editingId ? 'Edit Post' : 'New Post' }}</h2>
          <form @submit.prevent="onSubmit" class="space-y-4">
            <div>
              <label class="block text-sm text-dracula-comment mb-1">Title</label>
              <input v-model="form.title" class="w-full px-3 py-2 bg-transparent border border-gray-600 rounded text-dracula-foreground focus:outline-none focus:border-dracula-purple" required />
            </div>
            <div>
              <label class="block text-sm text-dracula-comment mb-1">Summary</label>
              <textarea v-model="form.summary" rows="2" class="w-full px-3 py-2 bg-transparent border border-gray-600 rounded text-dracula-foreground focus:outline-none focus:border-dracula-purple" required />
            </div>
            <div>
              <label class="block text-sm text-dracula-comment mb-1">Content</label>
              <textarea v-model="form.content" rows="6" class="w-full px-3 py-2 bg-transparent border border-gray-600 rounded text-dracula-foreground focus:outline-none focus:border-dracula-purple" required />
            </div>
            <div>
              <label class="block text-sm text-dracula-comment mb-1">Tags (comma separated)</label>
              <input v-model="form.tagsInput" class="w-full px-3 py-2 bg-transparent border border-gray-600 rounded text-dracula-foreground focus:outline-none focus:border-dracula-purple" placeholder="vue, tailwind, tips" />
            </div>
            <div class="flex items-center gap-3">
              <input id="published" type="checkbox" v-model="form.published" class="h-4 w-4" />
              <label for="published" class="text-dracula-foreground">Published</label>
            </div>
            <div class="flex gap-3">
              <button type="submit" class="px-4 py-2 rounded bg-dracula-purple text-dracula-foreground hover:bg-dracula-pink transition-colors">
                {{ state.editingId ? 'Update' : 'Create' }}
              </button>
              <button v-if="state.editingId" type="button" @click="resetForm" class="px-4 py-2 rounded border border-gray-600 text-dracula-foreground hover:border-dracula-purple hover:text-dracula-purple">Cancel</button>
              </div>
          </form>
        </div>

        <!-- List -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-mono text-dracula-foreground">Posts</h2>
            <span class="text-dracula-comment">{{ posts.length }} total</span>
          </div>
          <div v-if="posts.length === 0" class="text-dracula-comment">No posts yet.</div>
          <div v-for="post in posts" :key="post.id" class="bg-dracula-selection border border-gray-500 rounded-lg p-5">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-mono text-dracula-foreground">{{ post.title }}</h3>
                <p class="text-dracula-comment text-sm">{{ formatDate(post.createdAt) }} • <span v-if="post.published" class="text-dracula-green">Published</span><span v-else class="text-dracula-purple">Draft</span></p>
              </div>
              <div class="flex gap-2">
                <button @click="startEdit(post.id)" class="px-3 py-1 rounded border border-gray-600 text-dracula-foreground hover:border-dracula-purple hover:text-dracula-purple">Edit</button>
                <button @click="toggle(post.id)" class="px-3 py-1 rounded border border-gray-600 text-dracula-foreground hover:border-dracula-purple hover:text-dracula-purple">{{ post.published ? 'Unpublish' : 'Publish' }}</button>
                <button @click="del(post.id)" class="px-3 py-1 rounded border border-red-500 text-red-400 hover:bg-red-500/10">Delete</button>
              </div>
            </div>
            <p class="mt-3 text-dracula-foreground">{{ post.summary }}</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <span v-for="tag in post.tags" :key="tag" class="px-2 py-0.5 bg-dracula-purple/20 border border-dracula-purple/30 text-dracula-purple text-xs rounded-full font-mono">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useBlogs } from '@/composables/useBlogs'

const { posts, create, update, remove, togglePublish } = useBlogs()

const form = reactive({
  title: '',
  summary: '',
  content: '',
  tagsInput: '',
  published: false,
})

const state = reactive<{ editingId: string | null }>({ editingId: null })

function resetForm() {
  form.title = ''
  form.summary = ''
  form.content = ''
  form.tagsInput = ''
  form.published = false
  state.editingId = null
}

function onSubmit() {
  const tags = form.tagsInput
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  if (state.editingId) {
    update(state.editingId, {
      title: form.title,
      summary: form.summary,
      content: form.content,
      tags,
      published: form.published,
    })
  } else {
    create({
      title: form.title,
      summary: form.summary,
      content: form.content,
      tags,
      published: form.published,
    })
  }
  resetForm()
}

function startEdit(id: string) {
  const post = posts.value.find((p) => p.id === id)
  if (!post) return
  state.editingId = id
  form.title = post.title
  form.summary = post.summary
  form.content = post.content
  form.tagsInput = post.tags.join(', ')
  form.published = post.published
}

function del(id: string) {
  if (confirm('Delete this post?')) remove(id)
}

function toggle(id: string) {
  togglePublish(id)
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}
</script>
