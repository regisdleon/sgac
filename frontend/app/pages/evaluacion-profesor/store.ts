import { defineStore } from 'pinia';
import type { Evaluation } from '~/models/Evaluation';

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
        // Ajusta la URL según tu backend
        const data = await $fetch('/api/profesorevaluacion');
        this.evaluations = Array.isArray(data) ? data : [];
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
        const data = await $fetch('/api/profesorevaluacion', {
          method: 'POST',
          body: evaluation,
        });
        this.evaluations.push(data as Evaluation);
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
        const data = await $fetch(`/api/profesorevaluacion/${evaluation.id}`, {
          method: 'PATCH',
          body: evaluation,
        });
        const idx = this.evaluations.findIndex(e => e.id === evaluation.id);
        if (idx !== -1) this.evaluations[idx] = data as Evaluation;
        return data;
      } catch (err: any) {
        this.error = err.message || 'Error al actualizar la evaluación';
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteEvaluation(id: string) {
      this.isLoading = true;
      this.error = null;
      try {
        await $fetch(`/api/profesorevaluacion/${id}`, { method: 'DELETE' });
        this.evaluations = this.evaluations.filter(e => e.id !== id);
        return true;
      } catch (err: any) {
        this.error = err.message || 'Error al eliminar la evaluación';
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    setCurrentEvaluation(evaluation: Evaluation | null) {
      this.currentEvaluation = evaluation;
    },
    clearCurrentEvaluation() {
      this.currentEvaluation = null;
    },
    clearError() {
      this.error = null;
    },
  },
}); 