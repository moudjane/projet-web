<template>
  <div class="bg-gray-100 px-4 py-4 border-b border-gray-200">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div 
          class="w-12 h-12 bg-primary rounded-full flex items-center justify-center cursor-pointer" 
          @click="$emit('edit-profile')"
        >
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
          @click="$emit('new-conversation')"
          class="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-200"
          title="Nouvelle conversation"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </button>
        <button 
          @click="$emit('edit-profile')"
          class="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-200"
          title="Modifier le profil"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </button>
        <button 
          @click="$emit('logout')"
          class="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-200"
          title="Se déconnecter"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="text-center">
      <h3 class="text-lg font-semibold text-gray-900">Discussions</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '../../types'

interface Props {
  currentUser: User
}

defineProps<Props>()

defineEmits<{
  'edit-profile': []
  'new-conversation': []
  'logout': []
}>()

const getUserInitials = (name: string) => {
  if (!name) return '?'
  
  if (name.includes('_')) {
    const parts = name.split('_')
    return parts.map(part => part.charAt(0).toUpperCase()).join('').slice(0, 2)
  }
  
  return name.slice(0, 2).toUpperCase()
}
</script>