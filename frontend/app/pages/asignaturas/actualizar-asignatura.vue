<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from "#ui/types";
import { useSubjectStore } from "~/pages/asignaturas/store";

definePageMeta( { layout : 'dashboard' } )

const toast = useToast()
const router = useRouter()
const subjectStore = useSubjectStore()

const schema = z.object( {
  name : z.string().min( 1, 'Requerido' ),
  year : z.string().min( 1, 'Requerido' ),
  semester : z.string().min( 1, 'Requerido' ),
  modality : z.string().min( 1, 'Requerido' ),
  // curriculum : z.object( {
  //   code : z.string().min( 1, 'Requerido' ),
  //   name : z.string().optional()
  // } ),
  discipline : z.string().min( 1, 'Requerido' ),

  // z.object( {
  // code : z.string().min( 1, 'Requerido' ),
  // name : z.string().optional()
  // } ),
} )

type SchemaType = z.infer<typeof schema>;

const state = reactive<SchemaType>( {
  name :  subjectStore.currentSubject?.name!,
  year :  subjectStore.currentSubject?.year!,
  semester :  subjectStore.currentSubject?.semester!,
  modality :  subjectStore.currentSubject?.modality!,
  discipline :  subjectStore.currentSubject?.discipline.name!,
  // discipline : {
  //   code : '',
  //   name : ''
  // },
} )

// Enviar datos
async function onSubmit( event : FormSubmitEvent<SchemaType> ) {
  const result = await subjectStore.createSubject( event.data )

  if ( result ) {
    toast.add( {
      title : `Asignatura actualizada`,
      color : 'success'
    } )
    router.back()
  } else {
    toast.add( {
      title : subjectStore.error || 'Error al actualizar la asignatura',
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
          Actualizar asignatura
        </h2>
      </template>

      <div class="flex flex-col space-y-2 w-full">
        <!-- Información básica -->
        <!--          <UFormField label="Código" name="code" required>-->
        <!--            <UInput class='w-full v-model="state.code" placeholder="Ej: MAT-101"/>-->
        <!--          </UFormField>-->

        <UFormField label="Nombre" name="name" required>
          <UInput class="w-full" v-model="state.name"/>
        </UFormField>

        <div class="grid grid-cols-2 gap-2 w-full">

          <!-- Año y semestre -->
          <UFormField label="Año" name="year" required>
            <USelect class="w-full"
                     v-model="state.year"
                     :items="['1ro', '2do', '3ro', '4to', '5to']"
                     placeholder="Seleccione el año"
            />
          </UFormField>

          <UFormField label="Semestre" name="semester" required>
            <USelect class="w-full"
                     v-model="state.semester"
                     :items="['1er', '2do']"
                     placeholder="Seleccione el semestre"
            />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-2 w-full">


          <!-- Modalidad -->
          <UFormField label="Modalidad" name="modality" required>
            <USelect class="w-full"
                     v-model="state.modality"
                     :items="['Presencial', 'Semipresencial', 'Virtual']"
                     placeholder="Seleccione la modalidad"
            />
          </UFormField>

          <!-- Plan de estudio y disciplina -->
          <!--        <UFormField label="Plan de estudio" name="curriculum.code" required>-->
          <!--          <UInput class="w-full" v-model="state.curriculum.code" placeholder="Código del plan"/>-->
          <!--        </UFormField>-->

          <UFormField label="Disciplina" name="discipline" required>
            <USelect class="w-full"
                     v-model="state.discipline"
                     :items="['Presencial', 'Semipresencial', 'Virtual']"
                     placeholder="Seleccione la disciplina"
            />
          </UFormField>
        </div>

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
              :loading="subjectStore.isLoading"
          />
        </div>
      </template>
    </UCard>
  </UForm>
</template>