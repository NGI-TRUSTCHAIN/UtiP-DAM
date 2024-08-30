/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{html,js}'],

  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        raise: 'raise 0.3s ease-in',
        'raise-infinite': 'raise 1.5s ease-in-out infinite',
        'raise-slow': 'raise 0.6s ease-in',
        typing: 'typing 5s steps(50) infinite',
        wordCarousel: 'wordCarousel 3s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        raise: {
          '0%': { transform: 'translateY(10%)' },
          '100%': { transform: 'translateY(0%)' },
        },
        typing: {
          from: { width: '5%' },
          to: { width: '100%' },
        },
        wordCarousel: {
          '0%, 100%': {
            opacity: 0,
            transform: 'translateY(-22px)',
          },
          '10%, 90%': {
            opacity: 1,
            transform: 'translateY(0px)',
          },
        },
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      colors: {
        primary: {
          DEFAULT: '#086CDA',
          dark: '#111827',
          1200: '#086CDA',
          1400: '#043c79',
        },
        secondary: {
          DEFAULT: '#172554',
          900: '#1e3a8a',
          700: '#1d4ed8',
          500: '#3b82f6',
        },
        accent: '#e2d05a',
        'accent-dark': '#cbbb51',
        neutral: '#e2eefb',
        text: {
          DEFAULT: '#333',
          lightDark: '#374151',
          light: '#f3f4f6',
          muted: '#9ca3af',
        },
        white: {
          DEFAULT: '#fafafa',
          900: '#F3F4F6',
          700: '#E5E7EB',
          500: '#D1D5DB',
          pure: '#fffff',
        },
        map: {
          building: '#84a8b8',
        },
        success: {
          DEFAULT: '#66C997',
          darker: '#3d785a',
        },
        warning: {
          DEFAULT: '#cbbb51',
        },
        danger: {
          DEFAULT: '#FF0000',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
    require('react-flatpickr'),
  ],
  daisyui: {
    themes: ['winter'], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    base: false,
  },
};
