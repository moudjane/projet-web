<template>
  <div class="h-screen bg-gray flex flex-col">
    <!-- Header simplifié -->
    <header class="bg-white shadow-sm border-b flex-shrink-0">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex items-center h-16 space-x-4">
          <button 
            @click="$router.go(-1)"
            class="text-gray-600 hover:text-gray-900"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div v-if="conversation" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span class="text-white font-semibold text-sm">{{ getUserInitials(conversation.title) }}</span>
            </div>
            
            <div>
              <h1 class="text-lg font-semibold text-gray-900">
                {{ conversation.title }}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Zone des messages -->
    <div class="flex-1 overflow-hidden bg-chat-bg">
      <div 
        ref="messagesContainer"
        class="h-full overflow-y-auto px-4 py-6 space-y-4"
      >
        <div v-if="messages.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p class="text-gray-600 text-lg">Aucun message pour le moment</p>
          <p class="text-gray-500">Commencez la conversation !</p>
        </div>

        <div 
          v-for="message in messages" 
          :key="message.id"
          :class="[
            'flex',
            message.user.id === currentUserId ? 'justify-end' : 'justify-start'
          ]"
        >
          <div 
            :class="[
              'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
              message.user.id === currentUserId 
                ? 'bg-message-sent text-gray-900' 
                : 'bg-message-received text-gray-900'
            ]"
          >
            <p class="text-sm">{{ message.content }}</p>
            <p class="text-xs text-gray-500 mt-1">
              {{ formatMessageTime(message.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Zone de saisie sans bouton -->
    <div class="bg-white border-t px-4 py-4 flex-shrink-0">
      <form @submit.prevent="handleSendMessage">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Tapez votre message et appuyez sur Entrée..."
          class="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          @keydown.enter.prevent="handleSendMessage"
        />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { GET_CONVERSATION_BY_ID, GET_MESSAGES_BY_CONVERSATION, ME } from '../graphql/queries'
import { SEND_MESSAGE } from '../graphql/mutations'

const route = useRoute()
const conversationId = computed(() => route.params.id as string)

const { result: meResult } = useQuery(ME)
const currentUserId = ref('')
watch(meResult, () => {
  if (meResult.value?.me.id) currentUserId.value = meResult.value.me.id
})

const { result: conversationsResult } = useQuery(GET_CONVERSATION_BY_ID)
const conversation = computed(() => {
  return conversationsResult.value?.getMyConversations.find(c => c.id === conversationId.value)
})

const { result: messagesResult, refetch: refetchMessages } = useQuery(GET_MESSAGES_BY_CONVERSATION, () => ({
  conversationId: conversationId.value
}))
const messages = computed(() => messagesResult.value?.getMessagesByConversation ?? [])

const newMessage = ref('')
const messagesContainer = ref<HTMLElement>()

const getUserInitials = (name: string) => {
  if (!name) return '?'
  if (name.includes('_')) {
    return name.split('_').map(part => part.charAt(0).toUpperCase()).join('').slice(0, 2)
  }
  return name.slice(0, 2).toUpperCase()
}

const formatMessageTime = (date: string) => {
  const messageDate = new Date(date)
  const now = new Date()
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return `Hier ${messageDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
  }
  return messageDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const { mutate: sendMessage } = useMutation(SEND_MESSAGE)
const handleSendMessage = async () => {
  if (!newMessage.value.trim() || !conversationId.value) return

  try {
    await sendMessage({
      content: newMessage.value.trim(),
      conversationId: conversationId.value
    })
    newMessage.value = ''
    await refetchMessages()
    scrollToBottom()
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message', error)
  }
}

watch(messages, scrollToBottom, { deep: true })
onMounted(scrollToBottom)
</script>
