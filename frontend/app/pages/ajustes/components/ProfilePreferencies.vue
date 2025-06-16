<script setup lang="ts">
const props = defineProps<{
  form : {
    newsletter : boolean
  }
}>()

const emit = defineEmits( ['save'] )

function save() {
  emit( 'save' )
}
</script>

<template>
  <div class="space-y-2">

  <h3 class="text-lg font-medium text-gray-700 text-center">Preferencias</h3>

    <UFormField name="newsletter">
      <UCheckbox v-model="form.newsletter" label="Deseo recibir novedades por correo"/>
    </UFormField>

    <div class="flex justify-end pt-2">
      <UButton @click="save" color="primary">Guardar preferencias</UButton>
    </div>
  </div>
</template>
