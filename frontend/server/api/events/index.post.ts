// server/api/disciplines.post.ts
export default defineEventHandler( async ( event ) => {
  const body = await readBody( event );
  
  const { data, error } = await useBackendFetch( '/eventos', {
	method : 'POST',
	body
  } );
  
  if ( error ) {
	throw createError( {
	  statusCode : 400,
	  statusMessage : error.message || 'Invalid event data',
	  data: error
	} );
  }
  
  return data;
} );