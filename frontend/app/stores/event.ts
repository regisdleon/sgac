import { defineStore } from 'pinia'
import { useFetch } from '#app'
import type { Event } from '~/models/Event'

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
	  { id: 'DE_BASE', classification: 'De Base' }
	]
  }),
  
  getters: {
	getEventById: (state) => (id: string) => {
	  return state.events.find((e: Event) => e.id === id)
	},
	getEventsByYear: (state) => (anno: number) => {
	  return state.events.filter(e => e.anno === anno)
	},
	getEventsByClassification: (state) => (clasificacion: string) => {
	  return state.events.filter(e => e.clasificacion === clasificacion)
	},
	sortedEvents: (state) => {
	  return [...state.events].sort((a, b) => (a.anno ?? 0) - (b.anno ?? 0) || a.titulo.localeCompare(b.titulo))
	},
	availableYears: (state) => {
	  return [...new Set(state.events.map(e => e.anno).filter(Boolean))].sort((a,b) => a - b)
	},
	searchEvents(state) {
        return (query: string) => {
            const lowerQuery = query.toLowerCase()
            return state.events.filter(e =>
                e.titulo.toLowerCase().includes(lowerQuery) || 
                e.titulo_corto.toLowerCase().includes(lowerQuery) 
            )
        }
    }
  },
  
  actions: {
	async fetchEvents() {
	  this.isLoading = true
	  this.error = null
	  
	  try {
		const { data, error } = await useFetch('/api/events')
		
		if (error.value) {
		  this.error = error.value.message || 'Error al cargar los eventos'
		  return
		}
		
        if (data.value) {
            let rawEvents: any[] = [];
            if ('events' in data.value && Array.isArray((data.value as any).events)) {
                rawEvents = (data.value as any).events;
            } else if (Array.isArray(data.value)) {
                rawEvents = data.value as any[];
            }
            
            this.events = rawEvents.map((e: any) => ({
              id: e.id,
              anno: e.anno ?? e.year ?? 0,
              titulo: e.titulo || e.title,
              titulo_corto: e.titulo_corto || e.short_title || e.shortTitle,
              clasificacion: e.clasificacion || e.classification?.id || e.classification,
            }));
          } else {
            console.warn('Unexpected data format for events:', data.value);
            this.events = [];
          }
	  } catch (err) {
		this.error = err instanceof Error ? err.message : 'Error al cargar los eventos'
		console.error('Error fetching events:', err)
	  } finally {
		this.isLoading = false
	  }
	},
	
	async fetchEventById(id: string) {
	  this.isLoading = true
	  this.error = null
	  
	  try {
		const { data, error } = await useFetch(`/api/events/${id}`)
		
		if (error.value) {
		  this.error = error.value.message || 'Evento no encontrado'
		  return null
		}
		
		if (data.value) {
            const e: any = data.value;
            const fetchedEvent: Event = {
                id: e.id,
                anno: e.anno ?? e.year ?? 0,
                titulo: e.titulo || e.title,
                titulo_corto: e.titulo_corto || e.short_title || e.shortTitle,
                clasificacion: e.clasificacion || e.classification?.id || e.classification,
            };
		  this.currentEvent = fetchedEvent;
		  return fetchedEvent;
        }
        return null;
	  } catch (err) {
		this.error = err instanceof Error ? err.message : 'Error al obtener el evento'
		console.error(`Error fetching event ${id}:`, err)
		return null
	  } finally {
		this.isLoading = false
	  }
	},
	
	async createEvent(eventData: Omit<Event, 'clasificacion'> & { clasificacion: string }) {
	  this.isLoading = true
	  this.error = null
	  
	  try {
		const { data, error } = await useFetch('/api/events', {
		  method: 'POST',
		  body: {
			...eventData,
			clasificacion: eventData.clasificacion
		  }
		})
		
		if (error.value) {
		  this.error = error.value.message || 'Error al crear el evento'
		  return null
		}
		
		if (data.value) {
            const e: any = data.value;
            const newEvent: Event = {
                id: e.id,
                anno: e.anno ?? e.year ?? 0,
                titulo: e.titulo || e.title,
                titulo_corto: e.titulo_corto || e.short_title || e.shortTitle,
                clasificacion: e.clasificacion || e.classification?.id || e.classification,
            };
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
	
	async updateEvent(updatedEvent: Event) {
	  this.isLoading = true
	  this.error = null
	  
	  try {
		const { data, error } = await useFetch(`/api/events/${updatedEvent.id}`, {
		  method: 'PATCH',
		  body: updatedEvent
		})
		
		if (error.value) {
		  this.error = error.value.message || 'Error al actualizar el evento'
		  return null
		}
		
		if (data.value) {
            const e: any = data.value;
            const updated: Event = {
                id: e.id,
                anno: e.anno ?? e.year ?? 0,
                titulo: e.titulo || e.title,
                titulo_corto: e.titulo_corto || e.short_title || e.shortTitle,
                clasificacion: e.clasificacion || e.classification?.id || e.classification,
            };
		  const index = this.events.findIndex(e => e.id === updated.id)
		  if (index !== -1) {
			this.events[index] = updated;
		  }
		  this.currentEvent = updated;
		  return updated;
		}
        return null;
	  } catch (err) {
		this.error = err instanceof Error ? err.message : 'Error al actualizar el evento'
		console.error(`Error updating event ${updatedEvent.id}:`, err)
		return null
	  } finally {
		this.isLoading = false
	  }
	},
	
	async deleteEvent(id: string) {
	  this.isLoading = true
	  this.error = null
	  
	  try {
		const { error } = await useFetch(`/api/events/${id}`, {
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
	
	setCurrentEvent(event: Event | null) {
	  this.currentEvent = event
	},
	clearCurrentEvent() {
	  this.currentEvent = null
	},
	clearError() {
	  this.error = null
	}
  },
}); 