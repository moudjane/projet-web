<template>
  <div class="h-screen bg-chat-bg flex items-center justify-center">
    <div class="text-center">
     <span>chat à ajouter ici après</span>
      
      <Button
        variant="secondary"
        class="max-w-xs"
        @click="logout"
      >
        Se déconnecter
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '../components/ui/Button.vue'

const router = useRouter()

const logout = () => {
  router.push('/login')
}
</script>