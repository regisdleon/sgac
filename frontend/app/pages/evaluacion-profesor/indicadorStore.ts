import { defineStore } from 'pinia';

export interface IndicadorEvaluacion {
  id: string;
  nombre: string;
}

export const useIndicadorEvaluacionStore = defineStore('indicadorEvaluacionStore', {
  state: () => ({
    indicadores: [] as IndicadorEvaluacion[],
    isLoading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchIndicadores() {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await $fetch('/api/indicadores-evaluacion');
        this.indicadores = Array.isArray(data) ? data : [];
      } catch (err: any) {
        this.error = err.message || 'Error al cargar los indicadores';
      } finally {
        this.isLoading = false;
      }
    },
  },
}); 