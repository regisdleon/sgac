// server/api/disciplines/[id].patch.ts
export default defineEventHandler( async ( event ) => {
  const id = getRouterParam( event, 'id' );
  const body = await readBody( event );
  
  
  return {
	id : id,
	name : body.name,
	lastName : body.lastName,
	secondLastName : body.secondLastName,
	experience : "Docencia en ingeniería de software",
	experienceYears : 12,
	categoryDegree : "Titular",
	scientificCategory : "Investigador Senior",
	scientificDegree : "Doctor en Ciencias Informáticas",
	contacts : {
	  phones : [5351234567, 787654321],
	  emails : ["c.gomez@universidad.edu", "carlos.gmz@gmail.com"]
	}
  }
  
  const { data, error } = await useBackendFetch( `/professors/${ id }`, {
	method : 'PATCH',
	body
  } );
  
  if ( error ) {
	throw createError( {
	  statusCode : 400,
	  statusMessage : error.message || 'Failed to update professor',
	} );
  }
  
  return data;
} );