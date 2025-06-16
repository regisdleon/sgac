<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from "#ui/types";
import type { Event } from "~/models/Event";
import { useEventStore } from '~/stores/event'
import { useRoute } from 'vue-router'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const router = useRouter()
const eventsStore = useEventStore()
const route = useRoute()

const schema = z.object({
  id: z.string().optional(),
  anno: z.coerce.number().min(1900, 'Año inválido').max(2100, 'Año inválido'),
  titulo: z.string().min(1, 'Título requerido'),
  titulo_corto: z.string().min(1, 'Título corto requerido'),
  clasificacion: z.enum(eventsStore.classifications.map(c => c.id) as [string, ...string[]], { required_error: 'Clasificación requerida' }),
});

type SchemaType = z.infer<typeof schema>;

const state = reactive<SchemaType>({
  id: undefined,
  anno: new Date().getFullYear(),
  titulo: '',
  titulo_corto: '',
  clasificacion: 'INTERNACIONAL',
});

onMounted(async () => {
  const eventId = route.params.id as string
  if (eventId) {
    await eventsStore.fetchEventById(eventId)
  }
})

watchEffect(() => {
  if (eventsStore.currentEvent) {
    state.id = eventsStore.currentEvent.id
    state.anno = eventsStore.currentEvent.anno
    state.titulo = eventsStore.currentEvent.titulo
    state.titulo_corto = eventsStore.currentEvent.titulo_corto
    state.clasificacion = eventsStore.currentEvent.clasificacion
  }
})

async function onSubmit(event: FormSubmitEvent<SchemaType>) {
  console.debug("event", event);
  const result = await eventsStore.updateEvent(event.data)

  if (result) {
    toast.add({
      title: `Evento actualizado`,
      color: 'success'
    })
    router.push('/eventos')
  } else {
    toast.add({
      title: eventsStore.error || 'Error al actualizar el evento',
      color: 'error',
    })
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit" class="flex justify-center w-full">
    <UCard class="w-full max-w-2xl">
      <template #header>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          Actualizar evento
        </h2>
      </template>

      <div class="flex flex-col space-y-4">
        <UFormField label="Título" name="titulo" required>
          <UInput v-model="state.titulo" class="w-full" />
        </UFormField>

        <UFormField label="Título corto" name="titulo_corto" required>
          <UInput v-model="state.titulo_corto" class="w-full" />
        </UFormField>

        <UFormField label="Año" name="anno" required>
          <UInput v-model="state.anno" type="number" class="w-full" />
        </UFormField>

        <UFormField label="Clasificación" name="clasificacion" required>
          <USelect
            v-model="state.clasificacion"
            :options="eventsStore.classifications"
            option-attribute="name"
            value-attribute="id"
            class="w-full"
          />
        </UFormField>
      </div>

      <template #footer>
        <div class="flex justify-between flex-row">
          <UButton size="lg" type="button" color="neutral" label="Cancelar" @click="router.back()" />
          <UButton size="lg" type="submit" color="primary" label="Actualizar" :loading="eventsStore.isLoading" />
        </div>
      </template>
    </UCard>
  </UForm>
</template>
