// server/api/disciplines/[id].delete.ts
export default defineEventHandler( async ( event ) => {
  const id = getRouterParam( event, 'id' );
  
  const { error } = await useBackendFetch( `/publications/${ id }`, {
	method : 'DELETE'
  } );
  
  if ( error ) {
	throw createError( {
	  statusCode : 400,
	  statusMessage : error.message || 'Failed to delete publication',
	} );
  }
  
  return { success : true };
} );