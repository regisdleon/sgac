// server/api/disciplines.get.ts
import { mockDisciplines } from "~/models/Discipline";

export default defineEventHandler( async ( event ) => {
  const { data, error } = await useBackendFetch( '/disciplines' );
  
  return { disciplines : mockDisciplines }
  
  if ( error ) {
	throw createError( {
	  statusCode : 500,
	  statusMessage : 'Failed to fetch disciplines from backend',
	} );
  }
  
  return { disciplines : data };
} );