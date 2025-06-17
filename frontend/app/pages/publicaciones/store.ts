// stores/publication.ts
import type { Publication, PublicationClassification } from "~/models/Publication";
import { z } from "zod";

interface PublicationState {
  publications: Publication[];
  currentPublication: Publication | null;
  isLoading: boolean;
  error: string | null;
  classifications: PublicationClassification[];
}

const schema = z.object({
  id: z.string().optional(),
  anno: z.number().min(1900, 'Debe ser un año válido').max(new Date().getFullYear(), 'El año no puede ser en el futuro'),
  titulo: z.string().min(5, 'Título demasiado corto'),
  revistaEditorial: z.string().min(2, 'Editorial requerida'),
  tipoPublicacion: z.string().min(1, 'Tipo requerido'),
  isbnIssn: z.string().min(5, 'ISBN/ISSN requerido'),
  verificacionLibro: z.string().min(1, 'Verificación de libro requerida'),
  baseDatosRevista: z.string().min(1, 'Base de datos requerida'),
  verificacionReferencia: z.string().min(1, 'Referencia requerida'),
  nivel: z.number().min(1, 'Nivel mínimo es 1').max(4, 'Nivel máximo es 4'),
})

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
	  return state.publications.filter( p => p.tipoPublicacion === type );
	},
	getPublicationsByLevel : ( state : PublicationState ) => ( level : string ) => {
	  return state.publications.filter( p => p.nivel.toString() === level );
	},
	getPublicationsByDatabase : ( state : PublicationState ) => ( database : string ) => {
	  return state.publications.filter( p => p.baseDatosRevista === database );
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
		const { data, error } = await useFetch('/api/publicaciones/');

		if (error.value) {
		  this.error = error.value.message || 'Error al cargar publicaciones';
		  this.publications = [];
		  return;
		}

		if (!Array.isArray(data.value)) {
		  this.publications = [];
		  return;
		}

		const publicationsArray: any[] = Array.isArray(data.value) ? data.value : [];
		this.publications = publicationsArray.map((pub: any) => ({
		  id: pub.id,
		  anno: pub.anno,
		  titulo: pub.titulo,
		  revistaEditorial: pub.revistaEditorial,
		  tipoPublicacion: pub.tipoPublicacion,
		  isbnIssn: pub.isbnIssn,
		  verificacionLibro: pub.verificacionLibro,
		  baseDatosRevista: pub.baseDatosRevista,
		  verificacionReferencia: pub.verificacionReferencia,
		  nivel: pub.nivel,
		  clasificacion: '', // Default value for compatibility
		}));
	  } catch (err) {
		this.error = 'Error de conexión con el servidor';
		this.publications = [];
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
		const d = await $fetch<Publication>(`/api/publicaciones/${updatedPublication.id}`, {
		  method: 'PATCH',
		  body: updatedPublication,
		});
		
		if (d) {
		  const mapped = {
			id: d.id,
			anno: d.anno,
			titulo: d.titulo,
			revistaEditorial: d.revistaEditorial,
			tipoPublicacion: d.tipoPublicacion,
			isbnIssn: d.isbnIssn,
			verificacionLibro: d.verificacionLibro,
			baseDatosRevista: d.baseDatosRevista,
			verificacionReferencia: d.verificacionReferencia,
			nivel: d.nivel,
			clasificacion: d.clasificacion || '',
		  };
		  const index = this.publications.findIndex(p => p.id === updatedPublication.id);
		  if (index !== -1) {
			this.publications[index] = mapped;
		  }
		  return mapped;
		}
		return null;
	  } catch (err: any) {
		this.error = err?.message || 'Error al actualizar la publicación';
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
	
	/**
	 * Obtiene una publicación por ID
	 */
	async fetchPublicationById(id: string) {
	  this.isLoading = true;
	  this.error = null;
	  try {
		const d = await $fetch<Publication>(`/api/publicaciones/${id}`);
		if (d) {
		  return {
			id: d.id,
			anno: d.anno,
			titulo: d.titulo,
			revistaEditorial: d.revistaEditorial,
			tipoPublicacion: d.tipoPublicacion,
			isbnIssn: d.isbnIssn,
			verificacionLibro: d.verificacionLibro,
			baseDatosRevista: d.baseDatosRevista,
			verificacionReferencia: d.verificacionReferencia,
			nivel: d.nivel,
			clasificacion: d.clasificacion || '',
		  };
		}
		return null;
	  } catch (err: any) {
		this.error = err?.message || 'Error al cargar la publicación';
		return null;
	  } finally {
		this.isLoading = false;
	  }
	},
  },
} );