<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :class="inputClasses"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="hint" class="text-xs text-gray-500 mt-1">
      {{ hint }}
    </p>
    <p v-if="error" class="text-xs text-red-500 mt-1">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id: string
  label?: string
  type?: string
  modelValue: string
  placeholder?: string
  required?: boolean
  hint?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputClasses = computed(() => {
  const baseClasses =
    'w-full px-4 py-3 border rounded-lg bg-gray-100 text-gray-900 placeholder-gray-400 ' +
    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200'

  if (props.error) {
    return `${baseClasses} border-red-500`
  }
  return `${baseClasses} border-gray-300`
})
</script>
