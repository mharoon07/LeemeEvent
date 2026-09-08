/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#FAF7F2',
          100: '#F3ECE2',
          DEFAULT: '#EAE0D5',
          200: '#DFD3C4',
          300: '#D2C3B2',
          400: '#C3B19E',
          500: '#B09D89',
        },
        taupe: {
          50: '#F7F4F0',
          100: '#EAE3DA',
          200: '#D7CBBD',
          300: '#BEAD9B',
          400: '#A4917D',
          DEFAULT: '#8C7355',
          600: '#755E44',
          700: '#5F4B34',
          800: '#483826',
          900: '#322518',
          muted: '#6E6052',
        },
        charcoal: {
          DEFAULT: '#28231D',
          soft: '#3B332B',
          muted: '#52483E',
          light: '#6E6256',
        },
        stone: {
          light: '#F8F5F0',
          DEFAULT: '#E6DDD0',
          dark: '#BCAFA0',
        }
      },
      fontFamily: {
        bricolage: ['"Bricolage Grotesque"', 'var(--font-bricolage)', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        sans: ['"Bricolage Grotesque"', 'var(--font-bricolage)', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        classico: ['"Bricolage Grotesque"', 'var(--font-bricolage)', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        serif: ['"Bricolage Grotesque"', 'var(--font-bricolage)', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 10px rgba(40, 35, 29, 0.04)',
        'soft-md': '0 8px 30px rgba(40, 35, 29, 0.07)',
        'soft-lg': '0 20px 50px rgba(40, 35, 29, 0.1)',
        'glow': '0 0 25px rgba(140, 115, 85, 0.18)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
};
