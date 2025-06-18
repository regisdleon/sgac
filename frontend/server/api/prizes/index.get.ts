export default defineEventHandler(async (event) => {
  const { data, error } = await useBackendFetch('/premios');
  
  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch prizes from backend',
    });
  }
  
  return data;
});