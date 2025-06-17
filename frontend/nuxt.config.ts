import { process } from "std-env";

export default defineNuxtConfig( {
  runtimeConfig : {
	public : {
	  backendBaseUrl : process.env.BACKEND_BASE_URL || 'http://127.0.0.1:8000',
	},
	backendApiKey : process.env.BACKEND_API_KEY || '', // Solo en servidor
  },
  compatibilityDate : "2024-11-01",
  future : {
	compatibilityVersion : 4,
  }, devtools : {
	enabled : true,
	timeline : {
	  enabled : true,
	},
  },
  modules : ["@nuxt/eslint", "@nuxt/ui", "nuxt-auth-utils", "@pinia/nuxt", "@nuxtjs/tailwindcss"],
  ui : {
	colorMode : false,
	theme : {},
  },
  vite: {
    server: {
      proxy: {
        '/api/': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
      },
    },
  },
} );
