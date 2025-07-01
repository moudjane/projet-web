import { ref, computed } from 'vue'
import type { Conversation, Message } from '../types'
import { useUserStore } from './userStore'

// Simulation de conversations
const conversations = ref<Conversation[]>([
  {
    id: '1',
    participants: [
      {
        id: '1',
        username: 'alice_martin',
        email: 'alice.martin@email.com',
        isOnline: true,
        createdAt: new Date('2024-01-15')
      }
    ],
    lastMessage: {
      id: '1',
      conversationId: '1',
      senderId: '1',
      content: 'Salut ! Comment ça va ?',
      type: 'text',
      createdAt: new Date('2024-01-21T14:30:00'),
      isRead: false
    },
    updatedAt: new Date('2024-01-21T14:30:00'),
    createdAt: new Date('2024-01-20T10:00:00'),
    isGroup: false
  },
  {
    id: '2',
    participants: [
      {
        id: '2',
        username: 'bob_dupont',
        email: 'bob.dupont@email.com',
        isOnline: false,
        lastSeen: new Date('2024-01-20T10:30:00'),
        createdAt: new Date('2024-01-10')
      }
    ],
    lastMessage: {
      id: '2',
      conversationId: '2',
      senderId: 'current',
      content: 'À bientôt !',
      type: 'text',
      createdAt: new Date('2024-01-20T16:45:00'),
      isRead: true
    },
    updatedAt: new Date('2024-01-20T16:45:00'),
    createdAt: new Date('2024-01-19T09:15:00'),
    isGroup: false
  }
])

// Simulation de messages
const messages = ref<Message[]>([
  {
    id: '1',
    conversationId: '1',
    senderId: '1',
    content: 'Salut ! Comment ça va ?',
    type: 'text',
    createdAt: new Date('2024-01-21T14:30:00'),
    isRead: false
  },
  {
    id: '2',
    conversationId: '1',
    senderId: 'current',
    content: 'Ça va bien merci ! Et toi ?',
    type: 'text',
    createdAt: new Date('2024-01-21T14:32:00'),
    isRead: true
  },
  {
    id: '3',
    conversationId: '2',
    senderId: 'current',
    content: 'À bientôt !',
    type: 'text',
    createdAt: new Date('2024-01-20T16:45:00'),
    isRead: true
  }
])

export const useConversationStore = () => {
  const getAllConversations = computed(() => 
    conversations.value.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  )
  
  const getConversationById = (id: string) => {
    return conversations.value.find(conv => conv.id === id)
  }
  
  const getMessagesByConversationId = (conversationId: string) => {
    return messages.value
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }
  
  const createConversation = (participantIds: string[]) => {
    const { getUserById } = useUserStore()
    
    // Récupérer les participants
    const participants = participantIds
      .map(id => getUserById(id))
      .filter((user): user is NonNullable<ReturnType<typeof getUserById>> => user !== undefined)
    
    const newConversation: Conversation = {
      id: Date.now().toString(),
      participants,
      updatedAt: new Date(),
      createdAt: new Date(),
      isGroup: participantIds.length > 1
    }
    
    conversations.value.push(newConversation)
    return newConversation
  }
  
  const sendMessage = (conversationId: string, content: string, senderId: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId,
      senderId,
      content,
      type: 'text',
      createdAt: new Date(),
      isRead: false
    }
    
    messages.value.push(newMessage)
    
    // Mettre à jour la conversation
    const conversation = conversations.value.find(conv => conv.id === conversationId)
    if (conversation) {
      conversation.lastMessage = newMessage
      conversation.updatedAt = new Date()
    }
    
    return newMessage
  }

  return {
    conversations: getAllConversations,
    getConversationById,
    getMessagesByConversationId,
    createConversation,
    sendMessage
  }
}