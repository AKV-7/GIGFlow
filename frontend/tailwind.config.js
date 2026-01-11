/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Orange Reddit Theme
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Main Orange
          600: '#ea580c',
          700: '#c2410c',
        },
        // Tetris Block Colors
        tetris: {
          cyan: '#06b6d4',
          blue: '#3b82f6',
          orange: '#f97316',
          yellow: '#eab308',
          green: '#22c55e',
          purple: '#a855f7',
          red: '#ef4444',
        },
        // Light Theme Surfaces
        surface: {
          white: '#ffffff',
          cream: '#fffbf5',
          light: '#fef7f0',
          muted: '#f5f0eb',
          border: '#e5ded6',
          dark: '#1a1a1a',
        },
        text: {
          primary: '#1a1a1a',
          secondary: '#525252',
          muted: '#a3a3a3',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"Press Start 2P"', 'monospace'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #1a1a1a',
        'brutal-sm': '2px 2px 0px 0px #1a1a1a',
        'brutal-orange': '4px 4px 0px 0px #ea580c',
        'brutal-hover': '6px 6px 0px 0px #1a1a1a',
      }
    },
  },
  plugins: [],
}
