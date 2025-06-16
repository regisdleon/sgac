<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  open : boolean
  title? : string
  description? : string
  confirmText? : string
  cancelText? : string
}>()

const emit = defineEmits<{
  ( e : 'confirm' ) : void
  ( e : 'cancel' ) : void
  ( e : 'update:open', value : boolean ) : void
}>()

const internalOpen = ref( props.open )

watch( () => props.open, ( val ) => {
  internalOpen.value = val
} )

function close() {
  internalOpen.value = false
  emit( 'update:open', false )
}

function confirm() {
  emit( 'confirm' )
  close()
}

function cancel() {
  emit( 'cancel' )
  close()
}
</script>

<template>
  <UModal v-model="internalOpen">
    <div class="p-6 space-y-4">
      <h2 class="text-lg font-semibold">{{ title || '¿Estás seguro?' }}</h2>
      <p class="text-sm text-gray-600">{{ description || 'Esta acción no se puede deshacer.' }}</p>
      <div class="flex justify-end gap-3 pt-4">
        <UButton variant="ghost" @click="cancel">
          {{ cancelText || 'Cancelar' }}
        </UButton>
        <UButton color="primary" @click="confirm">
          {{ confirmText || 'Confirmar' }}
        </UButton>
      </div>
    </div>
  </UModal>
</template>
