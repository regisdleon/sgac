// server/api/disciplines/[id].get.ts
import mockedProfessors from "~/models/Professors";

export default defineEventHandler( async ( event ) => {
  const id = getRouterParam( event, 'id' );
  
  const { data, error } = await useBackendFetch( `/professor/${ id }` );
  
  if ( error ) {
	throw createError( {
	  statusCode : 404,
	  statusMessage : 'Professor not found',
	} );
  }
  
  return data;
} );