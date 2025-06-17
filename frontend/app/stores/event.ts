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
		const config = useRuntimeConfig();
		const url = `${config.public.backendBaseUrl}/api/eventos`;
		console.log('DEBUG: Backend Base URL:', config.public.backendBaseUrl);
		console.log('DEBUG: Fetching from URL:', url);
		
		const data = await $fetch(url);
		
		console.log('DEBUG: Raw data from $fetch:', data);

		if (!data) {
		  this.error = 'Error al cargar los eventos: No se recibieron datos'
		  console.error('Error fetching events: No data received')
		  return
		}
		
		console.log('Raw API response:', data)
		
		  let rawEvents: any[] = [];
		  
		  // Check if the response has the expected structure
		  if (Array.isArray(data)) {
			rawEvents = data as any[];
		  } else if (data && typeof data === 'object' && 'events' in data) {
			rawEvents = (data as any).events;
		  } else {
			console.warn('Unexpected data format for events:', data);
			this.events = [];
			return;
		  }
		  
		  console.log('Raw events before transformation:', rawEvents);
		  
		  this.events = rawEvents.map((e: any) => {
			const event = {
			  id: e.id,
			  anno: e.anno ?? e.year ?? 0,
			  titulo: e.titulo || e.title || '',
			  titulo_corto: e.tituloCorto || '',
			  clasificacion: e.clasificacion || e.classification?.id || e.classification || '',
			};
			console.log('Transformed event:', event);
			return event;
		  });
		  
		  console.log('Final transformed events:', this.events);
		} catch (err) {
		  this.error = err instanceof Error ? err.message : 'Error al cargar los eventos'
		console.error('Error fetching events:', err)
	  } finally {
		this.isLoading = false
	  }
	},
	
	async fetchEventById(id: string) {
	  console.log(`DEBUG: fetchEventById started for ID: ${id}. Setting isLoading to true.`);
	  this.isLoading = true
	  this.error = null
	  
	  try {
		const config = useRuntimeConfig();
		const url = `${config.public.backendBaseUrl}/api/eventos/${id}`;
		console.log(`DEBUG: fetchEventById fetching from URL: ${url}`);
		const data = await $fetch(url);
		
		console.log(`DEBUG: fetchEventById received data:`, data);
		if (!data) {
		  this.error = 'Evento no encontrado: No se recibieron datos'
		  console.warn(`DEBUG: fetchEventById no data for ID: ${id}`);
		  return null
		}
		
            const e: any = data;
            const fetchedEvent: Event = {
                id: e.id,
                anno: e.anno ?? e.year ?? 0,
                titulo: e.titulo || e.title,
                titulo_corto: e.tituloCorto,
                clasificacion: e.clasificacion || e.classification?.id || e.classification,
            };
		  this.currentEvent = fetchedEvent;
		  console.log(`DEBUG: fetchEventById successful for ID: ${id}. currentEvent set.`);
		  return fetchedEvent;
        } catch (err) {
		this.error = err instanceof Error ? err.message : 'Error al obtener el evento'
		console.error(`DEBUG: Error in fetchEventById for ID ${id}:`, err)
		return null
	  } finally {
		console.log(`DEBUG: fetchEventById finally block reached for ID: ${id}. Setting isLoading to false.`);
		this.isLoading = false
	  }
	},
	
	async createEvent(eventData: Omit<Event, 'clasificacion'> & { clasificacion: string }) {
	  this.isLoading = true
	  this.error = null
	  
	  try {
		const config = useRuntimeConfig();
		const url = `${config.public.backendBaseUrl}/api/eventos`;
		const data = await $fetch(url, {
		  method: 'POST',
		  body: {
			...eventData,
			clasificacion: eventData.clasificacion
		  }
		})
		
		if (!data) {
		  this.error = 'Error al crear el evento: No se recibieron datos'
		  return null
		}
		
            const e: any = data;
            const newEvent: Event = {
                id: e.id,
                anno: e.anno ?? e.year ?? 0,
                titulo: e.titulo || e.title,
                titulo_corto: e.tituloCorto,
                clasificacion: e.clasificacion || e.classification?.id || e.classification,
            };
		  this.events.push(newEvent);
		  return newEvent;
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
		const config = useRuntimeConfig();
		const url = `${config.public.backendBaseUrl}/api/eventos/${updatedEvent.id}`;
		const data = await $fetch(url, {
		  method: 'PUT',
		  body: updatedEvent
		})
		
		if (!data) {
		  this.error = 'Error al actualizar el evento: No se recibieron datos'
		  return null
		}
		
		const e: any = data;
		const updated: Event = {
		  id: e.id,
		  anno: e.anno ?? e.year ?? 0,
		  titulo: e.titulo || e.title,
		  titulo_corto: e.tituloCorto,
		  clasificacion: e.clasificacion || e.classification?.id || e.classification,
		};
		const index = this.events.findIndex(e => e.id === updated.id)
		if (index !== -1) {
		  this.events[index] = updated;
		}
		this.currentEvent = updated;
		return updated;
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
		const config = useRuntimeConfig();
		const url = `${config.public.backendBaseUrl}/api/eventos/${id}`;
		const data = await $fetch(url, {
		  method: 'DELETE'
		})
		
		if (!data) {
		  this.error = 'Error al eliminar el evento: No se recibieron datos'
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