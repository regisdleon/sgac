// stores/prize.ts
import { defineStore } from 'pinia';
import type { Prize } from '~/models/Prize';

export const usePrizeStore = defineStore('prizeStore', {
  state: () => ({
    prizes: [] as Prize[],
    currentPrize: null as Prize | null,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    getPrizeById: (state) => (id: string) => {
      return state.prizes.find((p: Prize) => p.id === id);
    }
  },

  actions: {
    async fetchPrizes() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await $fetch<Prize[]>('/api/premios', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
        
        if (Array.isArray(response)) {
          this.prizes = response.map((p: any) => ({
            id: p.id,
            profesor: p.profesor,
            anno: p.anno,
            descripcion: p.descripcion,
            clasificacion: p.clasificacion,
          }));
        } else {
          this.error = 'Formato de respuesta inválido';
        }
      } catch (err) {
        console.error('Error fetching prizes:', err);
        this.error = err instanceof Error ? err.message : 'Error al cargar premios';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchPrizeById(id: string) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await $fetch<Prize>(`/api/premios/${id}`);
        
        if (response) {
          const fetchedPrize: Prize = {
            id: response.id,
            profesor: response.profesor,
            anno: response.anno,
            descripcion: response.descripcion,
            clasificacion: response.clasificacion,
          };
          this.currentPrize = fetchedPrize;
          return fetchedPrize;
        }
        return null;
      } catch (err) {
        console.error(`Error fetching prize ${id}:`, err);
        this.error = err instanceof Error ? err.message : 'Error al obtener el premio';
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    async createPrize(prizeData: Omit<Prize, 'id'>) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await $fetch<Prize>('/api/premios', {
          method: 'POST',
          body: prizeData,
        });
        
        if (response) {
          const newPrize: Prize = {
            id: response.id,
            profesor: response.profesor,
            anno: response.anno,
            descripcion: response.descripcion,
            clasificacion: response.clasificacion,
          };
          this.prizes.push(newPrize);
          return newPrize;
        }
        return null;
      } catch (err) {
        console.error('Error creating prize:', err);
        this.error = err instanceof Error ? err.message : 'Error al crear premio';
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    async updatePrize(updatedPrize: Prize) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await $fetch<Prize>(`/api/premios/${updatedPrize.id}`, {
          method: 'PATCH',
          body: updatedPrize,
        });
        
        if (response) {
          const updated: Prize = {
            id: response.id,
            profesor: response.profesor,
            anno: response.anno,
            descripcion: response.descripcion,
            clasificacion: response.clasificacion,
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
        console.error('Error updating prize:', err);
        this.error = err instanceof Error ? err.message : 'Error al actualizar premio';
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    async deletePrize(id: string) {
      this.isLoading = true;
      this.error = null;
      
      try {
        await $fetch(`/api/premios/${id}`, {
          method: 'DELETE'
        });
        
        this.prizes = this.prizes.filter(p => p.id !== id);
        if (this.currentPrize?.id === id) {
          this.currentPrize = null;
        }
        return true;
      } catch (err) {
        console.error('Error deleting prize:', err);
        this.error = err instanceof Error ? err.message : 'Error al eliminar premio';
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    setCurrentPrize(prize: Prize | null) {
      this.currentPrize = prize;
    },

    clearCurrentPrize() {
      this.currentPrize = null;
    },

    clearError() {
      this.error = null;
    }
  }
});