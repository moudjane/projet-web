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
            <h1 class="text-xl font-semibold text-gray-900">Conversations</h1>
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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 bg-primary bg-opacity-10 rounded-full">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total conversations</p>
              <p class="text-2xl font-semibold text-gray-900">{{ conversations.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Messages non lus</p>
              <p class="text-2xl font-semibold text-gray-900">{{ unreadCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-full">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Actives aujourd'hui</p>
              <p class="text-2xl font-semibold text-gray-900">{{ activeToday }}</p>
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
              placeholder="Rechercher une conversation..."
              class="max-w-xs"
            />
            
            <select 
              v-model="typeFilter"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Toutes les conversations</option>
              <option value="individual">Conversations individuelles</option>
              <option value="group">Conversations de groupe</option>
            </select>
          </div>
          
          <div class="text-sm text-gray-600">
            {{ filteredConversations.length }} conversation(s) trouvée(s)
          </div>
        </div>
      </div>

      <!-- Liste des conversations -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Vos conversations</h2>
        </div>
        
        <div class="divide-y divide-gray-200">
          <div 
            v-for="conversation in filteredConversations" 
            :key="conversation.id"
            class="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
            @click="openConversation(conversation.id)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span class="text-white font-semibold text-sm">{{ getUserInitials(getConversationName(conversation)) }}</span>
                </div>
                
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <h3 class="text-sm font-medium text-gray-900">
                      {{ getConversationName(conversation) }}
                    </h3>
                    <span v-if="conversation.isGroup" class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Groupe
                    </span>
                  </div>
                  
                  <p class="text-sm text-gray-600 truncate max-w-md">
                    <span v-if="conversation.lastMessage?.senderId === 'current'" class="text-primary">
                      Vous: 
                    </span>
                    {{ conversation.lastMessage?.content || 'Aucun message' }}
                  </p>
                  
                  <p class="text-xs text-gray-500">
                    {{ formatDate(conversation.updatedAt) }}
                  </p>
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <div 
                  v-if="conversation.lastMessage && !conversation.lastMessage.isRead && conversation.lastMessage.senderId !== 'current'"
                  class="w-2 h-2 bg-primary rounded-full"
                ></div>
                
                <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="filteredConversations.length === 0" class="px-6 py-12 text-center">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <p class="text-gray-600 mb-4">Aucune conversation trouvée</p>
            <router-link 
              to="/users"
              class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
            >
              Commencer une nouvelle conversation
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConversationStore } from '../stores/conversationStore'
import { useUserStore } from '../stores/userStore'
import Input from '../components/ui/Input.vue'
import type { Conversation } from '../types'

const router = useRouter()
const { conversations } = useConversationStore()
const { users } = useUserStore()

const searchQuery = ref('')
const typeFilter = ref('all')

const filteredConversations = computed(() => {
  let filtered = conversations.value

  // Filtrer par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(conversation => 
      getConversationName(conversation).toLowerCase().includes(query) ||
      conversation.lastMessage?.content.toLowerCase().includes(query)
    )
  }

  // Filtrer par type
  if (typeFilter.value === 'individual') {
    filtered = filtered.filter(conversation => !conversation.isGroup)
  } else if (typeFilter.value === 'group') {
    filtered = filtered.filter(conversation => conversation.isGroup)
  }

  return filtered
})

const unreadCount = computed(() => {
  return conversations.value.filter(conv => 
    conv.lastMessage && 
    !conv.lastMessage.isRead && 
    conv.lastMessage.senderId !== 'current'
  ).length
})

const activeToday = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return conversations.value.filter(conv => 
    new Date(conv.updatedAt) >= today
  ).length
})

const getUserInitials = (name: string) => {
  if (!name) return '?'
  
  if (name.includes('_')) {
    const parts = name.split('_')
    return parts.map(part => part.charAt(0).toUpperCase()).join('').slice(0, 2)
  }
  
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

  if (minutes < 1) return 'À l\'instant'
  if (minutes < 60) return `${minutes}min`
  if (hours < 24) return `${hours}h`
  if (days === 1) return 'Hier'
  if (days < 7) return `${days}j`
  
  return messageDate.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short' 
  })
}

const openConversation = (conversationId: string) => {
  router.push(`/conversation/${conversationId}`)
}
</script>