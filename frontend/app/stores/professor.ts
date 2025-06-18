// stores/professor.ts
import { defineStore } from 'pinia';
import { useFetch } from '#app';
import type { Professors } from "~/models/Professors";

export const useProfessorStore = defineStore( 'professorStore', {
	state : () => ( {
	  professors : [] as Professors[],
	  currentProfessor : null as Professors | null,
	  isLoading : false,
	  error : null as string | null,
	} ),
	
	getters : {
	  getProfessorById : ( state ) => ( id : string ) => {
		return state.professors.find( ( p : Professors ) => p.id === id );
	  },
	  getProfessorsByCategory : ( state ) => ( category : string ) => {
		return state.professors.filter( p => p.categoriaDocente === category );
	  },
	  getProfessorsByDegree : ( state ) => ( degree : string ) => {
		return state.professors.filter( p => p.gradoCientifico === degree );
	  },
	  getProfessorsByExperience : ( state ) => ( minYears : number ) => {
		return state.professors.filter( p => p.annosExperienciaCarrera >= minYears );
	  },
	  sortedProfessors : ( state ) => {
		return [...state.professors].sort( ( a, b ) =>
		  a.primerApellido.localeCompare( b.primerApellido ) ||
		  a.nombre.localeCompare( b.nombre )
		);
	  },
	  fullNames : ( state ) => {
		return state.professors.map( p =>
		  `${ p.nombre } ${ p.primerApellido }${ p.segundoApellido ? ' ' + p.segundoApellido : '' }`
		);
	  },
	},
	
	actions : {
	  async fetchProfessors() {
		this.isLoading = true;
		this.error = null;
		
		try {
		  const config = useRuntimeConfig();
		  const url = `/api/profesores`;
		  console.log('Fetching professors from:', url);
		  console.log('Config:', config.public);

		  const response = await $fetch<Professors[]>(url, {
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json',
			},
			onResponse({ response }) {
			  console.log('Response status:', response.status);
			  console.log('Response headers:', response.headers);
			  console.log('Raw response:', response._data);
			},
			onResponseError({ request, response, options }) {
			  console.error('Request error:', request);
			  console.error('Response error:', response);
			  console.error('Options:', options);
			}
		  });
		  
		  console.log('Professors response:', response);

		  if (Array.isArray(response)) {
			console.log('Processing array response:', response);
			this.professors = response.map((p: any) => {
			  console.log('Processing professor:', p);
			  console.log('DEBUG_STORE: p.categoriaDocente:', p.categoriaDocente);
			  console.log('DEBUG_STORE: p.gradoCientifico:', p.gradoCientifico);
			  console.log('DEBUG_STORE: p.correos:', p.correos);
			  console.log('DEBUG_STORE: p.telefonos:', p.telefonos);
			  return {
				id: p.id,
				nombre: p.nombre,
				primerApellido: p.primerApellido,
				segundoApellido: p.segundoApellido,
				annosExperienciaCarrera: p.annosExperienciaCarrera,
				annosExperienciaMes: p.annosExperienciaMes,
				categoriaDocente: p.categoriaDocente,
				gradoCientifico: p.gradoCientifico,
				correos: p.correos || [],
				telefonos: p.telefonos || [],
				drEspecialidadAfin: p.drEspecialidadAfin ?? null,
			  };
			});
			console.log('Final professors array:', this.professors);
		  } else {
			console.error('Invalid response format:', response);
			this.error = 'Formato de respuesta inválido';
		  }
		} catch ( err ) {
		  console.error('Detailed error:', err);
		  this.error = err instanceof Error ? err.message : 'Error al cargar profesores';
		  console.error( 'Error fetching professors:', err );
		} finally {
		  this.isLoading = false;
		}
	  },
      
      async fetchProfessorById(id: string) {
        this.isLoading = true;
        this.error = null;
        try {
		  const config = useRuntimeConfig();
		  const url = `/api/profesores/${id}`;
		  console.log('Fetching professor by ID from:', url);

          const response = await $fetch<Professors>(url);

          if (response) {
            const p: any = response;
            const fetchedProfessor: Professors = {
              id: p.id,
              nombre: p.nombre,
              primerApellido: p.primerApellido,
              segundoApellido: p.segundoApellido,
              annosExperienciaCarrera: p.annosExperienciaCarrera,
              annosExperienciaMes: p.annosExperienciaMes,
              categoriaDocente: p.categoriaDocente,
              gradoCientifico: p.gradoCientifico,
              correos: p.correos || [],
              telefonos: p.telefonos || [],
              drEspecialidadAfin: p.drEspecialidadAfin ?? null,
            };
            this.currentProfessor = fetchedProfessor;
            return fetchedProfessor;
          }
          return null;
        } catch (err) {
		  console.error('Detailed error:', err);
          this.error = err instanceof Error ? err.message : 'Error al obtener el profesor';
          console.error(`Error fetching professor ${id}:`, err);
          return null;
        } finally {
          this.isLoading = false;
        }
      },

	  async createProfessor(professorData: Omit<Professors, 'id'>) {
		this.isLoading = true;
		this.error = null;
		
		try {
		  const config = useRuntimeConfig();
		  const url = `/api/profesores`;
		  console.log('Creating professor at:', url);

		  const response = await $fetch<Professors>(url, {
			method: 'POST',
			body: professorData,
		  });
		  
		  if (response) {
			const newProfessor: Professors = {
			  id: response.id,
			  nombre: response.nombre,
			  primerApellido: response.primerApellido,
			  segundoApellido: response.segundoApellido,
			  annosExperienciaCarrera: response.annosExperienciaCarrera,
			  annosExperienciaMes: response.annosExperienciaMes,
			  categoriaDocente: response.categoriaDocente,
			  gradoCientifico: response.gradoCientifico,
			  correos: response.correos || [],
			  telefonos: response.telefonos || [],
			  drEspecialidadAfin: response.drEspecialidadAfin ?? null,
			};
			this.professors.push(newProfessor);
			return newProfessor; 
		  }
          return null;
		} catch (err) {
		  console.error('Detailed error:', err);
		  this.error = err instanceof Error ? err.message : 'Error al crear profesor';
		  console.error( 'Error creating professor:', err );
		  return null;
		} finally {
		  this.isLoading = false;
		}
	  },
	  
	  async updateProfessor(updatedProfessor: Professors) {
		this.isLoading = true;
		this.error = null;
		
		try {
		  const config = useRuntimeConfig();
		  const url = `/api/profesores/${updatedProfessor.id}`;
		  console.log('Updating professor at:', url);

		  const response = await $fetch<Professors>(url, {
			method: 'PATCH',
			body: updatedProfessor,
		  });
		  
		  if (response) {
			const updated: Professors = {
			  id: response.id,
			  nombre: response.nombre,
			  primerApellido: response.primerApellido,
			  segundoApellido: response.segundoApellido,
			  annosExperienciaCarrera: response.annosExperienciaCarrera,
			  annosExperienciaMes: response.annosExperienciaMes,
			  categoriaDocente: response.categoriaDocente,
			  gradoCientifico: response.gradoCientifico,
			  correos: response.correos || [],
			  telefonos: response.telefonos || [],
			  drEspecialidadAfin: response.drEspecialidadAfin ?? null,
			};
			const index = this.professors.findIndex(p => p.id === updated.id);
			if (index !== -1) {
			  (this.professors as Professors[])[index] = updated;
			}
			this.currentProfessor = updated; 
			return updated;
		  }
          return null;
		} catch (err) {
		  console.error('Detailed error:', err);
		  this.error = err instanceof Error ? err.message : 'Error de red al actualizar';
		  console.error( 'Error inesperado al actualizar:', err );
		  return null;
		} finally {
		  this.isLoading = false;
		}
	  },
	  
	  async deleteProfessor( id : string ) {
		this.isLoading = true;
		this.error = null;
		
		try {
		  const config = useRuntimeConfig();
		  const url = `/api/profesores/${ id }`;
		  console.log('Deleting professor from:', url);

		  await $fetch(url, {
			method : 'DELETE',
		  } );
		  
		  this.professors = this.professors.filter( p => p.id !== id );
		  return true;
		} catch ( err ) {
		  console.error('Detailed error:', err);
		  this.error = err instanceof Error ? err.message : 'Error de conexión al eliminar';
		  console.error( 'Error inesperado:', err );
		  return false;
		} finally {
		  this.isLoading = false;
		}
	  },
	  
	  
	  setCurrentProfessor( professor : Professors | null ) {
		this.currentProfessor = professor;
	  },
	  
	  clearCurrentProfessor() {
		this.currentProfessor = null;
	  },
	  
	  clearError() {
		this.error = null;
	  },
	  
	  async fetchProfessorsByCategory( category : string ) {
		this.isLoading = true;
		
		try {
		  const config = useRuntimeConfig();
		  const url = `/api/profesores/category/${ category }`;
		  console.log('Fetching professors by category from:', url);

		  const { data, error } = await useFetch( url );
		  
		  if ( error.value ) {
			throw new Error( error.value.message || 'Error al filtrar por categoría' );
		  }
		  
		  return data.value || [];
		} catch ( err ) {
		  this.error = err instanceof Error ? err.message : 'Error al filtrar por categoría';
		  console.error( 'Error filtering careers by year:', err );
		  return [];
		} finally {
		  this.isLoading = false;
		}
	  },
	},
  }
); 