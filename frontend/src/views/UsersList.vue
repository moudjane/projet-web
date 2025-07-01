<template>
  <div class="min-h-screen bg-gray">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <h1 class="text-xl font-semibold text-gray-900">Utilisateurs</h1>
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
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 bg-primary bg-opacity-10 rounded-full">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total utilisateurs</p>
              <p class="text-2xl font-semibold text-gray-900">{{ users.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Conversations actives</p>
              <p class="text-2xl font-semibold text-gray-900">{{ activeConversations }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtres -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div class="flex items-center space-x-4">
            <Input
              id="search"
              v-model="searchQuery"
              placeholder="Rechercher un utilisateur..."
              class="max-w-xs"
            />
          </div>
          
          <div class="text-sm text-gray-600">
            {{ filteredUsers.length }} utilisateur(s) trouvé(s)
          </div>
        </div>
      </div>

      <!-- Liste des utilisateurs -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Liste des utilisateurs</h2>
        </div>
        
        <div class="divide-y divide-gray-200">
          <div 
            v-for="user in filteredUsers" 
            :key="user.id"
            class="px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span class="text-white font-semibold text-sm">{{ getUserInitials(user.username) }}</span>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium text-gray-900">
                    {{ user.username }}
                  </h3>
                  <p class="text-sm text-gray-600">{{ user.email }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <button 
                  @click="startConversation(user.id)"
                  class="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                >
                  Envoyer un message
                </button>
                
                <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="filteredUsers.length === 0" class="px-6 py-12 text-center">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
            <p class="text-gray-600">Aucun utilisateur trouvé</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { useConversationStore } from '../stores/conversationStore'
import Input from '../components/ui/Input.vue'

const router = useRouter()
const { users } = useUserStore()
const { createConversation, conversations } = useConversationStore()

const searchQuery = ref('')

const filteredUsers = computed(() => {
  let filtered = users.value

  // Filtrer par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }

  return filtered
})

const activeConversations = computed(() => {
  return conversations.value.length
})

const getUserInitials = (name: string) => {
  if (!name) return '?'
  
  if (name.includes('_')) {
    const parts = name.split('_')
    return parts.map(part => part.charAt(0).toUpperCase()).join('').slice(0, 2)
  }
  
  return name.slice(0, 2).toUpperCase()
}

const startConversation = (userId: string) => {
  // Créer une nouvelle conversation ou rediriger vers une existante
  const conversation = createConversation([userId])
  router.push(`/conversation/${conversation.id}`)
}
</script>