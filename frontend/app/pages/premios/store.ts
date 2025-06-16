// stores/prize.ts
import { defineStore } from 'pinia';
import type { Prize } from '~/models/Prize';

export const usePrizeStore = defineStore('prize', {
  state: () => ({
    prizes: [] as Prize[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    getPrizes: (state) => state.prizes
  },

  actions: {
    async fetchPrizes() {
      this.loading = true;
      try {
        const response = await fetch('/api/prizes');
        if (!response.ok) throw new Error('Error al cargar los premios');
        this.prizes = await response.json();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error desconocido';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createPrize(prize: Omit<Prize, '_id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true;
      try {
        const response = await fetch('/api/prizes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(prize)
        });
        if (!response.ok) throw new Error('Error al crear el premio');
        const newPrize = await response.json();
        this.prizes.push(newPrize);
        return newPrize;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error desconocido';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updatePrize(id: string, prize: Partial<Prize>) {
      this.loading = true;
      try {
        const response = await fetch(`/api/prizes/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(prize)
        });
        if (!response.ok) throw new Error('Error al actualizar el premio');
        const updatedPrize = await response.json();
        const index = this.prizes.findIndex(p => p._id === id);
        if (index !== -1) {
          this.prizes[index] = updatedPrize;
        }
        return updatedPrize;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error desconocido';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deletePrize(id: string) {
      this.loading = true;
      try {
        const response = await fetch(`/api/prizes/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar el premio');
        this.prizes = this.prizes.filter(p => p._id !== id);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error desconocido';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});