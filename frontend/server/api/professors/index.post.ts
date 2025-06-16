// server/api/disciplines.post.ts
export default defineEventHandler( async ( event ) => {
  const body = await readBody( event );
  
  return {
	id : "prof-001",
	name : "Carlos",
	lastName : "Gómez",
	secondLastName : "Martínez",
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
  
  const { data, error } = await useBackendFetch( '/professors', {
	method : 'POST',
	body
  } );
  
  if ( error ) {
	throw createError( {
	  statusCode : 400,
	  statusMessage : error.message || 'Invalid professor data',
	} );
  }
  
  return data;
} );