<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEventStore } from '~/stores/event'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from "#ui/types";
import type { Event } from "~/models/Event";

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const router = useRouter()
const eventsStore = useEventStore()
const toast = useToast()

// Define the schema for form validation
const schema = z.object({
  anno: z.number().min(2000, 'El año debe ser mayor a 2000'),
  titulo: z.string().min(1, 'El título es requerido'),
  titulo_corto: z.string().min(1, 'El título corto es requerido'),
  clasificacion: z.enum(['INTERNACIONAL', 'NACIONAL', 'PROVINCIAL', 'MUNICIPAL', 'DE_BASE'], {
    required_error: 'La clasificación es requerida'
  })
})

type SchemaType = z.infer<typeof schema>

// Initialize form state
const state = reactive<SchemaType>({
  anno: 0,
  titulo: '',
  titulo_corto: '',
  clasificacion: 'NACIONAL'
})

const clasificacionesOptions = [
  { label: 'Internacional', value: 'INTERNACIONAL' },
  { label: 'Nacional', value: 'NACIONAL' },
  { label: 'Provincial', value: 'PROVINCIAL' },
  { label: 'Municipal', value: 'MUNICIPAL' },
  { label: 'De Base', value: 'DE_BASE' }
]

onMounted(async () => {
  console.log('DEBUG: Component mounted')
  const eventId = route.params.id as string
  if (eventId) {
    try {
      const event = await eventsStore.fetchEventById(eventId)
      if (event) {
        state.anno = event.anno
        state.titulo = event.titulo
        state.titulo_corto = event.titulo_corto
        state.clasificacion = event.clasificacion
      }
    } catch (error) {
      console.error('Error fetching event:', error)
      toast.add({
        title: 'Error al cargar el evento',
        color: 'error',
        icon: 'i-heroicons-exclamation-circle'
      })
    }
  }
})

async function onSubmit(event: FormSubmitEvent<SchemaType>) {
  console.log('Form submitted with data:', event.data)
  
  if (!eventsStore.currentEvent?.id) {
    toast.add({
      title: 'Error: No se encontró el evento a actualizar.',
      color: 'error',
      icon: 'i-heroicons-exclamation-circle-20-solid'
    })
    return
  }

  try {
    const result = await eventsStore.updateEvent({
      id: eventsStore.currentEvent.id,
      ...event.data
    })

    if (result) {
      toast.add({
        title: 'Evento actualizado correctamente',
        color: 'success',
        icon: 'i-heroicons-check-circle-20-solid'
      })
      router.back()
    } else {
      toast.add({
        title: eventsStore.error || 'Error al actualizar el evento',
        color: 'error',
        icon: 'i-heroicons-exclamation-circle-20-solid'
      })
    }
  } catch (error) {
    console.error('Error updating event:', error)
    toast.add({
      title: 'Error al actualizar el evento',
      color: 'error',
      icon: 'i-heroicons-exclamation-circle-20-solid'
    })
  }
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    @submit="onSubmit"
    class="flex justify-center w-full"
  >
    <UCard class="w-full max-w-2xl">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            Actualizar evento
          </h2>
          <UButton
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            @click="router.back()"
          />
        </div>
      </template>

      <div class="flex flex-col space-y-4">
        <UFormField label="Año" name="anno" required>
          <UInput
            v-model="state.anno"
            type="number"
            class="w-full"
            placeholder="Ej: 2024"
          />
        </UFormField>

        <UFormField label="Título" name="titulo" required>
          <UInput
            v-model="state.titulo"
            class="w-full"
            placeholder="Ej: Congreso Internacional de Ciencias"
          />
        </UFormField>

        <UFormField label="Título Corto" name="titulo_corto" required>
          <UInput
            v-model="state.titulo_corto"
            class="w-full"
            placeholder="Ej: CIC 2024"
          />
        </UFormField>

        <UFormField label="Clasificación" name="clasificacion" required>
          <USelect
            v-model="state.clasificacion"
            :items="clasificacionesOptions"
            placeholder="Seleccione la clasificación"
            class="w-full"
          />
        </UFormField>
      </div>

      <template #footer>
        <div class="flex justify-between">
          <UButton
            type="button"
            color="neutral"
            label="Cancelar"
            @click="router.back()"
          />
          <UButton
            type="submit"
            color="primary"
            label="Actualizar evento"
            :loading="eventsStore.isLoading"
          />
        </div>
      </template>
    </UCard>
  </UForm>
</template>
