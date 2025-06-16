// server/utils/backend.ts
export const useBackendFetch = async ( endpoint : string, options : any = {} ) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.backendBaseUrl; // Define esto en nuxt.config.ts
  
  try {
	const fullUrl = `${baseURL}${endpoint}`;
	console.log('Sending request to backend URL:', fullUrl);
	const response = await $fetch( endpoint, {
	  baseURL,
	  ...options,
	  headers : {
		...
		(config.backendApiKey ? { 'Authorization' : `Bearer ${ config.backendApiKey }` } : {}),
		'Content-Type' : 'application/json',
		...options.headers
	  }
	} );
	
	return { data : response, error : null };
  } catch ( err : any ) {
	return { data : null, error : err.response?._data || err.message };
  }
};