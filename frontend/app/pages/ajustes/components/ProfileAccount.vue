<script setup lang="ts">
import { defineProps, ref, watch } from 'vue'

const props = defineProps<{
  form : {
    username : string
    email : string
    avatarUrl : string // Url de la imagen
  }
}>()

const emit = defineEmits( ['save', 'update:avatarUrl'] )

const fileInput = ref<HTMLInputElement | null>( null )
const preview = ref( props.form.avatarUrl || 'https://i.pravatar.cc/600?img=3' )

function onFileChange( event : Event ) {
  const target = event.target as HTMLInputElement
  if ( target.files && target.files[ 0 ] ) {
    const file = target.files[ 0 ]
    preview.value = URL.createObjectURL( file )
    emit( 'update:avatarUrl', preview.value )
  }
}

function openFileDialog() {
  fileInput.value?.click()
}

function removeImage() {
  preview.value = 'https://i.pravatar.cc/600?img=3'
  emit( 'update:avatarUrl', '' )
}

function save() {
  emit( 'save' )
}

watch( () => props.form.avatarUrl, ( newVal ) => {
  preview.value = newVal || 'https://i.pravatar.cc/600?img=3'
} )
</script>

<template>
  <div class="space-y-2">
    <h3 class="text-lg font-medium text-gray-700 text-center">Cuenta de usuario</h3>

    <div class="relative w-full max-w-md mx-auto  select-none">
      <img
          :src="preview"
          alt="Foto de perfil"
          class="w-full h-64 object-cover rounded-lg shadow"
      />

      <!-- Icono para cambiar -->
      <button
          @click.prevent="openFileDialog"
          class="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow hover:bg-gray-100 cursor-pointer"
          title="Cambiar foto"
          type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24"
             stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.232 5.232l3.536 3.536M9 11l3 3m6 6H6a2 2 0 01-2-2V7a2 2 0 012-2h3m4 0h3a2 2 0 012 2v3"/>
        </svg>
      </button>

      <input
          type="file"
          accept="image/*"
          class="hidden"
          ref="fileInput"
          @change="onFileChange"
      />
    </div>

    <UFormField label="Nombre de usuario" name="username">
      <UInput v-model="form.username" class="w-full"/>
    </UFormField>

    <UFormField label="Correo electrónico" name="email">
      <UInput v-model="form.email" type="email" class="w-full"/>
    </UFormField>

    <div class="flex justify-end pt-2">
      <UButton @click="save" color="primary">Guardar cuenta</UButton>
    </div>
  </div>
</template>
