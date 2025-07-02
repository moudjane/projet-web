<template>
  <div class="h-screen bg-gray flex">
    <!-- Sidebar des conversations -->
    <div class="w-1/3 bg-white border-r border-gray-200 flex flex-col">
      <!-- Profil utilisateur -->
      <UserProfile 
        :current-user="currentUser"
        @edit-profile="showProfileModal = true"
        @new-conversation="showUsersModal = true"
        @logout="logout"
      />

      <!-- Barre de recherche -->
      <SearchBar 
        v-model="searchQuery"
        placeholder="Rechercher une discussion"
      />

      <!-- Liste des conversations -->
      <ConversationsList 
        :conversations="filteredConversations"
        :selected-conversation-id="selectedConversationId"
        @select-conversation="selectConversation"
        @new-conversation="showUsersModal = true"
      />
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
      <EmptyState 
        v-else
        @new-conversation="showUsersModal = true"
      />
    </div>

    <!-- Modal des utilisateurs -->
    <UsersModal 
      :show="showUsersModal"
      :users="filteredUsers"
      :search-query="userSearchQuery"
      @close="showUsersModal = false"
      @select-user="startConversationWithUser"
      @update:search-query="userSearchQuery = $event"
    />

    <!-- Modal de profil -->
    <ProfileModal 
      :show="showProfileModal"
      :current-user="currentUser"
      :is-loading="isUpdatingProfile"
      @close="showProfileModal = false"
      @submit="updateProfile"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConversationStore } from '../stores/conversationStore'
import { useUserStore } from '../stores/userStore'
import ConversationView from '../components/ConversationView.vue'
import UserProfile from '../components/dashboard/UserProfile.vue'
import ConversationsList from '../components/dashboard/ConversationsList.vue'
import SearchBar from '../components/dashboard/SearchBar.vue'
import UsersModal from '../components/dashboard/UsersModal.vue'
import ProfileModal from '../components/dashboard/ProfileModal.vue'
import EmptyState from '../components/dashboard/EmptyState.vue'

const router = useRouter()
const { conversations, createConversation } = useConversationStore()
const { currentUser, users, updateUserProfile } = useUserStore()

const searchQuery = ref('')
const userSearchQuery = ref('')
const selectedConversationId = ref<string | null>(null)
const showProfileModal = ref(false)
const showUsersModal = ref(false)
const isUpdatingProfile = ref(false)

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

const filteredUsers = computed(() => {
  let filtered = users.value

  if (userSearchQuery.value) {
    const query = userSearchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }

  return filtered
})

interface Conversation {
  id: string
  isGroup: boolean
  name?: string
  participants: Array<{ id: string; username: string }>
  lastMessage?: { content: string }
}

const getConversationName = (conversation: Conversation) => {
  if (conversation.isGroup && conversation.name) {
    return conversation.name
  }
  
  const participant = conversation.participants[0]
  return participant ? participant.username : 'Conversation'
}

const selectConversation = (conversationId: string) => {
  selectedConversationId.value = conversationId
}

const startConversationWithUser = (userId: string) => {
  // Vérifier si une conversation existe déjà avec cet utilisateur
  const existingConversation = conversations.value.find(conv => 
    !conv.isGroup && conv.participants.some(p => p.id === userId)
  )
  
  if (existingConversation) {
    selectedConversationId.value = existingConversation.id
  } else {
    // Créer une nouvelle conversation
    const newConversation = createConversation([userId])
    selectedConversationId.value = newConversation.id
  }
  
  showUsersModal.value = false
  userSearchQuery.value = ''
}

const updateProfile = async (form: { username: string; email: string }) => {
  isUpdatingProfile.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    updateUserProfile(currentUser.value.id, form)
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
</script>