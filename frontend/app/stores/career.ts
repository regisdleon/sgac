// stores/career.ts
import type { Career } from "~/models/Career";

export const useCareerStore = defineStore( 'careerStore', {
  state : () => ( {
    careers : [] as Career[],
    currentCareer : null as Career | null,
    isLoading : false,
    error : null as string | null,
  } ),
  
  getters : {
    getCareerById : ( state ) => ( id : string ) => {
      return state.careers.find( ( c : Career ) => c.id === id );
    },
    getCareerByCES : ( state ) => ( ces : string ) => {
      return state.careers.find( ( c : Career ) => c.curso_evaluado === ces );
    },
    sortedCareers : ( state ) => {
      return [...state.careers].sort( ( a, b ) => a.nombre.localeCompare( b.nombre ) );
    },
    careersByModality : ( state ) => ( modality : string ) => {
      return state.careers.filter( c => c.modalidad === modality );
    },
    careersBySede : ( state ) => ( sede : string ) => {
      return state.careers.filter( c => c.sede === sede );
    },
    careersByEvaluationYear : ( state ) => ( year : string ) => {
      return state.careers.filter( c => c.anno_eval_ext === year );
    },
  },
  
  actions : {
    async fetchCareers() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const config = useRuntimeConfig();
        const url = `${config.public.backendBaseUrl}/carreras`;
        console.log('Fetching careers from:', url);
        
        const response = await $fetch<Career[]>(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          onResponse({ response }) {
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
          },
          onResponseError({ response }) {
            console.error('Response error:', response);
          }
        });
        
        console.log('Careers response:', response);
        if (Array.isArray(response)) {
          const mappedCareers = response.map((c: any) => ({
            id: c.id,
            nombre: c.nombre,
            modalidad: c.modalidad,
            sede: c.sede,
            anno_eval_ext: c.annoEvalExt || c.anno_eval_ext,
            curso_evaluado: c.cursoEvaluado || c.curso_evaluado,
            numero_eval_ext: c.numeroEvalExt || c.numero_eval_ext
          }));
          console.log('Mapped careers:', mappedCareers);
          this.careers = mappedCareers;
        } else {
          console.error('Invalid response format:', response);
          this.error = 'Formato de respuesta inválido';
        }
      } catch (err) {
        console.error('Detailed error:', err);
        this.error = err instanceof Error ? err.message : 'Error al obtener las carreras';
        console.error('Error fetching careers:', err);
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchCareerById(id: string) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const config = useRuntimeConfig();
        const response = await $fetch<Career>(`${config.public.backendBaseUrl}/carreras/${id}`);
        this.currentCareer = response;
        return response;
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Error al obtener la carrera';
        console.error(`Error fetching career ${id}:`, err);
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    async createCareer(careerData: Omit<Career, 'id'>) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const config = useRuntimeConfig();
        const response = await $fetch(`${config.public.backendBaseUrl}/carreras`, {
          method: 'POST',
          body: careerData
        });
        
        const newCareer = response as Career;
        this.careers.push(newCareer);
        return newCareer;
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Error al crear la carrera';
        console.error('Error creating career:', err);
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    async updateCareer(updatedCareer: Career) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const config = useRuntimeConfig();
        const response = await $fetch(`${config.public.backendBaseUrl}/carreras/${updatedCareer.id}`, {
          method: 'PATCH',
          body: updatedCareer
        });
        
        const updated = response as Career;
        const index = this.careers.findIndex(c => c.id === updated.id);
        if (index !== -1) {
          this.careers[index] = updated;
        }
        this.currentCareer = updated;
        return updated;
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Error al actualizar la carrera';
        console.error('Error updating career:', err);
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    async deleteCareer(id: string) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const config = useRuntimeConfig();
        await $fetch(`${config.public.backendBaseUrl}/carreras/${id}`, {
          method: 'DELETE'
        });
        
        this.careers = this.careers.filter(c => c.id !== id);
        if (this.currentCareer?.id === id) {
          this.currentCareer = null;
        }
        return true;
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Error al eliminar la carrera';
        console.error('Error deleting career:', err);
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    setCurrentCareer(career: Career | null) {
      this.currentCareer = career;
    },
    
    clearCurrentCareer() {
      this.currentCareer = null;
    },
    
    clearError() {
      this.error = null;
    },
    
    searchCareers( query : string ) {
      const lowerQuery = query.toLowerCase();
      return this.careers.filter( c =>
        c.nombre.toLowerCase().includes( lowerQuery ) ||
        c.curso_evaluado.toLowerCase().includes( lowerQuery )
      );
    },
    
    async fetchCareersByEvaluationYear( year : string ) {
      this.isLoading = true;
      try {
        const { data, error } = await useFetch( `/api/careers?evaluationYear=${ year }` );
        
        if ( error.value ) {
          this.error = error instanceof Error ? error.message : 'Error al filtrar carreras por año'
        }
        
        return data.value?.careers || [];
      } catch ( err ) {
        this.error = err instanceof Error ? err.message : 'Error al filtrar carreras por año';
        console.error( 'Error filtering careers by year:', err );
        return [];
      } finally {
        this.isLoading = false;
      }
    },
  },
} ); 