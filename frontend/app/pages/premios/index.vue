<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePrizeStore } from './store';
import { PrizeType } from '~/models/Prize';
import type { Prize } from '~/models/Prize';

definePageMeta({ layout: 'dashboard' });

const router = useRouter();
const prizeStore = usePrizeStore();
const loading = ref(false);
const showDeleteModal = ref(false);
const selectedPrize = ref<Prize | null>(null);

const filters = ref({
  search: '',
  tipo: '',
  año: ''
});

const prizeTypes = Object.values(PrizeType);

const columns = [
  {
    key: 'nombre',
    label: 'Tipo de Premio'
  },
  {
    key: 'descripcion',
    label: 'Descripción'
  },
  {
    key: 'año',
    label: 'Año'
  },
  {
    key: 'profesor',
    label: 'Profesor',
    render: (row: Prize) => `${row.profesor.nombre} ${row.profesor.apellidos}`
  },
  {
    key: 'actions',
    label: 'Acciones'
  }
];

const filteredPrizes = computed(() => {
  let result = prizeStore.getPrizes;

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    result = result.filter(prize => 
      prize.nombre.toLowerCase().includes(search) ||
      prize.descripcion.toLowerCase().includes(search)
    );
  }

  if (filters.value.tipo) {
    result = result.filter(prize => prize.nombre === filters.value.tipo);
  }

  if (filters.value.año) {
    result = result.filter(prize => prize.año.toString() === filters.value.año);
  }

  return result;
});

onMounted(async () => {
  loading.value = true;
  try {
    await prizeStore.fetchPrizes();
  } catch (error) {
    console.error('Error al cargar premios:', error);
  } finally {
    loading.value = false;
  }
});

const editPrize = (prize: Prize) => {
  router.push(`/premios/editar/${prize._id}`);
};

const confirmDelete = (prize: Prize) => {
  selectedPrize.value = prize;
  showDeleteModal.value = true;
};

const deletePrize = async () => {
  if (!selectedPrize.value) return;
  
  loading.value = true;
  try {
    await prizeStore.deletePrize(selectedPrize.value._id);
    showDeleteModal.value = false;
    selectedPrize.value = null;
  } catch (error) {
    console.error('Error al eliminar premio:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Premios</h1>
      <button
        @click="$router.push('/premios/registrar-premio')"
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Registrar Premio
      </button>
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha de Creación
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="prize in prizes" :key="prize._id">
            <td class="px-6 py-4 whitespace-nowrap">
              {{ prize.nombre }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ new Date(prize.createdAt).toLocaleDateString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="editPrize(prize)"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                Editar
              </button>
              <button
                @click="confirmDelete(prize)"
                class="text-red-600 hover:text-red-900"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Confirmación -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 class="text-lg font-medium mb-4">Confirmar Eliminación</h3>
        <p class="mb-4">¿Está seguro que desea eliminar este premio?</p>
        <div class="flex justify-end space-x-2">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            @click="deletePrize"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
