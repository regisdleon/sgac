<script setup lang="ts">
const props = defineProps<{
  form: {
    name: string
    phone: string
    bio: string
  }
}>()

const emit = defineEmits(['save'])

function save() {
  emit('save')
}
</script>

<template>
  <div class="space-y-2">
    <h3 class="text-lg font-medium text-gray-700 text-center">Información personal</h3>

    <UFormField label="Nombre completo" name="name">
      <UInput v-model="form.name" class="w-full" />
    </UFormField>

    <UFormField label="Teléfono" name="phone">
      <UInput v-model="form.phone" type="tel" class="w-full" />
    </UFormField>

    <UFormField label="Biografía" name="bio">
      <UTextarea v-model="form.bio" class="w-full" placeholder="Cuéntanos algo sobre ti..." />
    </UFormField>

    <div class="flex justify-end pt-2">
      <UButton @click="save" color="primary">Guardar información</UButton>
    </div>
  </div>
</template>
