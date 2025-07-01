export interface User {
  id: string
  username: string
  email: string
  isOnline: boolean
  lastSeen?: Date
  createdAt: Date
}

export interface Conversation {
  id: string
  participants: User[]
  lastMessage?: Message
  updatedAt: Date
  createdAt: Date
  isGroup: boolean
  name?: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  type: 'text' | 'image' | 'file'
  createdAt: Date
  isRead: boolean
}