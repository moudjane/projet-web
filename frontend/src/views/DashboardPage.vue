<template>
  <div class="h-screen bg-gray flex">
    <div class="w-1/3 bg-white border-r border-gray-200 flex flex-col">
      <UserProfile v-if="me" :current-user="me" @edit-profile="showProfileModal = true"
        @new-conversation="showUsersModal = true" @logout="logout" />

      <SearchBar v-model="searchQuery" placeholder="Rechercher une discussion" />

      <ConversationsList :conversations="filteredConversations" :selected-conversation-id="selectedConversationId"
        :current-user-id="me?.id || ''" @select-conversation="selectConversation"
        @new-conversation="showUsersModal = true" />
    </div>

    <div class="flex-1 flex flex-col">
      <div v-if="selectedConversationId" class="flex-1">
        <ConversationView :conversation-id="selectedConversationId" @back="selectedConversationId = null" />
      </div>

      <EmptyState v-else @new-conversation="showUsersModal = true" />
    </div>

    <UsersModal :show="showUsersModal" :users="filteredUsers" :search-query="userSearchQuery"
      @close="showUsersModal = false" @select-user="startConversationWithUser"
      @update:search-query="userSearchQuery = $event" />

    <ProfileModal v-if="me" :show="showProfileModal" :current-user="me" :is-loading="isUpdatingProfile"
      @close="showProfileModal = false" @submit="updateProfile" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { useAuthStore } from '@/stores/auth'
import ConversationView from '../components/ConversationView.vue'
import UserProfile from '../components/dashboard/UserProfile.vue'
import ConversationsList from '../components/dashboard/ConversationsList.vue'
import SearchBar from '../components/dashboard/SearchBar.vue'
import UsersModal from '../components/dashboard/UsersModal.vue'
import ProfileModal from '../components/dashboard/ProfileModal.vue'
import EmptyState from '../components/dashboard/EmptyState.vue'
import { GET_MY_CONVERSATIONS, GET_ALL_USERS, ME } from '../graphql/queries'
import { CREATE_CONVERSATION, UPDATE_PROFILE } from '../graphql/mutations'
import type { GetMyConversationsQuery } from '@/gql/graphql'

const router = useRouter()
const authStore = useAuthStore()

const searchQuery = ref('')
const userSearchQuery = ref('')
const selectedConversationId = ref<string | null>(null)
const showProfileModal = ref(false)
const showUsersModal = ref(false)
const isUpdatingProfile = ref(false)

const { result: conversationsResult, refetch: refetchConversations } = useQuery(GET_MY_CONVERSATIONS, null, { pollInterval: 2000 })
const { result: usersResult } = useQuery(GET_ALL_USERS)
const { result: meResult } = useQuery(ME)

const me = computed(() => meResult.value?.me)
const conversations = computed(() => conversationsResult.value?.getMyConversations || [])
const users = computed(() => usersResult.value?.getAllUsers || [])

const filteredConversations = computed(() => {
  let filtered = conversations.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(conversation =>
      getConversationName(conversation).toLowerCase().includes(query)
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

const getConversationName = (conversation: GetMyConversationsQuery['getMyConversations'][0]) => {
  const otherParticipant = conversation.users?.find(u => u.id !== me.value?.id)
  console.log('getConversationName called with conversation:', conversation, 'otherParticipant:', otherParticipant)
  return otherParticipant?.username || 'Conversation'
}

const selectConversation = (conversationId: string) => {
  selectedConversationId.value = conversationId
}

const { mutate: createConversationMutation } = useMutation(CREATE_CONVERSATION)
const startConversationWithUser = async (userId: string) => {
  const existing = conversations.value.find(conv =>
    conv.users.some(u => u.id === userId)
  )

  if (existing) {
    selectedConversationId.value = existing.id
  } else {
    const result = await createConversationMutation({
      title: '',
      targetUserId: userId
    })
    if (result?.data?.createConversation) {
      await refetchConversations()
      selectedConversationId.value = result.data.createConversation.id
    }
  }

  showUsersModal.value = false
  userSearchQuery.value = ''
}

const { mutate: updateProfileMutation } = useMutation(UPDATE_PROFILE)
const updateProfile = async (form: { username: string; email: string }) => {
  isUpdatingProfile.value = true

  try {
    await updateProfileMutation({
      updateProfileData: {
        username: form.username,
        email: form.email,
        oldPassword: 'placeholder' // remplace avec une vraie valeur
      }
    })
    showProfileModal.value = false
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
  } finally {
    isUpdatingProfile.value = false
  }
}

const logout = () => {
  authStore.clearToken()
  router.push('/login')
}
</script>
