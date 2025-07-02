<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <Input
      id="email"
      v-model="form.email"
      type="email"
      label="Adresse email"
      placeholder="votre@email.com"
      required
    />

    <Input
      id="password"
      v-model="form.password"
      type="password"
      label="Mot de passe"
      placeholder="••••••••"
      required
    />

    <div class="flex items-center justify-between">
      <label class="flex items-center">
        <input
          v-model="form.rememberMe"
          type="checkbox"
          class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <span class="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
      </label>
      <a href="#" class="text-sm text-primary hover:text-secondary">
        Mot de passe oublié ?
      </a>
    </div>

    <Button
      type="submit"
      :disabled="isLoading"
      :loading="isLoading"
      loading-text="Connexion..."
    >
      Se connecter
    </Button>

    <div v-if="errorMsg" class="text-red-500 text-center mb-2">
      {{ errorMsg }}
    </div>

    <div class="text-center">
      <p class="text-gray-600">
        Pas encore de compte ?
        <router-link to="/register" class="text-primary hover:text-secondary font-medium">
          Créer un compte
        </router-link>
      </p>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'
import Input from '../ui/InputComponent .vue'
import Button from '../ui/ButtonComponent.vue'
import { graphql } from '../../gql/gql'

// Déclaration de la mutation GraphQL typée avec codegen
const LOGIN = graphql(`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`)

const router = useRouter()
const isLoading = ref(false)
const errorMsg = ref<string | null>(null)

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const { mutate: login } = useMutation(LOGIN)

const handleSubmit = async () => {
  isLoading.value = true
  errorMsg.value = null

  try {
    const result = await login({
      email: form.email,
      password: form.password,
    })

    if (!result || !result.data || !result.data.login) {
      errorMsg.value = "Email ou mot de passe incorrect"
      return
    }

    // Stockage du token selon le choix de l'utilisateur
    if (form.rememberMe) {
      localStorage.setItem('token', result.data.login)
    } else {
      sessionStorage.setItem('token', result.data.login)
    }

    router.push('/dashboard')
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'graphQLErrors' in error) {
      const graphQLError = error as { graphQLErrors: Array<{ message: string }> }
      if (graphQLError.graphQLErrors?.[0]?.message) {
        errorMsg.value = graphQLError.graphQLErrors[0].message
      } else {
        errorMsg.value = 'Erreur de connexion'
      }
    } else if (error && typeof error === 'object' && 'message' in error) {
      const errorWithMessage = error as { message: string }
      errorMsg.value = errorWithMessage.message
    } else {
      errorMsg.value = 'Erreur de connexion'
    }
  } finally {
    isLoading.value = false
  }
}
</script>
