<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from "#ui/types";
import { useDisciplineStore } from "~/pages/disciplinas/store";

definePageMeta( { layout : 'dashboard' } )

const router = useRouter()
const toast = useToast()
const disciplineStore = useDisciplineStore()


// Esquema de validación
const schema = z.object( {
  name : z.string().min( 1, 'Nombre requerido' ).max( 50, 'Máximo 50 caracteres' ),
  code : z.string().min( 1, 'Código requerido' ).max( 20, 'Máximo 20 caracteres' ),
} );

// Estado del formulario
const state = reactive<SchemaType>( {
  name : disciplineStore.currentDiscipline!.name,
  code : disciplineStore.currentDiscipline!.code
} )

type SchemaType = z.infer<typeof schema>;

async function onSubmit( event : FormSubmitEvent<SchemaType> ) {
  try {
    await disciplineStore.updateDiscipline( {
      id : disciplineStore.currentDiscipline!.id,
      name : state.name,
      code : state.code,
    } )

    toast.add( { title : `Disciplina actualizada`, color : 'primary' } )
    router.back()
  } catch ( e ) {
    toast.add( { title : 'Error al guardar disciplina', color : 'error' } )
  }
}


</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit" class="justify-center flex w-full items-center ">
    <UCard title="Registrar disciplina" class="min-w-lg">

      <template #header>Actualizar Disciplina</template>

      <div class="flex flex-col space-y-2">
        <UFormField required label="Nombre">
          <UInput class="w-full" v-model="state.name"/>
        </UFormField>
        <UFormField required label="Código">
          <UInput class="w-full" v-model="state.code"/>
        </UFormField>
      </div>

      <template #footer>
        <div class="flex justify-between w-full">
          <UButton size="lg" color="neutral" label="Cancelar" @click="router.back()"/>
          <UButton size="lg" color="primary" type="submit"
                   label="Actualizar"/>
        </div>
      </template>
    </UCard>
  </UForm>
</template>
