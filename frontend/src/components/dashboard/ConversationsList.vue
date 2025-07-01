<template>
  <div class="flex-1 overflow-y-auto">
    <div 
      v-for="conversation in conversations" 
      :key="conversation.id"
      :class="[
        'flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100',
        selectedConversationId === conversation.id ? 'bg-gray-100' : ''
      ]"
      @click="$emit('select-conversation', conversation.id)"
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
    
    <div v-if="conversations.length === 0" class="px-4 py-8 text-center">
      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
      <p class="text-gray-600 mb-4 text-sm">Aucune conversation trouvée</p>
      <button 
        @click="$emit('new-conversation')"
        class="text-primary hover:text-secondary text-sm font-medium"
      >
        Commencer une nouvelle conversation
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Conversation } from '../../types'

interface Props {
  conversations: Conversation[]
  selectedConversationId: string | null
}

defineProps<Props>()

defineEmits<{
  'select-conversation': [id: string]
  'new-conversation': []
}>()

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
</script>