<template>
  <BaseModal
    :open="show"
    :close-label="$t('common.close')"
    labelled-by="auth-modal-title"
    @close="$emit('close')"
  >
    <h2 id="auth-modal-title" class="font-bold text-lg mb-4">
          {{ mode === 'login' ? $t('auth.signIn') : $t('auth.createAccount') }}
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-3">
          <div v-if="mode === 'register'">
            <label for="auth-display-name" class="label"><span class="label-text">{{ $t('auth.displayName') }}</span></label>
            <input id="auth-display-name" v-model="form.display_name" type="text" autocomplete="name" class="input input-bordered w-full" :placeholder="$t('auth.namePlaceholder')" />
          </div>

          <div>
            <label for="auth-identifier" class="label"><span class="label-text">{{ mode === 'login' ? $t('auth.emailOrUsername') : $t('auth.email') }}</span></label>
            <input id="auth-identifier" v-model="form.identifier" :type="mode === 'register' ? 'email' : 'text'" autocomplete="username" autocapitalize="none" spellcheck="false" required class="input input-bordered w-full" :placeholder="mode === 'login' ? $t('auth.identifierPlaceholderLogin') : $t('auth.identifierPlaceholderRegister')" />
          </div>

          <div v-if="mode === 'register'">
            <label for="auth-username" class="label"><span class="label-text">{{ $t('auth.usernameLabel') }}</span></label>
            <input id="auth-username" v-model="form.username" type="text" autocomplete="username" autocapitalize="none" spellcheck="false" class="input input-bordered w-full" :placeholder="$t('auth.usernamePlaceholder')" />
          </div>

          <div>
            <label for="auth-password" class="label"><span class="label-text">{{ $t('auth.password') }}</span></label>
            <input id="auth-password" v-model="form.password" type="password" :autocomplete="mode === 'login' ? 'current-password' : 'new-password'" required minlength="8" class="input input-bordered w-full" placeholder="••••••••" />
          </div>

          <p v-if="error" class="text-sm text-error">{{ error }}</p>

          <BaseButton
            type="submit"
            variant="primary"
            full-width
            :loading="loading"
            :loading-label="$t('auth.loading')"
            :disabled="loading"
          >
            {{ mode === 'login' ? $t('auth.signIn') : $t('auth.createAccount') }}
          </BaseButton>
        </form>

        <p class="mt-3 text-center text-sm">
          {{ mode === 'login' ? $t('auth.noAccount') : $t('auth.haveAccount') }}
          <button @click="toggleMode" class="link link-primary">
            {{ mode === 'login' ? $t('auth.signUp') : $t('auth.signIn') }}
          </button>
        </p>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'
import { authClient } from '@/services/client'
import { useToast } from '@/composables/useToast'

defineProps<{ show: boolean }>()
const emit = defineEmits<{ close: []; authenticated: [] }>()

const { t } = useI18n()
const { setTokens, storeUser } = useAuth()
const toast = useToast()
const mode = ref<'login' | 'register'>('login')
const loading = ref(false)
const error = ref('')

const form = reactive({
  identifier: '',
  username: '',
  password: '',
  display_name: '',
})

function toggleMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  error.value = ''
}

async function handleLogin(identifier: string, password: string) {
  const { data } = await authClient.post('/auth/login', { identifier, password })
  if (data.data?.access_token) {
    setTokens(data.data.access_token, data.data.refresh_token || '')
    // Login doesn't return user — fetch it from /me
    const { data: meData } = await authClient.get('/auth/me', {
      headers: { Authorization: `Bearer ${data.data.access_token}` },
    })
    if (meData.data) {
      storeUser(meData.data)
    }
    toast.success(mode.value === 'register' ? t('auth.createdToast') : t('auth.welcomeToast'))
    emit('authenticated')
    emit('close')
  }
}

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    if (mode.value === 'register') {
      await authClient.post('/auth/register', {
        email: form.identifier,
        username: form.username,
        password: form.password,
        display_name: form.display_name,
      })
      // Auto-login after register (register doesn't return token)
      await handleLogin(form.identifier, form.password)
    } else {
      await handleLogin(form.identifier, form.password)
    }
  } catch (e: unknown) {
    type AxiosLike = { response?: { data?: { error?: { details?: string }; message?: string } } }
    const err = (e && typeof e === 'object' && 'response' in e) ? (e as AxiosLike) : null
    const raw = err?.response?.data?.error?.details || err?.response?.data?.message || ''
    const msg = /invalid email\/username or password/i.test(raw)
      ? t('auth.errorCredentials')
      : raw || t('auth.somethingWrong')
    error.value = msg
    toast.error(msg)
  } finally {
    loading.value = false
  }
}
</script>
