// stores/subject.ts
import type { Subject } from "~/models/Subject";
import type { Discipline } from "~/models/Discipline";
import type { Curriculum } from "~/models/Curriculum";

export const useSubjectStore = defineStore( 'subjectStore', {
  state : () => ( {
	subjects : [] as Subject[],
	currentSubject : null as Subject | null,
	isLoading : false,
	error : null as string | null,
  } ),
  
  getters : {
	getSubjectByCode : ( state ) => ( code : string ) => {
	  return state.subjects.find( ( s : Subject ) => s.code === code );
	},
	getSubjectsByName : ( state ) => ( name : string ) => {
	  const lowerName = name.toLowerCase();
	  return state.subjects.filter( ( s : Subject ) =>
		s.name.toLowerCase().includes( lowerName )
	  );
	},
	sortedSubjects : ( state ) => {
	  return [...state.subjects].sort( ( a, b ) => a.name.localeCompare( b.name ) );
	},
	subjectsByYear : ( state ) => ( year : string ) => {
	  return state.subjects.filter( s => s.year === year );
	},
	subjectsBySemester : ( state ) => ( semester : string ) => {
	  return state.subjects.filter( s => s.semester === semester );
	},
	subjectsByModality : ( state ) => ( modality : string ) => {
	  return state.subjects.filter( s => s.modality === modality );
	},
	subjectsByDiscipline : ( state ) => ( discipline : Discipline ) => {
	  return state.subjects.filter( s => s.discipline.code === discipline.code );
	},
	subjectsByCurriculum : ( state ) => ( curriculum : Curriculum ) => {
	  return state.subjects.filter( s => s.curriculum.type === curriculum.type );
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
		const { data, error } = await useFetch( '/api/subjects' );
		
		if ( error.value ) {
		  this.error = error.value.message || 'Error fetching subjects';
		  return;
		}
		
		this.subjects = data.value?.subjects || [];
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
		const { data, error } = await useFetch( `/api/subjects/${ code }` );
		
		if ( error.value ) {
		  this.error = error.value.message || 'Subject not found';
		  return null;
		}
		
		this.currentSubject = data.value as Subject;
		return data.value;
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
	async createSubject( subjectData : Omit<Subject, 'code'> ) {
	  this.isLoading = true;
	  this.error = null;
	  
	  try {
		const { data, error } = await useFetch( '/api/subjects', {
		  method : 'POST',
		  body : subjectData
		} );
		
		if ( error.value ) {
		  this.error = error.value.message || 'Error creating subject';
		  return null;
		}
		
		if ( data.value ) {
		  this.subjects.push( data.value as Subject );
		  return data.value;
		}
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
		const { data, error } = await useFetch( `/api/subjects/${ updatedSubject.code }`, {
		  method : "PATCH",
		  body : updatedSubject
		} );
		
		if ( error.value ) {
		  this.error = error.value.message || 'Error updating subject';
		  return null;
		}
		
		if ( data.value ) {
		  const index = this.subjects.findIndex( s => s.code === updatedSubject.code );
		  if ( index !== -1 ) {
			this.subjects[ index ] = data.value as Subject;
		  }
		  this.currentSubject = data.value as Subject;
		  return data.value;
		}
	  } catch ( err ) {
		this.error = err instanceof Error ? err.message : 'Error updating subject';
		console.error( `Error updating subject ${ updatedSubject.code }:`, err );
		return null;
	  } finally {
		this.isLoading = false;
	  }
	},
	
	/**
	 * Deletes a subject
	 */
	async deleteSubject( code : string ) {
	  this.isLoading = true;
	  this.error = null;
	  
	  try {
		const { error } = await useFetch( `/api/subjects/${ code }`, {
		  method : 'DELETE'
		} );
		
		if ( error.value ) {
		  this.error = error.value.message || 'Error deleting subject';
		  return false;
		}
		
		this.subjects = this.subjects.filter( s => s.code !== code );
		
		// If the current subject is the one being deleted, clear it
		if ( this.currentSubject?.code === code ) {
		  this.currentSubject = null;
		}
		
		return true;
	  } catch ( err ) {
		this.error = err instanceof Error ? err.message : 'Error deleting subject';
		console.error( `Error deleting subject ${ code }:`, err );
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
		s.name.toLowerCase().includes( lowerQuery ) ||
		s.code.toLowerCase().includes( lowerQuery )
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