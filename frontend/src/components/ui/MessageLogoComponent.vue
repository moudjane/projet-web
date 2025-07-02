<template>
  <div :class="containerClasses">
    <svg :class="iconClasses" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const containerClasses = computed(() => {
  const baseClasses = 'bg-primary rounded-full flex items-center justify-center'
  
  switch (props.size) {
    case 'sm':
      return `${baseClasses} w-12 h-12`
    case 'md':
      return `${baseClasses} w-20 h-20`
    case 'lg':
      return `${baseClasses} w-32 h-32`
    case 'xl':
      return `${baseClasses} w-40 h-40`
    default:
      return `${baseClasses} w-20 h-20`
  }
})

const iconClasses = computed(() => {
  const baseClasses = 'text-white'
  
  switch (props.size) {
    case 'sm':
      return `${baseClasses} w-6 h-6`
    case 'md':
      return `${baseClasses} w-12 h-12`
    case 'lg':
      return `${baseClasses} w-20 h-20`
    case 'xl':
      return `${baseClasses} w-24 h-24`
    default:
      return `${baseClasses} w-12 h-12`
  }
})
</script>