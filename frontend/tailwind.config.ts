// tailwind.config.js
module.exports = {
  darkMode : 'false',
  content : [
	"./app/**/*.{vue,js,ts,jsx,tsx}",
  ],
  tailwindcss : {
	config : {
	  theme : {
		extend : {
		  light : {
			colors : {
			  default : {
				DEFAULT : '#E7EAF3',
				500 : '#71717A',
			  },
			  primary : {
				DEFAULT : '#008060',
				500 : '#06C5951A',
				foreground : '#ffffff',
			  },
			  secondary : {
				DEFAULT : '#51596C',
				foreground : '#ffffff',
			  },
			  success : {
				DEFAULT : '#077C76',
				foreground : '#ffffff',
			  },
			  warning : {
				DEFAULT : '#F1B980',
				foreground : '#ffffff',
			  },
			  danger : {
				DEFAULT : '#ee6a5f',
				500 : '#cc648f',
				foreground : '#ffffff',
			  },
			  overlay : {
				DEFAULT : '#000000',
			  },
			}, // light theme colors
		  },
		  dark : {
			layout : {}, // dark theme layout tokens
			colors : {
			  primary : {
				DEFAULT : '#008060',
				foreground : '#ffffff',
			  },
			  secondary : { DEFAULT : '#51596C', foreground : '#ffffff' },
			  success : { DEFAULT : '#077C76', foreground : '#ffffff' },
			  warning : { DEFAULT : '#F1B980', foreground : '#ffffff' },
			  danger : { DEFAULT : '#692340', foreground : '#ffffff' },
			}, // dark theme colors
		  },
		  // ... custom themes
		},
	  },
	},
  },
  plugins : [],
}
