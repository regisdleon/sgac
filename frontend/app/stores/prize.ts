import { defineStore } from 'pinia'
import { useFetch } from '#app'
import type { Prize } from "~/models/Prize"

export const usePrizeStore = defineStore('prizeStore', {
  state: () => ({
	prizes: [] as Prize[],
	currentPrize: null as Prize | null,
	isLoading: false,
	error: null as string | null,
  }),
  
  getters: {
	getPrizeById: (state) => (id: string) => {
	  return state.prizes.find((p: Prize) => p.id === id);
	},
	getPrizesByYear: (state) => (year: number) => {
	  return state.prizes.filter(p => p.year === year);
	},
	getPrizesByType: (state) => (type: string) => {
	  return state.prizes.filter(p => p.type === type);
	},
	sortedPrizes: (state) => {
	  return [...state.prizes].sort((a, b) =>
		(b.year ?? 0) - (a.year ?? 0) || // Orden descendente por año (safe with nullish coalescing)
		a.nombre.localeCompare(b.nombre)    // Luego por nombre ascendente
	  );
	},
  },
  
  actions: {
	/**
	 * Obtiene todos los premios
	 */
	async fetchPrizes() {
	  this.isLoading = true;
	  this.error = null;
	  
	  try {
		const { data, error } = await useFetch('/api/prizes');
		
		if (error.value) {
		  this.error = error.value.message || 'Error al cargar premios';
		} else if (data.value && 'prizes' in data.value && Array.isArray((data.value as any).prizes)) {
            this.prizes = (data.value as any).prizes.map((p: any) => ({
              id: p.id,
              nombre: p.nombre || p.name,
              year: p.year ?? 0, // Handle both year and default to 0
              description: p.description || p.descripcion || '',
              type: p.type || p.tipo || '',
            }));
          } else if (data.value && Array.isArray(data.value)) { // Fallback if API returns array directly
            this.prizes = (data.value as any[]).map((p: any) => ({
              id: p.id,
              nombre: p.nombre || p.name,
              year: p.year ?? 0,
              description: p.description || p.descripcion || '',
              type: p.type || p.tipo || '',
            }));
          } else {
            console.warn('Unexpected data format for prizes:', data.value);
            this.prizes = [];
          }
	  } catch (err) {
		this.error = 'Error de conexión con el servidor';
		console.error('Error inesperado:', err);
	  } finally {
		this.isLoading = false;
	  }
	},
    
    /**
     * Obtiene un premio específico por ID
     */
    async fetchPrizeById(id: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const { data, error } = await useFetch(`/api/prizes/${id}`);

        if (error.value) {
          this.error = error.value.message || 'Premio no encontrado';
          return null;
        } else if (data.value) {
          const p: any = data.value;
          const fetchedPrize: Prize = {
            id: p.id,
            nombre: p.nombre || p.name,
            year: p.year ?? 0,
            description: p.description || p.descripcion || '',
            type: p.type || p.tipo || '',
          };
          this.currentPrize = fetchedPrize;
          return fetchedPrize;
        }
        return null;
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Error al obtener el premio';
        console.error(`Error fetching prize ${id}:`, err);
        return null;
      } finally {
        this.isLoading = false;
      }
    },
	
	/**
	 * Crea un nuevo premio
	 */
	async createPrize(prizeData: Omit<Prize, 'id'>) {
	  this.isLoading = true;
	  this.error = null;
	  
	  try {
		const { data, error } = await useFetch('/api/prizes', {
		  method: 'POST',
		  body: prizeData,
		});
		
		if (error.value) {
		  this.error = error.value.message || 'Error al crear premio';
		} else if (data.value) {
            const p: any = data.value;
            const newPrize: Prize = {
              id: p.id,
              nombre: p.nombre || p.name,
              year: p.year ?? 0,
              description: p.description || p.descripcion || '',
              type: p.type || p.tipo || '',
            };
		  this.prizes.push(newPrize);
		  return newPrize; 
		}
        return null;
	  } catch (err) {
		this.error = 'Error al conectar con el servidor';
		console.error('Error inesperado:', err);
		return null;
	  } finally {
		this.isLoading = false;
	  }
	},
	
	/**
	 * Actualiza un premio existente
	 */
	async updatePrize(updatedPrize: Prize) {
	  this.isLoading = true;
	  this.error = null;
	  
	  try {
		const { data, error } = await useFetch(`/api/prizes/${updatedPrize.id}`, {
		  method: 'PATCH',
		  body: updatedPrize,
		});
		
		if (error.value) {
		  this.error = error.value.message || 'Error al actualizar premio';
		} else if (data.value) {
            const p: any = data.value;
            const updated: Prize = {
              id: p.id,
              nombre: p.nombre || p.name,
              year: p.year ?? 0,
              description: p.description || p.descripcion || '',
              type: p.type || p.tipo || '',
            };
		  const index = this.prizes.findIndex(p => p.id === updated.id);
		  if (index !== -1) {
			this.prizes[index] = updated;
		  }
          this.currentPrize = updated;
		  return updated;
		}
        return null;
	  } catch (err) {
		this.error = 'Error de red al actualizar';
		console.error('Error inesperado:', err);
		return null;
	  } finally {
		this.isLoading = false;
	  }
	},
	
	/**
	 * Elimina un premio
	 */
	async deletePrize(id: string) {
	  this.isLoading = true;
	  this.error = null;
	  
	  try {
		const { error } = await useFetch(`/api/prizes/${id}`, {
		  method: 'DELETE',
		});
		
		if (error.value) {
		  this.error = error.value.message || 'Error al eliminar premio';
		  return false;
		} else {
		  this.prizes = this.prizes.filter(p => p.id !== id);
		  if (this.currentPrize?.id === id) {
			this.currentPrize = null;
		  }
		  return true;
		}
	  } catch (err) {
		this.error = 'Error de conexión al eliminar';
		console.error('Error inesperado:', err);
		return false;
	  } finally {
		this.isLoading = false;
	  }
	},
	
	/**
	 * Establece el premio actual (para edición)
	 */
	setCurrentPrize(prize: Prize | null) {
	  this.currentPrize = prize;
	},
	
	/**
	 * Limpia el premio actual
	 */
	clearCurrentPrize() {
	  this.currentPrize = null;
	},
	
	/**
	 * Limpia los errores
	 */
	clearError() {
	  this.error = null;
	},
	
	/**
	 * Obtiene premios por tipo
	 */
	async fetchPrizesByType(type: string) {
	  this.isLoading = true;
	  
	  try {
		const { data, error } = await useFetch(`/prizes/type/${type}`);
		
		if (error.value) {
		  throw new Error(error.value.message || 'Error al filtrar por tipo');
		}
		
		return data.value || [];
	  } catch (err) {
		this.error = err instanceof Error ? err.message : 'Error al filtrar por tipo';
		console.error('Error fetching prizes by type:', err);
		return [];
	  } finally {
		this.isLoading = false;
	  }
	},
  },
}); 