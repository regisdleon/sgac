// stores/discipline.ts
import { defineStore } from 'pinia'
import type { Discipline } from "~/models/Discipline";

export const useDisciplineStore = defineStore( 'disciplineStore', {
  state : () => ( {
	disciplines : [] as Discipline[],
	currentDiscipline : null as Discipline | null,
	isLoading : false,
	error : null as string | null,
  } ),
  
  getters : {
	getDisciplineById : ( state ) => ( id : number ) => {
	  return state.disciplines.find( ( d : Discipline ) => d.id === id );
	},
	sortedDisciplines : ( state ) => {
	  return [...state.disciplines].sort( ( a, b ) => a.nombre.localeCompare( b.nombre ) );
	},
  },
  
  actions : {
	/**
	 * Obtiene todas las disciplinas desde el backend para una carrera específica
	 */
	async fetchDisciplines(carreraId?: number) {
	  this.isLoading = true;
	  this.error = null;
	  
	  // Si no hay carreraId, no hay disciplinas que buscar para una carrera específica
	  if (!carreraId) {
		this.disciplines = [];
		this.isLoading = false;
		return;
	  }

	  try {
		const config = useRuntimeConfig();
		const url = `/api/carreras/${carreraId}/disciplinas`;

		console.log('Fetching disciplines from:', url);

		const response = await $fetch<Discipline[]>(url, {
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		  },
		  onResponse({ response }) {
			console.log('Response status for fetchDisciplines:', response.status);
			console.log('Response body for fetchDisciplines:', response._data);
		  },
		  onResponseError({ response }) {
			console.error('Response error for fetchDisciplines:', response);
		  }
		});
		
		console.log('Disciplines response raw:', response);
		if (Array.isArray(response)) {
		  this.disciplines = response;
		} else if (response && typeof response === 'object' && 'disciplines' in response) {
        // Manejar caso donde la respuesta es { disciplines: [] }
        this.disciplines = (response as { disciplines: Discipline[] }).disciplines;
      }else {
		  console.error('Invalid response format for disciplines:', response);
		  this.error = 'Formato de respuesta inválido para disciplinas';
		}
	  } catch (err: any) {
		this.error = err.message || 'Error al obtener las disciplinas';
		console.error( 'Error fetching disciplines:', err );
	  } finally {
		this.isLoading = false;
	  }
	},
	
	/**
	 * Obtiene una disciplina específica por ID
	 */
	async fetchDisciplineById( id : number, carreraId: number ) {
	  this.isLoading = true;
	  this.error = null;
	  
	  try {
		const config = useRuntimeConfig();
		const response = await $fetch<Discipline>(`/api/carreras/${carreraId}/disciplinas/${id}`);
		this.currentDiscipline = response;
		return response;
	  } catch ( err: any ) {
		this.error = err.message || 'Error al obtener disciplinas';
		console.error( `Error fetching discipline ${ id }:`, err );
		return null;
	  } finally {
		this.isLoading = false;
	  }
	},
	
	/**
	 * Crea una nueva disciplina
	 */
	async createDiscipline( disciplineData : Omit<Discipline, 'id'>, carreraId: number ) {
	  this.isLoading = true;
	  this.error = null; // Limpiar errores previos
	  
	  try {
		const config = useRuntimeConfig();
		const url = `/api/carreras/${carreraId}/disciplinas`;
		console.log('Sending discipline data to:', url, disciplineData);

		const response = await $fetch( url, {
		  method : 'POST',
		  body : disciplineData,
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		  },
		  onResponse({ response }) {
			console.log('Response status:', response.status);
			console.log('Response body:', response._data);
		  },
		  onResponseError({ response }) {
			console.error('Response error details:', response);
		  }
		} );
		
		this.disciplines.push( response as Discipline );
		await this.fetchDisciplines(carreraId); // Pasar carreraId al recargar
		return response;
		
	  } catch ( err: any ) {
		let errorMessage = 'Error al crear la disciplina';
		if (err.response && err.response._data) {
		  try {
			errorMessage = JSON.stringify(err.response._data, null, 2);
		  } catch (e) {
			errorMessage = err.response._data.message || err.response._data || errorMessage;
		  }
		} else if (err.data?.message) {
		  errorMessage = err.data.message;
		} else if (err.message) {
		  errorMessage = err.message;
		}
		this.error = errorMessage;
		console.error( 'Error creating discipline:', err.response?._data || err );
		return null;
	  } finally {
		this.isLoading = false;
	  }
	},
	
	/**
	 * Actualiza una disciplina existente
	 */
	async updateDiscipline( updatedDiscipline : Discipline, carreraId: number ) {
	  this.isLoading = true;
	  
	  try {
		const config = useRuntimeConfig();
		const response = await $fetch<Discipline>(`/api/carreras/${carreraId}/disciplinas/${ updatedDiscipline.id }`, {
		  method : 'PATCH',
		  body : updatedDiscipline,
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		  },
		  onResponse({ response }) {
			console.log('Response status for updateDiscipline:', response.status);
			console.log('Response body for updateDiscipline:', response._data);
		  },
		  onResponseError({ response }) {
			console.error('Response error for updateDiscipline:', response);
		  }
		} );
		
		  const index = this.disciplines.findIndex( d => d.id === updatedDiscipline.id );
		  if ( index !== -1 ) {
			this.disciplines[ index ] = response as Discipline;
		  }
		  this.currentDiscipline = response as Discipline;
		  return response;
		
	  } catch ( err: any ) {
		this.error = err.message || 'Error al actualizar la disciplina';
		console.error( `Error updating discipline ${ updatedDiscipline.id }:`, err );
		return null;
	  } finally {
		this.isLoading = false;
	  }
	},
	
	/**
	 * Elimina una disciplina
	 */
	async deleteDiscipline( id : number, carreraId: number ) {
	  this.isLoading = true;
	  this.error = null;
	  
	  try {
		const config = useRuntimeConfig();
		const url = `/api/carreras/${carreraId}/disciplinas/${id}`;
		console.log('Deleting discipline from:', url);

		await $fetch( url, {
		  method : 'DELETE',
		  onResponse({ response }) {
			console.log('Response status for deleteDiscipline:', response.status);
		  },
		  onResponseError({ response }) {
			console.error('Response error for deleteDiscipline:', response);
		  }
		} );
		
		this.disciplines = this.disciplines.filter( d => d.id !== id );
		return true;
	  } catch ( err: any ) {
		this.error = err.message || 'Error al eliminar la disciplina';
		console.error( 'Error deleting discipline:', err );
		return false;
	  } finally {
		this.isLoading = false;
	  }
	},
	
	/**
	 * Establece la disciplina actualmente seleccionada
	 */
	setCurrentDiscipline( discipline : Discipline | null ) {
	  this.currentDiscipline = discipline;
	},
	
	/**
	 * Limpia la disciplina actualmente seleccionada
	 */
	clearCurrentDiscipline() {
	  this.currentDiscipline = null;
	},
	
	/**
	 * Limpia el error actual
	 */
	clearError() {
	  this.error = null;
	},
  },
} );