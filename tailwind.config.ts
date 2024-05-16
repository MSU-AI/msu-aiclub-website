import { type Config } from 'tailwindcss';
import { PluginAPI } from 'tailwindcss/types/config';
import { fontFamily } from 'tailwindcss/defaultTheme';

const { nextui } = require('@nextui-org/react');

export default {
  content: [
    './src/**/*.tsx',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...fontFamily.sans],
      },
      colors: {
        'msu-ai-background': '#151618',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui(),
    function ({ addUtilities }: PluginAPI) {
      const newUtilities = {
        '.hide-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        '.hide-scrollbar::-webkit-scrollbar': {
          'display': 'none',
        },
      };

      addUtilities(newUtilities);
    },
  ],
} satisfies Config;
