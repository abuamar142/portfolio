<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="$emit('close')">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div class="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md p-8 z-10">
          <button @click="$emit('close')" class="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>

          <h2 class="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
            {{ mode === 'login' ? 'Sign In' : 'Create Account' }}
          </h2>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div v-if="mode === 'register'">
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Display Name</label>
              <input v-model="form.display_name" type="text" class="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your name" />
            </div>

            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{{ mode === 'login' ? 'Email or Username' : 'Email' }}</label>
              <input v-model="form.identifier" type="text" required class="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" :placeholder="mode === 'login' ? 'email or username' : 'email@example.com'" />
            </div>

            <div v-if="mode === 'register'">
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Username</label>
              <input v-model="form.username" type="text" class="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="username" />
            </div>

            <div>
              <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Password</label>
              <input v-model="form.password" type="password" required minlength="8" class="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="••••••••" />
            </div>

            <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

            <button type="submit" :disabled="loading" class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors">
              {{ loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account' }}
            </button>
          </form>

          <p class="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
            {{ mode === 'login' ? "Don't have an account?" : "Already have an account?" }}
            <button @click="toggleMode" class="text-blue-600 hover:text-blue-700 font-medium ml-1">
              {{ mode === 'login' ? 'Sign Up' : 'Sign In' }}
            </button>
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuth } from '@/composables/useAuth'
import axios from 'axios'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { setToken, storeUser } = useAuth()
const mode = ref<'login' | 'register'>('login')
const loading = ref(false)
const error = ref('')

const form = reactive({
  identifier: '',
  username: '',
  password: '',
  display_name: '',
})

const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'https://auth.abuamar.online'

function toggleMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  error.value = ''
}

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    if (mode.value === 'register') {
      const { data } = await axios.post(`${AUTH_URL}/api/v1/auth/register`, {
        email: form.identifier,
        username: form.username,
        password: form.password,
        display_name: form.display_name,
      })
      if (data.data?.access_token) {
        setToken(data.data.access_token)
        storeUser(data.data.user)
        emit('close')
      }
    } else {
      // Detect if identifier is email
      const isEmail = form.identifier.includes('@')
      const payload = isEmail
        ? { email: form.identifier, password: form.password }
        : { username: form.identifier, password: form.password }

      const { data } = await axios.post(`${AUTH_URL}/api/v1/auth/login`, payload)
      if (data.data?.access_token) {
        setToken(data.data.access_token)
        storeUser(data.data.user)
        emit('close')
      }
    }
  } catch (e: any) {
    error.value = e.response?.data?.error?.details || e.response?.data?.message || 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
