import mockedProfessors from "~/models/Professors";

export default defineEventHandler( async ( event ) => {
  return { professors : mockedProfessors };
  const { data, error } = await useBackendFetch( '/professors' );
  
  if ( error ) {
	throw createError( {
	  statusCode : 500,
	  statusMessage : 'Failed to fetch professors from backend',
	} );
  }
  
  return { professors : data };
} );