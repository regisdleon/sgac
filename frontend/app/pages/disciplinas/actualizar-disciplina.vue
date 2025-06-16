<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from "#ui/types";
import { useDisciplineStore } from "~/pages/disciplinas/store";
import { useCareerStore } from "~/stores/career";
import { ref, onMounted, computed, watch } from 'vue'

definePageMeta( { layout : 'dashboard' } )

const router = useRouter()
const toast = useToast()
const disciplineStore = useDisciplineStore()
const careerStore = useCareerStore()


// Esquema de validación
const schema = z.object( {
  nombre : z.string().min( 1, 'Nombre requerido' ).max( 255, 'Máximo 255 caracteres' ),
  codigo : z.string().min( 1, 'Código requerido' ).max( 255, 'Máximo 255 caracteres' ),
  carrera : z.number({
    required_error: 'Carrera requerida',
    invalid_type_error: 'Debe seleccionar una carrera'
  })
} );

type SchemaType = z.infer<typeof schema>;

// Estado del formulario
const state = reactive<SchemaType>( {
  nombre : disciplineStore.currentDiscipline?.nombre || '',
  codigo : disciplineStore.currentDiscipline?.codigo || '',
  carrera : disciplineStore.currentDiscipline?.carrera?.id || 0
} )

// Cargar carreras al montar el componente
onMounted(async () => {
  try {
    await careerStore.fetchCareers();
    console.log('Carreras cargadas:', careerStore.careers);
  } catch (error) {
    console.error('Error al cargar carreras:', error);
    toast.add({
      title: 'Error al cargar carreras',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error'
    });
  }
});

// Computed property para las carreras ordenadas
const carrerasOrdenadas = computed(() => {
  const carreras = careerStore.careers || [];
  return carreras.map(carrera => ({
    id: carrera.id,
    nombre: carrera.nombre
  })).sort((a, b) => a.nombre.localeCompare(b.nombre));
});

async function onSubmit( event : FormSubmitEvent<SchemaType> ) {
  try {
    const disciplineData = { ...event.data };
    const carreraId = disciplineData.carrera;
    delete disciplineData.carrera; // Eliminar carrera del cuerpo de la solicitud

    const result = await disciplineStore.updateDiscipline( {
      id : disciplineStore.currentDiscipline!.id,
      ...disciplineData
    }, carreraId );

    if (result) {
      toast.add( { title : 'Disciplina actualizada correctamente', icon: 'i-heroicons-check-circle', color: 'success' } )
      router.back()
    } else {
      toast.add( { title : disciplineStore.error!, icon: 'i-heroicons-exclamation-circle', color: 'error' } )
    }
  } catch ( e ) {
    toast.add( { title : 'Error al actualizar la disciplina', icon: 'i-heroicons-exclamation-circle', color: 'error' } )
  }
}


</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit" class="justify-center flex w-full items-center ">
    <UCard title="Actualizar disciplina" class="min-w-lg">

      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">Actualizar Disciplina</h2>
          <UButton
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              @click="router.back()"
          />
        </div>
      </template>

      <div class="flex flex-col space-y-4">
        <UFormField required label="Carrera" name="carrera">
          <select
            v-model="state.carrera"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            :disabled="careerStore.isLoading"
          >
            <option
              v-for="carrera in carrerasOrdenadas"
              :key="carrera.id"
              :value="carrera.id"
            >
              {{ carrera.nombre }}
            </option>
          </select>
        </UFormField>

        <UFormField required label="Nombre" name="nombre">
          <UInput
            class="w-full"
            v-model="state.nombre"
            placeholder="Ingrese el nombre de la disciplina"
          />
        </UFormField>

        <UFormField required label="Código" name="codigo">
          <UInput
            class="w-full"
            v-model="state.codigo"
            placeholder="Ingrese el código único"
          />
        </UFormField>
      </div>

      <template #footer>
        <div class="flex justify-between w-full">
          <UButton
              size="lg"
              color="neutral"
              label="Cancelar"
              :disabled="disciplineStore.isLoading"
              @click="router.back()"
          />
          <UButton
              size="lg"
              color="primary"
              type="submit"
              label="Actualizar"
              :loading="disciplineStore.isLoading"
          />
        </div>
      </template>
    </UCard>
  </UForm>
</template>
