export default defineEventHandler( async ( event ) => {
  const { data, error } = await useBackendFetch( '/careers' );
  
  if ( error ) {
	throw createError( {
	  statusCode : 500,
	  statusMessage : 'Failed to fetch careers from backend',
	} );
  }
  
  return { careers : data };
} );