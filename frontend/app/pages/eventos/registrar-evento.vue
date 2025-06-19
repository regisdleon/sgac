<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from "#ui/types";
import { useEventStore } from '~/pages/eventos/store'
import { computed, reactive, onMounted } from 'vue'
import { useProfessorStore } from '~/stores/professor'

definePageMeta( { layout : 'dashboard' } )

const toast = useToast()
const router = useRouter()
const eventsStore = useEventStore()
const professorStore = useProfessorStore()

onMounted(async () => {
  await professorStore.fetchProfessors?.();
})

const clasificacionesOptions = computed(() => {
  return eventsStore.classifications.map(c => ({
    label: c.classification,
    value: c.id
  }))
})

const professorOptions = computed(() => {
  return (professorStore.professors || []).map(p => ({
    label: `${p.nombre} ${p.primerApellido}`,
    value: String(p.id)
  }))
})

const schema = z.object({
  titulo: z.string().min(1, 'Requerido'),
  titulo_corto: z.string().min(1, 'Requerido'),
  anno: z.coerce.number().min(1, 'Requerido'),
  clasificacion: z.string().min(1, 'Requerido'),
  profesor_id: z.union([z.string(), z.number()]).transform(val => String(val)),
})

type SchemaType = z.infer<typeof schema>;

const state = reactive<SchemaType>({
  titulo: '',
  titulo_corto: '',
  anno: 0,
  clasificacion: '',
  profesor_id: '',
})

// Enviar datos
async function onSubmit( event : FormSubmitEvent<SchemaType> ) {
  console.debug( "event", event );
  const result = await eventsStore.createEvent( event.data )

  if ( result ) {
    toast.add( {
      title : `Evento creado`,
      color : 'success'
    } )
    router.push('/eventos')
  } else {
    toast.add( {
      title : eventsStore.error! || 'Error al registrar el evento',
      color : 'error',
    } )
  }
}
</script>


<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit" class="flex justify-center w-full">
    <UCard class="w-full max-w-2xl">
      <template #header>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          Registrar evento
        </h2>
      </template>

      <div class="flex flex-col space-y-2 overflow-y-auto">
        <UFormField label="Título" name="titulo" required>
          <UInput class="w-full" v-model="state.titulo"/>
        </UFormField>

        <UFormField label="Título Corto" name="titulo_corto" required>
          <UInput class="w-full" v-model="state.titulo_corto"/>
        </UFormField>

        <UFormField label="Profesor" name="profesor_id" required>
          <USelect
            class="w-full"
            v-model="state.profesor_id"
            :items="professorOptions"
            :loading="!professorStore.professors"
          />
        </UFormField>

        <UFormField label="Clasificación" name="clasificacion" required>
          <USelect
            class="w-full"
            v-model="state.clasificacion"
            :items="clasificacionesOptions"
          />
        </UFormField>

        <UFormField label="Año" name="anno" required>
          <UInput class="w-full" v-model="state.anno" type="number"/>
        </UFormField>
      </div>

      <template #footer>
        <div class="flex justify-between flex-row">
          <UButton size="lg" type="button" color="neutral" label="Cancelar" @click="router.back()"/>
          <UButton size="lg" type="submit" color="primary" label="Registrar" :loading="eventsStore.isLoading"/>
        </div>
      </template>
    </UCard>
  </UForm>
</template>
