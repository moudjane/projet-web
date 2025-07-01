<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-2 gap-4">
      <Input
        id="firstName"
        v-model="form.firstName"
        label="Prénom"
        placeholder="Prénom"
        required
      />
      <Input
        id="lastName"
        v-model="form.lastName"
        label="Nom"
        placeholder="Nom"
        required
      />
    </div>

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
      hint="Au moins 8 caractères avec une majuscule et un chiffre"
      required
    />

    <Input
      id="confirmPassword"
      v-model="form.confirmPassword"
      type="password"
      label="Confirmer le mot de passe"
      placeholder="••••••••"
      :error="form.confirmPassword && form.password !== form.confirmPassword ? 'Les mots de passe ne correspondent pas' : undefined"
      required
    />

    <Button
      type="submit"
      :disabled="isLoading || !isFormValid"
      :loading="isLoading"
      loading-text="Création du compte..."
    >
      Créer mon compte
    </Button>

    <div class="text-center">
      <p class="text-gray-600">
        Déjà un compte ?
        <router-link to="/login" class="text-primary hover:text-secondary font-medium">
          Se connecter
        </router-link>
      </p>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import Input from '../ui/Input.vue'
import Button from '../ui/Button.vue'

const router = useRouter()
const isLoading = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isFormValid = computed(() => {
  return form.firstName &&
         form.lastName &&
         form.email &&
         form.password &&
         form.confirmPassword &&
         form.password === form.confirmPassword &&
         form.password.length >= 8
})

const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  isLoading.value = true
  
  try {
    // Simulation d'une inscription
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Redirection vers la connexion
    router.push('/login')
  } catch (error) {
    console.error('Erreur d\'inscription:', error)
  } finally {
    isLoading.value = false
  }
}
</script>