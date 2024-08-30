import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    colors: {
      colOrange: '#E87B35',
      colRed: '#DD524C',
      colPurple: '#9D59EF',
      colGreen: '#5EC269',
      colSky: '#4E80EE',
      colDark70: '#394150',
      colMedSlateBlue: '#7C71FF',
      colDark60: '#6C727F',
      colWhite80: '#E4E4E7',
      colDark80: '#212936',
      colDark90: '#121826'
    },
    extend: {
      gridTemplateColumns: {
        'auto-fit-320': 'repeat(auto-fit, minmax(320px, 1fr))',
        'auto-fit-200': 'repeat(auto-fit, minmax(200px, 1fr))',
        'auto-fit-300': 'repeat(auto-fit, minmax(300px, 1fr))'
      },
      animation: {
        reveal: 'reveal 500ms ease-in-out 1',
        magic: 'magic 1s ease-in infinite',
        blink: 'blink 700ms infinite ease-in-out'
      },
      keyframes: {
        reveal: {
          from: {
            opacity: '0',
            transform: 'translateX(-10px)'
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)'
          }
        }
      },
      screens: {
        tablet: '952px'
      }
    }
  },
  plugins: [require('tailwind-scrollbar')]
};
export default config;

//
