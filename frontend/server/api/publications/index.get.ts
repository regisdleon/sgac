import { mockPublications } from "~/models/Publication";

export default defineEventHandler( async ( event ) => {
  const { data, error } = await useBackendFetch( '/publications' );
  return { publications : mockPublications }
  
  
  if ( error ) {
	throw createError( {
	  statusCode : 500,
	  statusMessage : 'Failed to fetch publications from backend',
	} );
  }
  
  return { publications : data };
} );