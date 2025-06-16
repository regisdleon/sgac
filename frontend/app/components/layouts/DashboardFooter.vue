<!-- components/layout/DashboardFooter.vue -->
<template>
  <footer class="bg-gray-100 text-center py-3 text-sm text-gray-500">
    © {{ year }} Tu Empresa — Todos los derechos reservados.
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>
