export default defineNuxtRouteMiddleware( ( to ) => {
  const { session, user } = useUserSession()
  
  if ( !session.value?.user && to.meta.requiresAuth ) {
	return navigateTo( '/auth/login' )
  }
} )
