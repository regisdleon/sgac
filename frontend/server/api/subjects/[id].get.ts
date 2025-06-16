// server/api/disciplines/[id].get.ts
export default defineEventHandler( async ( event ) => {
  const id = getRouterParam( event, 'id' );
  const { data, error } = await useBackendFetch( `/signatures/${ id }` );
  
  if ( error ) {
	throw createError( {
	  statusCode : 404,
	  statusMessage : 'Signature not found',
	} );
  }
  
  return data;
} );