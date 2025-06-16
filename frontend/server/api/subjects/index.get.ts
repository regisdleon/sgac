import { mockSubjects } from "~/models/Subject";

export default defineEventHandler( async ( event ) => {
  const { data, error } = await useBackendFetch( '/subjects' );
  
  
  return { subjects : mockSubjects }
  
  if ( error ) {
	throw createError( {
	  statusCode : 500,
	  statusMessage : 'Failed to fetch subjects from backend',
	} );
  }
  
  return { subjects : data };
} );