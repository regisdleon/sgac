// server/api/disciplines/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const { data, error } = await useBackendFetch(`/disciplines/${id}`);
  
  if (error) {
	throw createError({
	  statusCode: 404,
	  statusMessage: 'Discipline not found',
	});
  }
  
  return data;
});