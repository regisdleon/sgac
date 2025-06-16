// server/api/disciplines/[id].delete.ts
export default defineEventHandler( async ( event ) => {
  const id = getRouterParam( event, 'id' );
  
  const { error } = await useBackendFetch( `/careers/${ id }`, {
	method : 'DELETE'
  } );
  
  if ( error ) {
	throw createError( {
	  statusCode : 400,
	  statusMessage : error.message || 'Failed to delete career',
	} );
  }
  
  return { success : true };
} );