import { defineStore } from 'pinia';
import type { Evaluation } from '~/models/Evaluation';
import { useProfessorStore } from '~/stores/professor';

export const useEvaluationStore = defineStore('evaluationStore', {
  state: () => ({
    evaluations: [] as Evaluation[],
    currentEvaluation: null as Evaluation | null,
    isLoading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchEvaluations() {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await $fetch('/api/profesorevaluacion');
        // Mapear datos anidados a modelo plano
        this.evaluations = Array.isArray(data)
          ? data.map((item: any) => ({
              id: item.id,
              profesor: item.profesor?.id || '',
              indicador: item.indicador?.id || '',
              fecha: item.fecha,
              evaluacion: item.evaluacion,
            }))
          : [];
      } catch (err: any) {
        this.error = err.message || 'Error al cargar las evaluaciones';
      } finally {
        this.isLoading = false;
      }
    },
    async createEvaluation(evaluation: Omit<Evaluation, 'id'>) {
      this.isLoading = true;
      this.error = null;
      try {
        // Enviar solo los IDs
        const payload = {
          profesor_id: evaluation.profesor,
          indicador_id: evaluation.indicador,
          fecha: evaluation.fecha,
          evaluacion: evaluation.evaluacion,
        };
        const data = await $fetch('/api/profesorevaluacion', {
          method: 'POST',
          body: payload,
        });
        // Mapear respuesta
        this.evaluations.push({
          id: (data as any).id,
          profesor: (data as any).profesor?.id || '',
          indicador: (data as any).indicador?.id || '',
          fecha: (data as any).fecha,
          evaluacion: (data as any).evaluacion,
        });
        return data;
      } catch (err: any) {
        this.error = err.message || 'Error al registrar la evaluación';
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    async updateEvaluation(evaluation: Evaluation) {
      this.isLoading = true;
      this.error = null;
      try {
        // Enviar solo los IDs
        const payload = {
          profesor_id: evaluation.profesor,
          indicador_id: evaluation.indicador,
          fecha: evaluation.fecha,
          evaluacion: evaluation.evaluacion,
        };
        const data = await $fetch(`/api/profesorevaluacion/${evaluation.id}`, {
          method: 'PATCH',
          body: payload,
        });
        const idx = this.evaluations.findIndex(e => e.id === evaluation.id);
        if (idx !== -1) {
          this.evaluations.splice(idx, 1, {
            id: (data as any).id,
            profesor: (data as any).profesor?.id || '',
            indicador: (data as any).indicador?.id || '',
            fecha: (data as any).fecha,
            evaluacion: (data as any).evaluacion,
          });
        }
        return data;
      } catch (err: any) {
        this.error = err.message || 'Error al actualizar la evaluación';
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    setCurrentEvaluation(evaluation: Evaluation) {
      this.currentEvaluation = { ...evaluation };
    },
    clearCurrentEvaluation() {
      this.currentEvaluation = null;
    },
    async deleteEvaluation(id: string) {
      this.isLoading = true;
      this.error = null;
      try {
        await $fetch(`/api/profesorevaluacion/${id}`, {
          method: 'DELETE',
        });
        this.evaluations = this.evaluations.filter(e => e.id !== id);
        return true;
      } catch (err: any) {
        this.error = err.message || 'Error al eliminar la evaluación';
        return false;
      } finally {
        this.isLoading = false;
      }
    },
  },
});