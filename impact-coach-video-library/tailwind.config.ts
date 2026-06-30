import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#ea580c', // orange-600 — basketball energy
          dark: '#c2410c',
          light: '#fb923c',
        },
      },
    },
  },
  plugins: [],
};

export default config;
