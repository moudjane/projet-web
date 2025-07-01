import { ref, computed } from 'vue'
import type { User } from '../types'

// Simulation d'une base de données d'utilisateurs
const users = ref<User[]>([
  {
    id: '1',
    username: 'alice_martin',
    email: 'alice.martin@email.com',
    isOnline: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    username: 'bob_dupont',
    email: 'bob.dupont@email.com',
    isOnline: false,
    lastSeen: new Date('2024-01-20T10:30:00'),
    createdAt: new Date('2024-01-10')
  },
  {
    id: '3',
    username: 'claire_bernard',
    email: 'claire.bernard@email.com',
    isOnline: true,
    createdAt: new Date('2024-01-12')
  },
  {
    id: '4',
    username: 'david_moreau',
    email: 'david.moreau@email.com',
    isOnline: false,
    lastSeen: new Date('2024-01-19T15:45:00'),
    createdAt: new Date('2024-01-08')
  }
])

const currentUser = ref<User>({
  id: 'current',
  username: 'mon_username',
  email: 'user@email.com',
  isOnline: true,
  createdAt: new Date()
})

export const useUserStore = () => {
  const getAllUsers = computed(() => users.value)
  const getOnlineUsers = computed(() => users.value.filter(user => user.isOnline))
  
  const getUserById = (id: string) => {
    return users.value.find(user => user.id === id)
  }
  
  const addUser = (user: Partial<User>) => {
    const newUser: User = {
      id: Date.now().toString(),
      username: user.username || '',
      email: user.email || '',
      isOnline: false,
      createdAt: new Date(),
      ...user
    }
    users.value.push(newUser)
    return newUser
  }
  
  const updateUserProfile = (userId: string, updates: Partial<User>) => {
    const userIndex = users.value.findIndex(user => user.id === userId)
    if (userIndex !== -1) {
      users.value[userIndex] = { ...users.value[userIndex], ...updates }
    }
    
    // Mettre à jour aussi currentUser si c'est lui
    if (userId === currentUser.value.id) {
      currentUser.value = { ...currentUser.value, ...updates }
    }
  }

  return {
    users: getAllUsers,
    onlineUsers: getOnlineUsers,
    currentUser: computed(() => currentUser.value),
    getUserById,
    addUser,
    updateUserProfile
  }
}