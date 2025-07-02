<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Mon Profil</h3>
          <button 
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div class="px-6 py-6">
        <form @submit.prevent="$emit('submit', profileForm)" class="space-y-4">
          <div class="text-center mb-6">
            <div class="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto">
              <span class="text-white font-bold text-2xl">{{ getUserInitials(profileForm.username || currentUser.username) }}</span>
            </div>
          </div>

          <Input
            id="username"
            v-model="profileForm.username"
            label="Nom d'utilisateur"
            required
          />

          <Input
            id="email"
            v-model="profileForm.email"
            type="email"
            label="Email"
            required
          />

          <div class="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              @click="$emit('close')"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              :loading="isLoading"
              loading-text="Enregistrement..."
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import Input from '../ui/InputComponent .vue'
import Button from '../ui/ButtonComponent.vue'
import type { MeQuery } from '../../gql/graphql'

interface Props {
  show: boolean
  currentUser: NonNullable<MeQuery['me']>
  isLoading: boolean
}

const props = defineProps<Props>()

defineEmits<{
  'close': []
  'submit': [form: { username: string; email: string }]
}>()

const profileForm = reactive({
  username: '',
  email: ''
})

const getUserInitials = (name: string) => {
  if (!name) return '?'
  if (name.includes('_')) {
    return name.split('_').map(part => part.charAt(0).toUpperCase()).join('').slice(0, 2)
  }
  return name.slice(0, 2).toUpperCase()
}

// Réinitialiser le formulaire quand on ouvre le modal
watch(() => props.show, (isOpen) => {
  if (isOpen) {
    profileForm.username = props.currentUser.username
    profileForm.email = props.currentUser.email
  }
})
</script>
