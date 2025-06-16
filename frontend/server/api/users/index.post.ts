// server/api/disciplines.post.ts
export default defineEventHandler( async ( event ) => {
  const body = await readBody( event );
  
  const { data, error } = await useBackendFetch( '/users', {
	method : 'POST',
	body
  } );
  
  if ( error ) {
	throw createError( {
	  statusCode : 400,
	  statusMessage : error.message || 'Invalid user data',
	} );
  }
  
  return data;
} );