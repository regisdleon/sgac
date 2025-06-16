// server/api/disciplines/[id].get.ts
export default defineEventHandler( async ( event ) => {
  const id = getRouterParam( event, 'id' );
  const { data, error } = await useBackendFetch( `/publications/${ id }` );
  
  if ( error ) {
	throw createError( {
	  statusCode : 404,
	  statusMessage : 'Publication not found',
	} );
  }
  
  return data;
} );