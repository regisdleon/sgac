<script setup lang="ts">
const { fetch ,  } = useUserSession();
const toast = useToast();

let showingToasts : ReturnType<ReturnType<typeof useToast>["add"]>[] = [];
const handleLogin = async ( form : { email : string; password : string } ) => {
  try {

    await $fetch( "/api/auth/login", {
      method : "POST",
      body : form,
    } );

    await fetch();

    debugger;

    showingToasts.forEach( ( t ) => toast.remove( t.id ) );

    navigateTo( "/inicio" );

  } catch ( error ) {
    if ( error && typeof error === "object" && "statusMessage" in error ) {
      showingToasts.push(
          toast.add( {
            color : "error",
            title : "Login failed",
            description : error.statusMessage as string,
          } )
      );
    } else {
      console.error( error );
    }
  }
};
</script>

<template>
  <LoginForm @login="handleLogin"/>
</template>
