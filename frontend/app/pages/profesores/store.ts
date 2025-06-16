// stores/professor.ts
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
		return state.professors.filter( p => p.scientificCategory === category );
	  },
	  getProfessorsByDegree : ( state ) => ( degree : string ) => {
		return state.professors.filter( p => p.scientificDegree === degree );
	  },
	  getProfessorsByExperience : ( state ) => ( minYears : number ) => {
		return state.professors.filter( p => p.experienceYears >= minYears );
	  },
	  sortedProfessors : ( state ) => {
		return [...state.professors].sort( ( a, b ) =>
		  a.lastName.localeCompare( b.lastName ) ||
		  a.name.localeCompare( b.name )
		);
	  },
	  fullNames : ( state ) => {
		return state.professors.map( p =>
		  `${ p.name } ${ p.lastName }${ p.secondLastName ? ' ' + p.secondLastName : '' }`
		);
	  },
	},
	
	actions : {
	  /**
	   * Obtiene todos los profesores
	   */
	  async fetchProfessors() {
		this.isLoading = true;
		this.error = null;
		
		try {
		  const { data, error } = await useFetch( '/api/professors' );
		  
		  if ( error.value ) {
			this.error = error.value.message || 'Error al cargar profesores';
		  } else {
			this.professors = data.value?.professors || [];
		  }
		} catch ( err ) {
		  // Esto captura errores de conexión u otros inesperados
		  this.error = 'Error de conexión con el servidor';
		  console.error( 'Error inesperado:', err );
		} finally {
		  this.isLoading = false;
		}
	  },
	  
	  /**
	   * Crea un nuevo profesor
	   */
	  async createProfessor( professorData : Omit<Professors, 'id'> ) {
		this.isLoading = true;
		this.error = null;
		
		try {
		  const { data, error } = await useFetch( '/api/professors', {
			method : 'POST',
			body : professorData,
		  } );
		  
		  if ( error.value ) {
			this.error = error.value.message || 'Error al crear profesor';
		  } else if ( data.value ) {
			this.professors.push( data.value as Professors );
			return data.value; // Retorna el profesor creado
		  }
		} catch ( err ) {
		  this.error = 'Error al conectar con el servidor';
		  console.error( 'Error inesperado:', err );
		  return null;
		} finally {
		  this.isLoading = false;
		}
	  },
	  
	  /**
	   * Actualiza un profesor existente
	   */
	  async updateProfessor( updatedProfessor : Professors ) {
		this.isLoading = true;
		this.error = null;
		
		try {
		  const { data, error } = await useFetch( `/api/professors/${ updatedProfessor.id }`, {
			method : 'PATCH',
			body : updatedProfessor,
		  } );
		  
		  if ( error.value ) {
			this.error = error.value.message || 'Error al actualizar profesor';
		  } else if ( data.value ) {
			const index = this.professors.findIndex( p => p.id === updatedProfessor.id );
			if ( index !== -1 ) {
			  ( this.professors as Professors[] )[ index ] = data.value as Professors;
			}
			return data.value;
		  }
		} catch ( err ) {
		  this.error = 'Error de red al actualizar';
		  console.error( 'Error inesperado:', err );
		  return null;
		} finally {
		  this.isLoading = false;
		}
	  },
	  
	  /**
	   * Elimina un profesor
	   */
	  async deleteProfessor( id : string ) {
		this.isLoading = true;
		this.error = null;
		
		try {
		  const { error } = await useFetch( `/api/professors/${ id }`, {
			method : 'DELETE',
		  } );
		  
		  if ( error.value ) {
			this.error = error.value.message || 'Error al eliminar profesor';
			return false;
		  } else {
			this.professors = this.professors.filter( p => p.id !== id );
			if ( this.currentProfessor?.id === id ) {
			  this.currentProfessor = null;
			}
			return true;
		  }
		} catch ( err ) {
		  this.error = 'Error de conexión al eliminar';
		  console.error( 'Error inesperado:', err );
		  return false;
		} finally {
		  this.isLoading = false;
		}
	  },
	  
	  
	  /**
	   * Establece el profesor actual (para edición)
	   */
	  setCurrentProfessor( professor : Professors | null ) {
		this.currentProfessor = professor;
	  },
	  
	  /**
	   * Limpia el profesor actual
	   */
	  clearCurrentProfessor() {
		this.currentProfessor = null;
	  },
	  
	  /**
	   * Limpia los errores
	   */
	  clearError() {
		this.error = null;
	  },
	  
	  /**
	   * Obtiene profesores por categoría científica
	   */
	  async fetchProfessorsByCategory( category : string ) {
		this.isLoading = true;
		
		try {
		  const { data, error } = await useFetch( `/professors/category/${ category }` );
		  
		  if ( error.value ) {
			throw new Error( error.value.message || 'Error al filtrar por categoría' );
		  }
		  
		  return data.value || [];
		} catch ( err ) {
		  this.error = err instanceof Error ? err.message : 'Error al filtrar por categoría';
		  console.error( 'Error fetching professors by category:', err );
		  return [];
		} finally {
		  this.isLoading = false;
		}
	  },
	},
  }
);