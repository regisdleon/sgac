import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useAcademicPeriodsStore = defineStore('academicPeriods', {
  state: () => ({
    periods: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchPeriods() {
      const authStore = useAuthStore()
      this.loading = true
      this.error = null
      try {
        const response = await fetch(`${process.env.NUXT_PUBLIC_API_BASE_URL}/api/academic-periods/`, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        if (!response.ok) throw new Error('Error al cargar los períodos académicos')
        this.periods = await response.json()
      } catch (error) {
        this.error = error.message
        console.error('Error fetching periods:', error)
      } finally {
        this.loading = false
      }
    },

    async createPeriod(periodData) {
      const authStore = useAuthStore()
      this.loading = true
      this.error = null
      try {
        const response = await fetch(`${process.env.NUXT_PUBLIC_API_BASE_URL}/api/academic-periods/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          },
          body: JSON.stringify(periodData)
        })
        if (!response.ok) throw new Error('Error al crear el período académico')
        const newPeriod = await response.json()
        this.periods.push(newPeriod)
        return newPeriod
      } catch (error) {
        this.error = error.message
        console.error('Error creating period:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updatePeriod(id, periodData) {
      const authStore = useAuthStore()
      this.loading = true
      this.error = null
      try {
        const response = await fetch(`${process.env.NUXT_PUBLIC_API_BASE_URL}/api/academic-periods/${id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          },
          body: JSON.stringify(periodData)
        })
        if (!response.ok) throw new Error('Error al actualizar el período académico')
        const updatedPeriod = await response.json()
        const index = this.periods.findIndex(p => p.id === id)
        if (index !== -1) {
          this.periods[index] = updatedPeriod
        }
        return updatedPeriod
      } catch (error) {
        this.error = error.message
        console.error('Error updating period:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deletePeriod(id) {
      const authStore = useAuthStore()
      this.loading = true
      this.error = null
      try {
        const response = await fetch(`${process.env.NUXT_PUBLIC_API_BASE_URL}/api/academic-periods/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        if (!response.ok) throw new Error('Error al eliminar el período académico')
        this.periods = this.periods.filter(p => p.id !== id)
      } catch (error) {
        this.error = error.message
        console.error('Error deleting period:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 