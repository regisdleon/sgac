// stores/subject.ts
import type { Subject } from "~/models/Subject";
import type { Discipline } from "~/models/Discipline";
import type { Curriculum } from "~/models/Curriculum";
import { useCareerStore } from "~/stores/career";
import { useDisciplineStore } from "~/pages/disciplinas/store";

const BACKEND_URL = 'http://localhost:8000';

export const useSubjectStore = defineStore( 'subjectStore', {
  state : () => ( {
	subjects : [] as Subject[],
	currentSubject : null as Subject | null,
	isLoading : false,
	error : null as string | null,
  } ),
  
  getters : {
	getSubjectByCode : ( state ) => ( code : string ) => {
	  return state.subjects.find( ( s : Subject ) => s.codigo === code );
	},
	getSubjectsByName : ( state ) => ( name : string ) => {
	  const lowerName = name.toLowerCase();
	  return state.subjects.filter( ( s : Subject ) =>
		s.nombre.toLowerCase().includes( lowerName )
	  );
	},
	sortedSubjects : ( state ) => {
	  return [...state.subjects].sort( ( a, b ) => a.nombre.localeCompare( b.nombre ) );
	},
	subjectsByYear : ( state ) => ( anno : number ) => {
	  return state.subjects.filter( s => s.anno === anno );
	},
	subjectsBySemester : ( state ) => ( semestre : number ) => {
	  return state.subjects.filter( s => s.semestre === semestre );
	},
	subjectsByModality : ( state ) => ( modality : string ) => {
	  return state.subjects.filter( s => s.modalidad === modality );
	},
	subjectsByDiscipline : ( state ) => ( discipline : Discipline ) => {
	  return state.subjects.filter( s => s.disciplina.id === discipline.id );
	},
	subjectsByCurriculum : ( state ) => ( curriculum : Curriculum ) => {
	  return state.subjects.filter( s => s.curriculo === curriculum.type );
	},
  },
  
  actions : {
	/**
	 * Fetches all subjects from the backend
	 */
	async fetchSubjects() {
	  this.isLoading = true;
	  this.error = null;
	  
	  try {
		const allSubjects: Subject[] = [];
		const careerStore = useCareerStore();
		const disciplineStore = useDisciplineStore();

		await careerStore.fetchCareers(); // Asegurarse de que las carreras estén cargadas

		for (const career of careerStore.careers) {
		  await disciplineStore.fetchDisciplines(Number(career.id)); // Cargar disciplinas para cada carrera

		  for (const discipline of disciplineStore.disciplines) {
			const response = await fetch(`/api/carreras/${career.id}/disciplinas/${discipline.id}/asignaturas`);
			if (!response.ok) {
			  const errorData = await response.json();
			  throw new Error(errorData.message || 'Error fetching subjects for discipline');
			}
			const data = await response.json();
			allSubjects.push(...(data || []));
		  }
		}
		this.subjects = allSubjects;
	  } catch ( err ) {
		this.error = err instanceof Error ? err.message : 'Error fetching subjects';
		console.error( 'Error fetching subjects:', err );
	  } finally {
		this.isLoading = false;
	  }
	},
	
	/**
	 * Fetches a specific subject by code
	 */
	async fetchSubjectByCode( code : string ) {
	  this.isLoading = true;
	  this.error = null;
	  
	  try {
		const response = await fetch(`/api/subjects/${ code }`);
		if (!response.ok) {
		  throw new Error('Subject not found');
		}
		const data = await response.json();
		this.currentSubject = data as Subject;
		return data;
	  } catch ( err ) {
		this.error = err instanceof Error ? err.message : 'Error fetching subject';
		console.error( `Error fetching subject ${ code }:`, err );
		return null;
	  } finally {
		this.isLoading = false;
	  }
	},
	
	/**
	 * Creates a new subject
	 */
	async createSubject( subjectData : Omit<Subject, 'code'> & { carreraId: number, disciplina: number } ) {
	  this.isLoading = true;
	  this.error = null;
	  
	  try {
		const { carreraId, disciplina, ...restOfSubjectData } = subjectData;
		const response = await fetch(`/api/carreras/${carreraId}/disciplinas/${disciplina}/asignaturas`, {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(restOfSubjectData)
		});
		
		if (!response.ok) {
		  const errorData = await response.json();
		  throw new Error(errorData.message || 'Error creating subject');
		}
		
		const data = await response.json();
		this.subjects.push(data as Subject);
		return data;
	  } catch ( err ) {
		this.error = err instanceof Error ? err.message : 'Error creating subject';
		console.error( 'Error creating subject:', err );
		return null;
	  } finally {
		this.isLoading = false;
	  }
	},
	
	/**
	 * Updates an existing subject
	 */
	async updateSubject( updatedSubject : Subject ) {
	  this.isLoading = true;
	  this.error = null;
	  
	  try {
		const carreraId = updatedSubject.disciplina.carrera.id;
		const disciplinaId = updatedSubject.disciplina.id;
		const asignaturaId = updatedSubject.id;

		const response = await fetch(`/api/carreras/${carreraId}/disciplinas/${disciplinaId}/asignaturas/${asignaturaId}`, {
		  method: 'PATCH',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(updatedSubject)
		});
		
		if (!response.ok) {
		  const errorData = await response.json();
		  throw new Error(errorData.message || 'Error updating subject');
		}
		
		const data = await response.json();
		const index = this.subjects.findIndex( s => s.id === updatedSubject.id );
		if ( index !== -1 ) {
		  this.subjects[ index ] = data as Subject;
		}
		this.currentSubject = data as Subject;
		return data;
	  } catch ( err ) {
		this.error = err instanceof Error ? err.message : 'Error updating subject';
		console.error( `Error updating subject ${ updatedSubject.id }:`, err );
		return null;
	  } finally {
		this.isLoading = false;
	  }
	},
	
	/**
	 * Deletes a subject
	 */
	async deleteSubject(subjectToDelete: Subject) {
	  this.isLoading = true;
	  this.error = null;
	  
	  try {
		const carreraId = subjectToDelete.disciplina.carrera.id;
		const disciplinaId = subjectToDelete.disciplina.id;
		const asignaturaId = subjectToDelete.id;
		
		const response = await fetch(`/api/carreras/${carreraId}/disciplinas/${disciplinaId}/asignaturas/${asignaturaId}`, {
		  method: 'DELETE'
		});
		
		if (!response.ok) {
		  const errorData = await response.json();
		  throw new Error(errorData.message || 'Error deleting subject');
		}
		
		this.subjects = this.subjects.filter(s => s.id !== subjectToDelete.id);
		
		// If the current subject is the one being deleted, clear it
		if ( this.currentSubject?.id === subjectToDelete.id ) {
		  this.currentSubject = null;
		}
		
		return true;
	  } catch ( err ) {
		this.error = err instanceof Error ? err.message : 'Error deleting subject';
		console.error( `Error deleting subject ${ subjectToDelete.id }:`, err );
		return false;
	  } finally {
		this.isLoading = false;
	  }
	},
	
	/**
	 * Sets the current subject (for editing)
	 */
	setCurrentSubject( subject : Subject | null ) {
	  this.currentSubject = subject;
	},
	
	/**
	 * Clears the current subject
	 */
	clearCurrentSubject() {
	  this.currentSubject = null;
	},
	
	/**
	 * Clears errors
	 */
	clearError() {
	  this.error = null;
	},
	
	/**
	 * Searches subjects by name or code
	 */
	searchSubjects( query : string ) {
	  const lowerQuery = query.toLowerCase();
	  return this.subjects.filter( s =>
		s.nombre.toLowerCase().includes( lowerQuery ) ||
		s.codigo.toLowerCase().includes( lowerQuery )
	  );
	},
	
	/**
	 * Gets subjects by year and semester
	 */
	async fetchSubjectsByYearAndSemester( year : string, semester : string ) {
	  this.isLoading = true;
	  this.error = null;
	  
	  try {
		const { data, error } = await useFetch( `/api/subjects?year=${ year }&semester=${ semester }` );
		
		if ( error.value ) {
		  this.error = error.value.message || 'Error filtering subjects';
		  return [];
		}
		
		return data.value || [];
	  } catch ( err ) {
		this.error = err instanceof Error ? err.message : 'Error filtering subjects';
		console.error( 'Error filtering subjects:', err );
		return [];
	  } finally {
		this.isLoading = false;
	  }
	},
  },
} );