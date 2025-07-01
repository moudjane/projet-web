<template>
  <div class="min-h-screen bg-gray">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <button 
              @click="$router.go(-1)"
              class="text-gray-600 hover:text-gray-900"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h1 class="text-xl font-semibold text-gray-900">Mon Profil</h1>
          </div>
          
          <router-link 
            to="/dashboard"
            class="text-gray-600 hover:text-primary transition-colors"
          >
            Tableau de bord
          </router-link>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-md">
        <!-- En-tête du profil -->
        <div class="px-6 py-8 border-b border-gray-200">
          <div class="flex items-center space-x-6">
            <div class="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-2xl">{{ getUserInitials(form.username || currentUser.username) }}</span>
            </div>
            
            <div>
              <h2 class="text-2xl font-bold text-gray-900">
                {{ form.username || currentUser.username }}
              </h2>
              <p class="text-gray-600">{{ form.email || currentUser.email }}</p>
            </div>
          </div>
        </div>

        <!-- Formulaire de modification -->
        <div class="px-6 py-8">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <Input
              id="username"
              v-model="form.username"
              label="Nom d'utilisateur"
              placeholder="Votre nom d'utilisateur"
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

            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
              
              <div class="space-y-4">
                <Input
                  id="currentPassword"
                  v-model="form.currentPassword"
                  type="password"
                  label="Mot de passe actuel"
                  placeholder="••••••••"
                />
                
                <Input
                  id="newPassword"
                  v-model="form.newPassword"
                  type="password"
                  label="Nouveau mot de passe"
                  placeholder="••••••••"
                  hint="Au moins 8 caractères avec une majuscule et un chiffre"
                />
                
                <Input
                  id="confirmNewPassword"
                  v-model="form.confirmNewPassword"
                  type="password"
                  label="Confirmer le nouveau mot de passe"
                  placeholder="••••••••"
                  :error="form.confirmNewPassword && form.newPassword !== form.confirmNewPassword ? 'Les mots de passe ne correspondent pas' : undefined"
                />
              </div>
            </div>

            <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                variant="secondary"
                @click="resetForm"
              >
                Annuler
              </Button>
              
              <Button
                type="submit"
                :disabled="isLoading"
                :loading="isLoading"
                loading-text="Enregistrement..."
              >
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import Input from '../components/ui/Input.vue'
import Button from '../components/ui/Button.vue'

const { currentUser, updateUserProfile } = useUserStore()
const isLoading = ref(false)

const form = reactive({
  username: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

const getUserInitials = (name: string) => {
  if (!name) return '?'
  
  if (name.includes('_')) {
    const parts = name.split('_')
    return parts.map(part => part.charAt(0).toUpperCase()).join('').slice(0, 2)
  }
  
  return name.slice(0, 2).toUpperCase()
}

const resetForm = () => {
  form.username = currentUser.value.username
  form.email = currentUser.value.email
  form.currentPassword = ''
  form.newPassword = ''
  form.confirmNewPassword = ''
}

const handleSubmit = async () => {
  isLoading.value = true
  
  try {
    // Simulation de la mise à jour
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const updates = {
      username: form.username,
      email: form.email
    }
    
    updateUserProfile(currentUser.value.id, updates)
    
    // Réinitialiser les champs de mot de passe
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmNewPassword = ''
    
    alert('Profil mis à jour avec succès !')
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
    alert('Erreur lors de la mise à jour du profil')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  resetForm()
})
</script>