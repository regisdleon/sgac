// stores/publication.ts
import type { Publication } from "~/models/Publication";

export const usePublicationStore = defineStore( 'publicationStore', {
  state : () => ( {
	publications : [] as Publication[],
	currentPublication : null as Publication | null,
	isLoading : false,
	error : null as string | null,
  } ),
  
  getters : {
	getPublicationById : ( state ) => ( id : string ) => {
	  return state.publications.find( ( p : Publication ) => p.id === id );
	},
	getPublicationsByYear : ( state ) => ( year : string ) => {
	  return state.publications.filter( p => p.year === year );
	},
	getPublicationsByType : ( state ) => ( type : string ) => {
	  return state.publications.filter( p => p.type === type );
	},
	getPublicationsByLevel : ( state ) => ( level : string ) => {
	  return state.publications.filter( p => p.level === level );
	},
	getPublicationsByDatabase : ( state ) => ( database : string ) => {
	  return state.publications.filter( p => p.dataBase === database );
	},
	sortedPublications : ( state ) => {
	  return [...state.publications].sort( ( a, b ) =>
		b.year.localeCompare( a.year ) || // Orden descendente por año
		a.title.localeCompare( b.title )   // Luego por título ascendente
	  );
	},
	// Filtro combinado para búsquedas avanzadas
	filteredPublications : ( state ) => ( filters : Partial<Publication> ) => {
	  return state.publications.filter( p => {
		return Object.entries( filters ).every( ( [key, value] ) =>
		  value ? p[ key as keyof Publication ] === value : true
		);
	  } );
	},
  },
  
  actions : {
	/**
	 * Obtiene todas las publicaciones
	 */
	async fetchPublications() {
	  this.isLoading = true;
	  this.error = null;
	  
	  try {
		const { data, error } = await useFetch( '/api/publications' );
		
		if ( error.value ) {
		  this.error = error.value.message || 'Error al cargar publicaciones';
		} else {
		  this.publications = data.value?.publications || [];
		}
	  } catch ( err ) {
		this.error = 'Error de conexión con el servidor';
		console.error( 'Error inesperado:', err );
	  } finally {
		this.isLoading = false;
	  }
	},
	
	/**
	 * Crea una nueva publicación
	 */
	async createPublication( publicationData : Omit<Publication, 'id'> ) {
	  this.isLoading = true;
	  this.error = null;
	  
	  try {
		const { data, error } = await useFetch( '/api/publications', {
		  method : 'POST',
		  body : publicationData,
		} );
		
		if ( error.value ) {
		  this.error = error.value.message || 'Error al crear publicación';
		} else if ( data.value ) {
		  this.publications.push( data.value as Publication );
		  return data.value; // Retorna la publicación creada
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
	 * Actualiza una publicación existente
	 */
	async updatePublication( updatedPublication : Publication ) {
	  this.isLoading = true;
	  this.error = null;
	  
	  try {
		const { data, error } = await useFetch( `/api/publications/${ updatedPublication.id }`, {
		  method : 'PATCH',
		  body : updatedPublication,
		} );
		
		if ( error.value ) {
		  this.error = error.value.message || 'Error al actualizar publicación';
		} else if ( data.value ) {
		  const index = this.publications.findIndex( p => p.id === updatedPublication.id );
		  if ( index !== -1 ) {
			this.publications[ index ] = data.value as Publication;
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
	 * Elimina una publicación
	 */
	async deletePublication( id : string ) {
	  this.isLoading = true;
	  this.error = null;
	  
	  try {
		const { error } = await useFetch( `/api/publications/${ id }`, {
		  method : 'DELETE',
		} );
		
		if ( error.value ) {
		  this.error = error.value.message || 'Error al eliminar publicación';
		  return false;
		} else {
		  this.publications = this.publications.filter( p => p.id !== id );
		  if ( this.currentPublication?.id === id ) {
			this.currentPublication = null;
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
	 * Establece la publicación actual (para edición)
	 */
	setCurrentPublication( publication : Publication | null ) {
	  this.currentPublication = publication;
	},
	
	/**
	 * Limpia la publicación actual
	 */
	clearCurrentPublication() {
	  this.currentPublication = null;
	},
	
	/**
	 * Limpia los errores
	 */
	clearError() {
	  this.error = null;
	},
	
	/**
	 * Busca publicaciones por múltiples criterios
	 */
	async searchPublications( filters : Partial<Publication> ) {
	  this.isLoading = true;
	  
	  try {
		const { data, error } = await useFetch( '/api/publications/search', {
		  method : 'POST',
		  body : filters,
		} );
		
		if ( error.value ) {
		  throw new Error( error.value.message || 'Error en la búsqueda' );
		}
		
		return data.value || [];
	  } catch ( err ) {
		this.error = err instanceof Error ? err.message : 'Error en la búsqueda';
		console.error( 'Error searching publications:', err );
		return [];
	  } finally {
		this.isLoading = false;
	  }
	},
  },
} );