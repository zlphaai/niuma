/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#10b981', // Emerald 500
        'neon-red': '#f43f5e',   // Rose 500
        'neon-blue': '#0ea5e9',  // Sky 500
        'dark-bg': '#f0f9ff',    // Sky 50
        'card-bg': '#ffffff',    // White
        'text-primary': '#334155', // Slate 700
        'text-secondary': '#64748b', // Slate 500
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blob': 'blob 10s infinite',
        'float-up': 'float-up 1.5s ease-out forwards',
        'fade-out-up': 'fade-out-up 0.8s ease-out forwards',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        'float-up': {
          '0%': { transform: 'translateY(0) scale(0.5)', opacity: '1' },
          '100%': { transform: 'translateY(-150px) scale(1.5) rotate(20deg)', opacity: '0' },
        },
        'fade-out-up': {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-40px) scale(1.2)' },
        }
      }
    },
  },
  plugins: [],
}