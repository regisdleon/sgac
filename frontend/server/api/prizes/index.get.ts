import { mockPrizes } from "~/models/Prize";

export default defineEventHandler( async ( event ) => {
  const { data, error } = await useBackendFetch( '/prizes' );
  
  return { prizes : mockPrizes };
  
  
  if ( error ) {
	throw createError( {
	  statusCode : 500,
	  statusMessage : 'Failed to fetch prizes from backend',
	} );
  }
  
  return { prizes : data };
} );