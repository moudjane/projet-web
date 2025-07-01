<template>
  <div class="h-screen bg-gray flex">
    <!-- Sidebar des conversations -->
    <div class="w-1/3 bg-white border-r border-gray-200 flex flex-col">
      <!-- Profil utilisateur -->
      <div class="bg-gray-100 px-4 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center cursor-pointer" @click="showProfileModal = true">
              <span class="text-white font-semibold text-lg">{{ getUserInitials(currentUser.username) }}</span>
            </div>
            <div class="flex-1">
              <h2 class="text-sm font-semibold text-gray-900">
                {{ currentUser.username }}
              </h2>
              <p class="text-xs text-gray-600">{{ currentUser.email }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-1">
            <button 
              @click="showProfileModal = true"
              class="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-200"
              title="Modifier le profil"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button 
              @click="logout"
              class="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-200"
              title="Se déconnecter"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Titre Discussions -->
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900">Discussions</h3>
        </div>
      </div>

      <!-- Barre de recherche -->
      <div class="px-4 py-3 border-b border-gray-200">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher une discussion"
            class="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
      </div>

      <!-- Liste des conversations -->
      <div class="flex-1 overflow-y-auto">
        <div 
          v-for="conversation in filteredConversations" 
          :key="conversation.id"
          :class="[
            'flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100',
            selectedConversationId === conversation.id ? 'bg-gray-100' : ''
          ]"
          @click="selectConversation(conversation.id)"
        >
          <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3">
            <span class="text-white font-semibold text-sm">{{ getUserInitials(getConversationName(conversation)) }}</span>
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h3 class="text-sm font-medium text-gray-900 truncate">
                {{ getConversationName(conversation) }}
              </h3>
              <span class="text-xs text-gray-500">
                {{ formatDate(conversation.updatedAt) }}
              </span>
            </div>
            
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-600 truncate">
                <span v-if="conversation.lastMessage?.senderId === 'current'" class="text-gray-500">
                  Vous: 
                </span>
                {{ conversation.lastMessage?.content || 'Aucun message' }}
              </p>
            </div>
          </div>
        </div>
        
        <div v-if="filteredConversations.length === 0" class="px-4 py-8 text-center">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          <p class="text-gray-600 mb-4 text-sm">Aucune conversation trouvée</p>
        </div>
      </div>
    </div>

    <!-- Zone principale -->
    <div class="flex-1 flex flex-col">
      <!-- Conversation sélectionnée -->
      <div v-if="selectedConversationId" class="flex-1">
        <ConversationView 
          :conversation-id="selectedConversationId" 
          @back="selectedConversationId = null"
        />
      </div>
      
      <!-- État par défaut -->
      <div v-else class="flex-1 flex items-center justify-center bg-chat-bg">
        <div class="text-center">
          <p class="text-gray-500 max-w-md">
            Sélectionnez une conversation pour commencer à discuter.
          </p>
        </div>
      </div>
    </div>

    <!-- Modal de profil -->
    <div v-if="showProfileModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Mon Profil</h3>
            <button 
              @click="showProfileModal = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="px-6 py-6">
          <form @submit.prevent="updateProfile" class="space-y-4">
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
                @click="showProfileModal = false"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                :loading="isUpdatingProfile"
                loading-text="Enregistrement..."
              >
                Enregistrer
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useConversationStore } from '../stores/conversationStore'
import { useUserStore } from '../stores/userStore'
import ConversationView from '../components/ConversationView.vue'
import Input from '../components/ui/Input.vue'
import Button from '../components/ui/Button.vue'
import type { Conversation } from '../types'

const router = useRouter()
const { conversations } = useConversationStore()
const { currentUser, updateUserProfile } = useUserStore()

const searchQuery = ref('')
const selectedConversationId = ref<string | null>(null)
const showProfileModal = ref(false)
const isUpdatingProfile = ref(false)

const profileForm = reactive({
  username: '',
  email: ''
})

const filteredConversations = computed(() => {
  let filtered = conversations.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(conversation => 
      getConversationName(conversation).toLowerCase().includes(query) ||
      conversation.lastMessage?.content.toLowerCase().includes(query)
    )
  }

  return filtered
})

const getUserInitials = (name: string) => {
  if (!name) return '?'
  
  // Si c'est un username avec underscore, prendre les premières lettres de chaque partie
  if (name.includes('_')) {
    const parts = name.split('_')
    return parts.map(part => part.charAt(0).toUpperCase()).join('').slice(0, 2)
  }
  
  // Sinon prendre les 2 premières lettres
  return name.slice(0, 2).toUpperCase()
}

const getConversationName = (conversation: Conversation) => {
  if (conversation.isGroup && conversation.name) {
    return conversation.name
  }
  
  const participant = conversation.participants[0]
  return participant ? participant.username : 'Conversation'
}

const formatDate = (date: Date) => {
  const now = new Date()
  const messageDate = new Date(date)
  const diff = now.getTime() - messageDate.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'maintenant'
  if (minutes < 60) return `${minutes}min`
  if (hours < 24) return `${hours}h`
  if (days === 1) return 'hier'
  if (days < 7) return `${days}j`
  
  return messageDate.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short' 
  })
}

const selectConversation = (conversationId: string) => {
  selectedConversationId.value = conversationId
}

const updateProfile = async () => {
  isUpdatingProfile.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const updates = {
      username: profileForm.username,
      email: profileForm.email
    }
    
    updateUserProfile(currentUser.value.id, updates)
    showProfileModal.value = false
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
  } finally {
    isUpdatingProfile.value = false
  }
}

const logout = () => {
  router.push('/login')
}

// Réinitialiser le formulaire quand on ouvre le modal
watch(showProfileModal, (isOpen) => {
  if (isOpen) {
    profileForm.username = currentUser.value.username
    profileForm.email = currentUser.value.email
  }
})
</script>