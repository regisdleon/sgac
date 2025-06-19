// stores/event.ts
import { defineStore } from 'pinia'
import type { Event } from '~/models/Event'
import type { Professors } from '~/models/Professors'

export const useEventStore = defineStore('eventStore', {
  state: () => ({
	events: [] as Event[],
	currentEvent: null as Event | null,
	isLoading: false,
	error: null as string | null,
	classifications: [
	  { id: 'INTERNACIONAL', classification: 'Internacional' },
	  { id: 'NACIONAL', classification: 'Nacional' },
	  { id: 'PROVINCIAL', classification: 'Provincial' },
	  { id: 'MUNICIPAL', classification: 'Municipal' },
	  { id: 'DE_BASE', classification: 'De base' }
	]
  }),
  
  getters: {
	getEventById: (state) => (id: string) => {
	  return state.events.find((e: Event) => e.id === id)
	},
	getEventsByYear: (state) => (year: string) => {
	  return state.events.filter(e => e.anno === parseInt(year))
	},
	getEventsByClassification: (state) => (classificationValue: string) => {
	  return state.events.filter(e => e.clasificacion === classificationValue)
	},
	sortedEvents: (state) => {
	  return [...state.events].sort((a, b) => a.anno - b.anno || a.titulo.localeCompare(b.titulo))
	},
	availableYears: (state) => {
	  return [...new Set(state.events.map(e => e.anno))].sort()
	}
  },
  
  actions: {
	/**
	 * Carga todos los eventos desde el backend
	 */
	async fetchEvents() {
	  this.isLoading = true
	  this.error = null
	  
	  try {
		const { data, error } = await useFetch<Event[]>('/api/eventos/')

		if (error.value) {
		  this.error = error.value.message || 'Error al cargar los eventos'
		  this.events = []
		  return
		}

		// Asignación directa. La data ya debería coincidir con la interfaz Event[].
		this.events = data.value || []

	  } catch (err) {
		this.error = err instanceof Error ? err.message : 'Error de conexión'
		this.events = []
		console.error('Error fetching events:', err)
	  } finally {
		this.isLoading = false
	  }
	},
	
	/**
	 * Obtiene un evento específico por ID
	 */
	async fetchEventById(id: string) {
	  this.isLoading = true
	  this.error = null
	  
	  try {
		const { data, error } = await useFetch(`/api/eventos/${id}`)
		
		if (error.value) {
		  this.error = error.value.message || 'Evento no encontrado'
		  return null
		}
		
		this.currentEvent = data.value as Event
		return data.value
	  } catch (err) {
		this.error = err instanceof Error ? err.message : 'Error al obtener el evento'
		console.error(`Error fetching event ${id}:`, err)
		return null
	  } finally {
		this.isLoading = false
	  }
	},
	
	/**
	 * Crea un nuevo evento
	 */
	async createEvent(eventData: Omit<Event, 'id'>) {
	  console.log('Creating event with data:', eventData);
	  this.isLoading = true
	  this.error = null
	  
	  try {
		const { data, error } = await useFetch('/api/eventos', {
		  method: 'POST',
		  body: eventData
		})
		
		console.log('Create event response:', data.value);
		console.log('Create event error:', error.value);
		
		if (error.value) {
          this.error = error.value.message || 'Error al crear el evento';
		  return null;
		}
		
		if (data.value) {
		  type Clasificacion = 'INTERNACIONAL' | 'NACIONAL' | 'PROVINCIAL' | 'MUNICIPAL' | 'DE_BASE';
		  type BackendSingleEvent = {
			id: string;
			anno: number;
			titulo: string;
			titulo_corto?: string;
			tituloCorto?: string;
			clasificacion: Clasificacion;
			profesor_id?: string;
			profesor?: any;
		  };
		  const responseData = data.value as BackendSingleEvent;
		  
		  const newEvent: Event = {
			id: responseData.id,
			anno: responseData.anno,
			titulo: responseData.titulo,
			titulo_corto: responseData.titulo_corto || responseData.tituloCorto || 'N/A',
			clasificacion: responseData.clasificacion,
			profesor_id: responseData.profesor_id,
			profesor: responseData.profesor
		  };
		  console.log('Adding new event to store:', newEvent);
		  this.events.push(newEvent);
		  return newEvent;
		}
		return null;
	  } catch (err) {
		this.error = err instanceof Error ? err.message : 'Error al crear el evento'
		console.error('Error creating event:', err)
		return null
	  } finally {
		this.isLoading = false
	  }
	},
	
	/**
	 * Actualiza un evento existente
	 */
	async updateEvent(updatedEvent: Event) {
	  this.isLoading = true
	  this.error = null
	  
	  try {
		const { data, error } = await useFetch(`/api/eventos/${updatedEvent.id}`, {
		  method: 'PATCH',
		  body: updatedEvent
		})
		
		if (error.value) {
		  this.error = error.value.message || 'Error al actualizar el evento'
		  return null
		}
		
		if (data.value) {
		  const index = this.events.findIndex(e => e.id === updatedEvent.id)
		  if (index !== -1) {
			this.events[index] = data.value as Event
		  }
		  this.currentEvent = data.value as Event
		  return data.value
		}
	  } catch (err) {
		this.error = err instanceof Error ? err.message : 'Error al actualizar el evento'
		console.error(`Error updating event ${updatedEvent.id}:`, err)
		return null
	  } finally {
		this.isLoading = false
	  }
	},
	
	/**
	 * Elimina un evento
	 */
	async deleteEvent(id: string) {
	  this.isLoading = true
	  this.error = null
	  
	  try {
		const { error } = await useFetch(`/api/eventos/${id}`, {
		  method: 'DELETE'
		})
		
		if (error.value) {
		  this.error = error.value.message || 'Error al eliminar el evento'
		  return false
		}
		
		this.events = this.events.filter(e => e.id !== id)
		
		if (this.currentEvent?.id === id) {
		  this.currentEvent = null
		}
		
		return true
	  } catch (err) {
		this.error = err instanceof Error ? err.message : 'Error al eliminar el evento'
		console.error(`Error deleting event ${id}:`, err)
		return false
	  } finally {
		this.isLoading = false
	  }
	},
	
	/**
	 * Establece el evento actual
	 */
	setCurrentEvent(event: Event | null) {
	  this.currentEvent = event
	},
	
	/**
	 * Limpia el evento actual
	 */
	clearCurrentEvent() {
	  this.currentEvent = null
	},
	
	/**
	 * Limpia los errores
	 */
	clearError() {
	  this.error = null
	},
	
	/**
	 * Busca eventos por título o descripción
	 */
	searchEvents(query: string) {
	  const lowerQuery = query.toLowerCase()
	  return this.events.filter(e =>
		e.titulo.toLowerCase().includes(lowerQuery)
	  )
	}
  }
})