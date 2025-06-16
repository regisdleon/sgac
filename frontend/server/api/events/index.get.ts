import { mockEvents } from "~/models/Event";

export default defineEventHandler( async ( event ) => {
  const { data, error } = await useBackendFetch( '/eventos' );
  
  if ( error ) {
	throw createError( {
	  statusCode : 500,
	  statusMessage : 'Failed to fetch events from backend',
	} );
  }
  
  return { events : data };
} );