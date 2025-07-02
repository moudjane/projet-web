<template>
  <div class="min-h-screen bg-gray flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <!-- header+logo -->
      <div class="text-center mb-8">
        <MessageLogo class="mx-auto mb-4" />
        <h1 class="text-3xl font-light text-gray-800 mb-2">{{ title }}</h1>
        <p class="text-gray-dark">{{ subtitle }}</p>
      </div>

      <!-- card -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <slot />
      </div>

      <!-- footer -->
      <div class="text-center mt-8 text-sm text-gray-dark">
        <p>En vous connectant, vous acceptez nos</p>
        <div class="space-x-4">
          <a href="#" class="hover:text-primary">Conditions d'utilisation</a>
          <span>•</span>
          <a href="#" class="hover:text-primary">Politique de confidentialité</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MessageLogo from '../ui/MessageLogoComponent.vue'

interface Props {
  title: string
  subtitle: string
}

defineProps<Props>()
</script>