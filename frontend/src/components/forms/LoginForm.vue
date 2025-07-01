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
import Input from '../ui/Input.vue'
import Button from '../ui/Button.vue'

const router = useRouter()
const isLoading = ref(false)

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const handleSubmit = async () => {
  isLoading.value = true
  
  try {
    // Simulation d'une connexion
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Redirection vers le dashboard
    router.push('/dashboard')
  } catch (error) {
    console.error('Erreur de connexion:', error)
  } finally {
    isLoading.value = false
  }
}
</script>