// server/api/disciplines/[id].patch.ts
export default defineEventHandler( async ( event ) => {
  const id = getRouterParam( event, 'id' );
  const body = await readBody( event );
  
  const { data, error } = await useBackendFetch( `/careers/${ id }`, {
	method : 'PATCH',
	body
  } );
  
  if ( error ) {
	throw createError( {
	  statusCode : 400,
	  statusMessage : error.message || 'Failed to update career',
	} );
  }
  
  return data;
} );