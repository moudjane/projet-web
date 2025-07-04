<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <Input
      id="username"
      v-model="form.username"
      label="Nom d'utilisateur"
      placeholder="mon_username"
      required
    />

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

    <div v-if="errorMsg" class="text-red-500 text-center">
      {{ errorMsg }}
    </div>

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
import { useMutation } from '@vue/apollo-composable'
import Input from '../ui/InputComponent .vue'
import Button from '../ui/ButtonComponent.vue'
import { SIGNUP } from '@/graphql/mutations'

const router = useRouter()
const isLoading = ref(false)
const errorMsg = ref<string | null>(null)

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isFormValid = computed(() => {
  return form.username &&
    form.email &&
    form.password &&
    form.confirmPassword &&
    form.password === form.confirmPassword &&
    form.password.length >= 8
})

const { mutate: signup } = useMutation(SIGNUP)

const handleSubmit = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  errorMsg.value = null

  try {
    // Peut être null, donc on vérifie
    const result = await signup({
      username: form.username,
      email: form.email,
      password: form.password,
    })

    if (!result || !result.data || !result.data.signup) {
      errorMsg.value = "Une erreur inconnue s'est produite."
      return
    }

    // Redirection si tout est ok
    router.push('/login')
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'graphQLErrors' in error) {
      const graphQLError = error as { graphQLErrors: Array<{ message: string }> }
      if (graphQLError.graphQLErrors?.[0]?.message) {
        errorMsg.value = graphQLError.graphQLErrors[0].message
      } else {
        errorMsg.value = 'Erreur lors de la création du compte'
      }
    } else if (error && typeof error === 'object' && 'message' in error) {
      const errorWithMessage = error as { message: string }
      errorMsg.value = errorWithMessage.message
    } else {
      errorMsg.value = 'Erreur lors de la création du compte'
    }
  } finally {
    isLoading.value = false
  }
}

</script>
