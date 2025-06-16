<script setup lang="ts">
import { z } from 'zod'
import type { Professors } from "~/models/Professors";
import type { FormSubmitEvent } from "#ui/types";
import { useProfessorStore } from "~/pages/profesores/store";

definePageMeta( { layout : 'dashboard' } )

const toast = useToast()
const router = useRouter()
const professorsStore = useProfessorStore()

const schema = z.object( {
  id : z.string().optional(),
  name : z.string().min( 1, 'Requerido' ),
  lastName : z.string().min( 1, 'Requerido' ),
  secondLastName : z.string().min( 1, 'Requerido' ),
  experience : z.string().min( 1, 'Requerido' ),
  experienceYears : z.coerce.number().min( 0 ),
  categoryDegree : z.string(),
  scientificCategory : z.string(),
  scientificDegree : z.string(),
} )

type SchemaType = z.infer<typeof schema>;


const state = reactive( {
  name : professorsStore.currentProfessor!.name,
  lastName : professorsStore.currentProfessor!.lastName,
  secondLastName : professorsStore.currentProfessor!.secondLastName,
  experience : professorsStore.currentProfessor!.experience,
  experienceYears : professorsStore.currentProfessor!.experienceYears,
  categoryDegree : professorsStore.currentProfessor!.categoryDegree,
  scientificCategory : professorsStore.currentProfessor!.scientificCategory,
  scientificDegree : professorsStore.currentProfessor!.scientificDegree,
  contacts : {
    phones : professorsStore.currentProfessor!.contacts.phones,
    emails : professorsStore.currentProfessor!.contacts.emails
  }
} )

// Inicializar con datos si es edición
const props = defineProps( {
  professor : {
    type : Object as () => Professors | null,
    default : null
  }
} )

if ( props.professor ) {
  Object.assign( state, props.professor )
}

const addPhone = () => state.contacts.phones.push()
const addEmail = () => state.contacts.emails.push()

const removePhone = ( index : number ) => {
  state.contacts.phones.splice( index, 1 )
}

const removeEmail = ( index : number ) => {
  state.contacts.emails.splice( index, 1 )
}

// Enviar datos
async function onSubmit( event : FormSubmitEvent<any> ) {

  const result = await professorsStore.createProfessor( event.data )

  if ( result ) {
    toast.add( {
      title : `Profesor creado`,
      color : 'success'
    } )
  } else {
    toast.add( {
      title : professorsStore.error!,
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
          Registrar profesor
        </h2>
      </template>

      <div class="flex flex-col space-y-2 overflow-y-auto">
        <!-- Sección Información Básica -->
        <div class="grid grid-cols-3 gap-2 w-full">
          <UFormField label="Nombre" name="name" required>
            <UInput class="w-full" v-model="state.name"/>
          </UFormField>

          <UFormField label="Primer apellido" name="lastName" required>
            <UInput class="w-full" v-model="state.lastName"/>
          </UFormField>

          <UFormField label="Segundo apellido" name="secondLastName" required>
            <UInput class="w-full" v-model="state.secondLastName"/>
          </UFormField>
        </div>

        <!-- Sección Experiencia -->
        <div class="grid grid-cols-2 gap-2 w-full">
          <UFormField label="Experiencia" name="experience" required>
            <UInput class="w-full" v-model="state.experience"/>
          </UFormField>

          <UFormField label="Años de experiencia" name="experienceYears" required>
            <UInput class="w-full" v-model="state.experienceYears" type="number"/>
          </UFormField>
        </div>

        <!-- Sección Categorías -->
        <div class="grid grid-cols-3 gap-2 w-full">
          <UFormField label="Categoría docente" name="categoryDegree">
            <USelect class="w-full"
                     v-model="state.categoryDegree"
                     :items="['Instructor', 'Asistente', 'Auxiliar', 'Titular']"
                     placeholder="Seleccione"
            />
          </UFormField>

          <UFormField label="Categoría científica" name="scientificCategory">
            <USelect class="w-full"
                     v-model="state.scientificCategory"
                     :items="['Ninguna', 'Investigador Agregado', 'Investigador Auxiliar', 'Investigador Titular']"
                     placeholder="Seleccione"
            />
          </UFormField>

          <UFormField label="Grado científico" name="scientificDegree">
            <USelect class="w-full"
                     v-model="state.scientificDegree"
                     :items="['Ninguno', 'Máster', 'Doctor', 'Doctor en Ciencias']"
                     placeholder="Seleccione"
            />
          </UFormField>
        </div>

        <!-- Sección Contactos -->
        <div class="space-y-4">
          <!-- Teléfonos -->
          <div class="border rounded-lg p-4 dark:border-gray-700">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-gray-900 dark:text-white">Teléfonos</h3>
              <UButton
                  icon="i-heroicons-plus"
                  size="xs"
                  variant="outline"
                  @click="addPhone"
              />
            </div>

            <div v-for="(phone, i) in state.contacts.phones" :key="`phone-${i}`" class="flex items-center gap-2 mb-2">
              <UFormField :name="`phones[${i}]`" class="flex-grow">
                <UInput v-model="state.contacts.phones[i]" placeholder="Número de teléfono" type="tel"/>
              </UFormField>
              <UButton
                  icon="i-heroicons-trash"
                  color="error"
                  variant="ghost"
                  size="sm"
                  @click="removePhone(i)"
                  :disabled="state.contacts.phones.length <= 1"
              />
            </div>
          </div>

          <!-- Correos -->
          <div class="border rounded-lg p-4 dark:border-gray-700">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-gray-900 dark:text-white">Correos electrónicos</h3>
              <UButton
                  icon="i-heroicons-plus"
                  size="xs"
                  variant="outline"
                  @click="addEmail"
              />
            </div>

            <div v-for="(email, i) in state.contacts.emails" :key="`email-${i}`" class="flex items-center gap-2 mb-2">
              <UFormField :name="`emails[${i}]`" class="flex-grow">
                <UInput v-model="state.contacts.emails[i]" placeholder="Correo electrónico" type="email"/>
              </UFormField>
              <UButton
                  icon="i-heroicons-trash"
                  color="error"
                  variant="ghost"
                  size="sm"
                  @click="removeEmail(i)"
                  :disabled="state.contacts.emails.length <= 1"
              />
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between flex-row">
          <UButton
              type="button"
              color="neutral"
              label="Cancelar"
              @click="router.back()"
          />
          <UButton
              type="submit"
              color="primary"
              label="Registrar"
              :loading="professorsStore.isLoading"
          />
        </div>
      </template>
    </UCard>
  </UForm>
</template>
