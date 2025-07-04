<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="$emit('click')"
  >
    <span v-if="loading" class="flex items-center justify-center">
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {{ loadingText }}
    </span>
    <span v-else>
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  loadingText?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
  loading: false,
  loadingText: 'Chargement...'
})

defineEmits<{
  click: []
}>()

const buttonClasses = computed(() => {
  const baseClasses = 'w-full font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  if (props.variant === 'secondary') {
    return `${baseClasses} bg-transparent hover:bg-gray-50 text-primary border border-primary`
  }
  
  return `${baseClasses} bg-primary hover:bg-secondary text-white`
})
</script>