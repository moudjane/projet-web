<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] flex flex-col">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Nouvelle conversation</h3>
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
      
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            :value="searchQuery"
            @input="$emit('update:search-query', ($event.target as HTMLInputElement).value)"
            type="text"
            placeholder="Rechercher un utilisateur..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto">
        <div class="divide-y divide-gray-200">
          <div 
            v-for="user in users" 
            :key="user.id"
            class="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
            @click="$emit('select-user', user.id)"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span class="text-white font-semibold text-sm">{{ getUserInitials(user.username) }}</span>
              </div>
              
              <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-900">{{ user.username }}</h4>
                <p class="text-xs text-gray-600">{{ user.email }}</p>
              </div>
            </div>
          </div>
          
          <div v-if="users.length === 0" class="px-6 py-8 text-center">
            <p class="text-gray-600">Aucun utilisateur trouvé</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GetAllUsersQuery } from '../../gql/graphql'

interface Props {
  show: boolean
  users: GetAllUsersQuery['getAllUsers']
  searchQuery: string
}

defineProps<Props>()

defineEmits<{
  'close': []
  'select-user': [userId: string]
  'update:search-query': [value: string]
}>()

const getUserInitials = (name: string) => {
  if (!name) return '?'
  if (name.includes('_')) {
    return name.split('_').map(part => part.charAt(0).toUpperCase()).join('').slice(0, 2)
  }
  return name.slice(0, 2).toUpperCase()
}
</script>
