/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      }, 
      colors:{
        'chesboard':{
          100: '#cccccc',
          200: '#7c7c7c',
          300: '#eedc97',
          500: '#964d22',
          700: '#241a0f',
          900: '#1c1c24'
        }
      }
    },

   
  },
  plugins: [],
}
