<template>
  <AuthLayout
    title="Créer un compte"
    subtitle="Rejoignez AppMessagerie pour rester connecté"
  >
    <RegisterForm />
  </AuthLayout>
</template>

<script setup lang="ts">
import AuthLayout from '../components/layout/AuthLayout.vue'
import RegisterForm from '../components/forms/RegisterForm.vue'
</script>