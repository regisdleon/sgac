<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from "#ui/types";
import { usePrizeStore } from "~/pages/premios/store";

definePageMeta( { layout : 'dashboard' } )

const toast = useToast()
const router = useRouter()
const prizeStore = usePrizeStore()

const schema = z.object( {
  id : z.string().optional(),
  name : z.string().min( 1, 'Requerido' ),
  year : z.string().min( 4, 'Debe ser un año válido' ).max( 4 ),
  description : z.string().min( 10, 'Descripción demasiado corta' ),
  type : z.string().min( 1, 'Requerido' ),
} )

type SchemaType = z.infer<typeof schema>;

const state = reactive<SchemaType>( {
  name : prizeStore.currentPrize?.name!,
  year : prizeStore.currentPrize?.year!,
  description : prizeStore.currentPrize?.description!,
  type : prizeStore.currentPrize?.type!,
} )

// Tipos de premios disponibles
const prizeTypes = [
  'Científico',
  'Tecnológico',
  'Académico',
  'Artístico',
  'Humanístico',
  'Deportivo'
]

// Enviar datos
async function onSubmit( event : FormSubmitEvent<SchemaType> ) {
  const result = await prizeStore.createPrize( event.data )

  if ( result ) {
    toast.add( {
      title : 'Premio creado',
      description : 'El premio se ha registrado correctamente',
      color : 'success'
    } )
    router.push( '/premios' ) // Redirigir a la lista de premios
  } else {
    toast.add( {
      title : 'Error',
      description : prizeStore.error || 'Error al crear el premio',
      color : 'error',
    } )
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
    <UCard
        class="w-full max-w-2xl"
    >
      <template #header>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          Actualizar premio
        </h2>
      </template>

      <div class="flex flex-col space-y-4">
        <!-- Nombre del premio -->
        <UFormField label="Nombre del premio" name="name" required>
          <UInput class="w-full" v-model="state.name" placeholder="Ej: Premio Nacional de Investigación"/>
        </UFormField>

        <!-- Año y Tipo -->
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Año" name="year" required>
            <UInput
                class="w-full"
                v-model="state.year"
                type="number"
                min="1900"
                :max="new Date().getFullYear()"
            />
          </UFormField>

          <UFormField label="Tipo de premio" name="type" required>
            <USelect
                class="w-full"
                v-model="state.type"
                :items="prizeTypes"
                placeholder="Seleccione el tipo"
            />
          </UFormField>
        </div>

        <!-- Descripción -->
        <UFormField label="Descripción" name="description" required>
          <UTextarea
              class="w-full"
              v-model="state.description"
              placeholder="Descripción detallada del premio y sus criterios"
              :rows="4"
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
              label="Actualizar"
              :loading="prizeStore.isLoading"
          />
        </div>
      </template>
    </UCard>
  </UForm>
</template>