export default defineEventHandler( async ( event ) => {
  const { data, error } = await useBackendFetch( '/users' );
  
  if ( error ) {
	throw createError( {
	  statusCode : 500,
	  statusMessage : 'Failed to fetch users from backend',
	} );
  }
  
  return { users : data };
} );