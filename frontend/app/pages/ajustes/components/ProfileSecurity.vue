<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

function changePassword() {
  if (form.value.newPassword !== form.value.confirmPassword) {
    alert('Las contraseñas no coinciden')
    return
  }

  alert('Contraseña actualizada')
}
</script>

<template>
  <div class="space-y-2">
  <h2 class="text-xl font-semibold text-center text-gray-800">Seguridad</h2>
    <form @submit.prevent="changePassword" class="space-y-4 max-w-md mx-auto">
      <UFormField label="Contraseña actual" name="currentPassword">
        <UInput v-model="form.currentPassword" type="password" class="w-full" />
      </UFormField>

      <UFormField label="Nueva contraseña" name="newPassword">
        <UInput v-model="form.newPassword" type="password" class="w-full" />
      </UFormField>

      <UFormField label="Confirmar nueva contraseña" name="confirmPassword">
        <UInput v-model="form.confirmPassword" type="password" class="w-full" />
      </UFormField>

      <div class="flex justify-center">
        <UButton type="submit" color="primary">Actualizar contraseña</UButton>
      </div>
    </form>
  </div>
</template>
