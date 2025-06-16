<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
    <h1 class="text-6xl font-bold mb-4">404</h1>
    <p class="text-xl mb-6">Página no encontrada</p>
    <RouterLink to="/auth/login"
      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition">
      Volver al inicio de sesión
    </RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>
