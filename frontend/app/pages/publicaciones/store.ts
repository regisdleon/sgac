// stores/publication.ts
import type { Publication, PublicationClassification } from "~/models/Publication";

interface PublicationState {
  publications: Publication[];
  currentPublication: Publication | null;
  isLoading: boolean;
  error: string | null;
  classifications: PublicationClassification[];
}

export const usePublicationStore = defineStore( 'publicationStore', {
  state : (): PublicationState => ( {
	publications : [] as Publication[],
	currentPublication : null as Publication | null,
	isLoading : false,
	error : null as string | null,
	classifications: [] as PublicationClassification[],
  } ),
  
  getters : {
	getPublicationById : ( state : PublicationState ) => ( id : string ) => {
	  return state.publications.find( ( p : Publication ) => p.id === id );
	},
	getPublicationsByYear : ( state : PublicationState ) => ( year : string ) => {
	  return state.publications.filter( p => p.anno.toString() === year );
	},
	getPublicationsByType : ( state : PublicationState ) => ( type : string ) => {
	  return state.publications.filter( p => p.tipo_publicacion === type );
	},
	getPublicationsByLevel : ( state : PublicationState ) => ( level : string ) => {
	  return state.publications.filter( p => p.nivel.toString() === level );
	},
	getPublicationsByDatabase : ( state : PublicationState ) => ( database : string ) => {
	  return state.publications.filter( p => p.base_datos_revista === database );
	},
	getClassificationNameById: (state) => (id: string) => {
	  return state.classifications.find(c => c.id === id)?.nombre || 'Desconocido';
	},
	sortedPublications : ( state : PublicationState ) => {
	  return [...state.publications].sort( ( a : Publication, b : Publication ) =>
		b.anno.toString().localeCompare( a.anno.toString() ) || // Orden descendente por año
		a.titulo.localeCompare( b.titulo )   // Luego por título ascendente
	  );
	},
	// Filtro combinado para búsquedas avanzadas
	filteredPublications : ( state : PublicationState ) => ( filters : Partial<Publication> ) => {
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
		const { data, error } = await useFetch<Publication[]>('/api/publicaciones/');
		
		if (error.value) {
		  this.error = error.value.message || 'Error al cargar publicaciones';
		} else {
		  this.publications = data.value || [];
		}
	  } catch (err) {
		this.error = 'Error de conexión con el servidor';
		console.error('Error inesperado:', err);
	  } finally {
		this.isLoading = false;
	  }
	},
	
	/**
	 * Obtiene las clasificaciones de publicaciones
	 */
	async fetchPublicationClassifications() {
	  this.isLoading = true;
	  this.error = null;

	  try {
		console.log('Fetching publication classifications...');
		const { data, error } = await useFetch<PublicationClassification[]>('/api/publicaciones-clasificaciones');

		if (error.value) {
		  this.error = error.value.message || 'Error al cargar clasificaciones';
		  console.error('Error fetching classifications:', error.value);
		} else {
		  this.classifications = data.value || [];
		  console.log('Classifications fetched:', this.classifications);
		}
	  } catch (err) {
		this.error = 'Error de conexión con el servidor';
		console.error('Error inesperado al cargar clasificaciones:', err);
	  } finally {
		this.isLoading = false;
	  }
	},
	
	/**
	 * Crea una nueva publicación
	 */
	async createPublication(publicationData: Omit<Publication, 'id'>) {
	  this.isLoading = true;
	  this.error = null;
	  
	  try {
		const { data, error } = await useFetch<Publication>('/api/publicaciones/', {
		  method: 'POST',
		  body: publicationData,
		});
		
		if (error.value) {
		  this.error = error.value.message || 'Error al crear publicación';
		} else if (data.value) {
		  this.publications.push(data.value);
		  return data.value;
		}
	  } catch (err) {
		this.error = 'Error al conectar con el servidor';
		console.error('Error inesperado:', err);
		return null;
	  } finally {
		this.isLoading = false;
	  }
	},
	
	/**
	 * Actualiza una publicación existente
	 */
	async updatePublication(updatedPublication: Publication) {
	  this.isLoading = true;
	  this.error = null;
	  
	  try {
		const { data, error } = await useFetch<Publication>(`/api/publicaciones/${updatedPublication.id}`, {
		  method: 'PUT',
		  body: updatedPublication,
		});
		
		if (error.value) {
		  this.error = error.value.message || 'Error al actualizar publicación';
		} else if (data.value) {
		  const index = this.publications.findIndex(p => p.id === updatedPublication.id);
		  if (index !== -1) {
			this.publications[index] = data.value;
		  }
		  return data.value;
		}
	  } catch (err) {
		this.error = 'Error de red al actualizar';
		console.error('Error inesperado:', err);
		return null;
	  } finally {
		this.isLoading = false;
	  }
	},
	
	/**
	 * Elimina una publicación
	 */
	async deletePublication(id: string) {
	  this.isLoading = true;
	  this.error = null;
	  
	  try {
		const { error } = await useFetch(`/api/publicaciones/${id}`, {
		  method: 'DELETE',
		});
		
		if (error.value) {
		  this.error = error.value.message || 'Error al eliminar publicación';
		  return false;
		} else {
		  this.publications = this.publications.filter(p => p.id !== id);
		  if (this.currentPublication?.id === id) {
			this.currentPublication = null;
		  }
		  return true;
		}
	  } catch (err) {
		this.error = 'Error de conexión al eliminar';
		console.error('Error inesperado:', err);
		return false;
	  } finally {
		this.isLoading = false;
	  }
	},
	
	/**
	 * Establece la publicación actual (para edición)
	 */
	setCurrentPublication(publication: Publication | null) {
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
	async searchPublications(filters: Partial<Publication>) {
	  this.isLoading = true;
	  
	  try {
		const { data, error } = await useFetch<Publication[]>('/api/publicaciones/', {
		  method: 'GET',
		  params: filters,
		});
		
		if (error.value) {
		  throw new Error(error.value.message || 'Error en la búsqueda');
		}
		
		return data.value || [];
	  } catch (err) {
		this.error = err instanceof Error ? err.message : 'Error en la búsqueda';
		console.error('Error searching publications:', err);
		return [];
	  } finally {
		this.isLoading = false;
	  }
	},
  },
} );