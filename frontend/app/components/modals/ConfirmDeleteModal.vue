<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

const props = defineProps<{
  open : boolean
  item : string
}>()

const emit = defineEmits<{
  ( e : 'update:open', value : boolean ) : void
  ( e : 'deleted' ) : void
}>()

function cancel() {
  emit( 'update:open', false )
}

function confirmDelete() {
  emit( 'deleted' )
  emit( 'update:open', false )
}
</script>

<template>
  <UModal
      :dismissible="false"
      :open="open"
      title="Confirmar eliminación"
      @update:open="emit('update:open', $event)"
      :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full'
    }"
  >
    <template #body>
      ¿Estás seguro de que deseas eliminar
      <strong>{{ item }}</strong>?
    </template>

    <template #footer>
      <div class="flex justify-between flex-row w-full gap-2 pt-2">
        <UButton label="Cancelar" variant="ghost" @click="cancel"/>
        <UButton label="Sí, eliminar" color="error" @click="confirmDelete"/>
      </div>
    </template>
  </UModal>
</template>
