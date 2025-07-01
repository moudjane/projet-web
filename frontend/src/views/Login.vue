<template>
  <AuthLayout
    title="AppMessagerie"
    subtitle="Connectez-vous pour commencer à discuter"
  >
    <LoginForm />
  </AuthLayout>
</template>

<script setup lang="ts">
import AuthLayout from '../components/layout/AuthLayout.vue'
import LoginForm from '../components/forms/LoginForm.vue'
</script>