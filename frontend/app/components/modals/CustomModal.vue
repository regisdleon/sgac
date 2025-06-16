<script setup lang="ts">
const props = defineProps<{
  isOpen : boolean
  title? : string
  description? : string
  confirmText? : string
  cancelText? : string
  loading? : boolean
  hideFooter? : boolean
  onConfirm? : () => void | Promise<void>
}>()

const emit = defineEmits<{
  close : [boolean]
}>()

async function handleConfirm() {
  if ( props.onConfirm ) {
    await props.onConfirm()
  }
  emit( 'close', true )
}

function handleCancel() {
  emit( 'close', false )
}
</script>

<template>
  <UModal @close="handleCancel" v-bind="$attrs" v-if="isOpen">
    <!-- Header -->
    <template #header>
      <slot name="header">
        <div class="text-lg font-semibold">
          {{ props.title }}
        </div>
      </slot>
    </template>

    <!-- Body -->
    <template #body>
      <slot name="body">
        <p>{{ props.description }}</p>
      </slot>
    </template>

    <!-- Footer -->
    <template #footer>
      <slot name="footer">
        <div v-if="!hideFooter" class="flex flex-row justify-end space-x-2">
          <UButton
              color="neutral"
              :label="props.cancelText || 'Cancelar'"
              @click="handleCancel"
          />
          <UButton
              color="primary"
              :label="props.confirmText || 'Confirmar'"
              :loading="props.loading"
              @click="handleConfirm"
          />
        </div>
      </slot>
    </template>
  </UModal>
</template>
