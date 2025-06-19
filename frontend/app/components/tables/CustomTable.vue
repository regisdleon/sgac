<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref, watch } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const props = defineProps<{
  data?: T[] // Hacer la prop opcional para el valor inicial
  columns : TableColumn<T>[]
  loading : boolean
  error? : string | null
  emptyText? : string
  title : string
  pageSize? : number
  initialPage? : number
  searchPlaceholder? : string
}>()

// Asegurar que la prop 'data' siempre sea un array
const data = computed(() => props.data || []);

const emit = defineEmits<{
  ( e : 'update:search', value : string ) : void
  ( e : 'page-change', page : number ) : void
}>()

// Valores por defecto
const defaultPageSize = props.pageSize ?? 10
const defaultEmptyText = props.emptyText ?? 'No se encontraron registros'
const defaultSearchPlaceholder = props.searchPlaceholder ?? 'Buscar'

// Estado reactivo
const page = ref( props.initialPage ?? 1 )
const pageSize = ref( defaultPageSize )
const searchTerm = ref( '' )

// Resetear página cuando se filtra
watch( searchTerm, () => {
  page.value = 1
  emit( 'update:search', searchTerm.value )
} )

// Datos filtrados
const filteredData = computed(() => {
  return data.value;
});

// Datos paginados
const paginatedData = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  const paginated = filteredData.value.slice(start, start + pageSize.value);
  console.log('Paginated data computed:', paginated);
  return paginated;
});

// Total de páginas
const totalPages = computed( () => {
    const dataLength = filteredData.value?.length || 0;
    const size = pageSize.value || 1; // Asegurar que pageSize sea al menos 1
    return Math.ceil( dataLength / size );
});

// Manejar cambio de página
function handlePageChange( newPage : number ) {
  page.value = newPage
  emit( 'page-change', newPage )
}

console.log('CustomTable mounted/updated: paginatedData=', paginatedData.value, 'columns=', props.columns);
</script>

<template>
  <div class="flex flex-col w-full h-full gap-4">
    <!-- Header con título y controles -->
    <div class="flex items-center w-full  justify-between flex-row ">
      <!-- Buscador -->
      <UInput
          icon="i-heroicons-magnifying-glass"
          size="md"
          v-model="searchTerm"
          :placeholder="defaultSearchPlaceholder"
          :ui="{
            trailing: 'pe-1',
            base: 'min-w-[250px]'
          }"
      >
        <template v-if="searchTerm?.length" #trailing>
          <UButton
              variant="ghost"
              size="xs"
              icon="i-heroicons-x-mark"
              aria-label="Clear search"
              @click="searchTerm = ''"
          />
        </template>
      </UInput>

      <!-- Botón de acción (slot) -->
      <slot name="register-button"/>
    </div>

    <!-- Mensaje de error -->
    <UAlert
        v-if="error"
        :title="error"
        color="error"
        variant="solid"
        icon="i-heroicons-exclamation-circle"
    />

    <!-- Tabla -->
    <div class="flex-1 overflow-hidden border border-gray-200 dark:border-gray-800 rounded-lg">
      <UTable
          :data="paginatedData"
          :columns="columns"
          :loading="loading"
          :loading-color="loading ? 'primary' : undefined"
          :empty-text="error ? '' : defaultEmptyText"
          class="w-full h-full overflow-auto"
          sticky
      >
        <!-- Slot para filas vacías personalizadas -->
        <template #empty>
          <div class="flex h-full flex-col items-center justify-center py-12">
            <span class="text-gray-500 justify-self-center">Sin datos</span>
          </div>
        </template>

        <!-- Pasar todos los slots a UTable -->
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData"/>
        </template>
      </UTable>
    </div>

    <!-- Paginación -->
    <div v-if="filteredData.value" class="flex w-full items-center justify-between">
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Mostrando {{ paginatedData?.length || 0 }} de {{ filteredData.value?.length || 0 }} registros
      </div>

      <UPagination
          v-model="page"
          :page-count="pageSize"
          :total="(filteredData.value && filteredData.value.length) ? filteredData.value.length : 0"
          :active-button="{ color: 'primary' }"
          @update:model-value="handlePageChange"
      />
    </div>
  </div>
</template>