// server/api/professors/[id].delete.ts
export default defineEventHandler( async ( event ) => {
  const id = getRouterParam( event, 'id' );
  
  // return { success : true }
  
  const { error } = await useBackendFetch( `/profesores/${ id }`, {
	method : 'DELETE'
  } );
  
  if ( error ) {
	throw createError( {
	  statusCode : 400,
	  statusMessage : error.message || 'Failed to delete professor',
	} );
  }
  
  return { success : true };
} );