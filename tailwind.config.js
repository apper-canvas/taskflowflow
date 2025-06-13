/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B4FE5',
        secondary: '#8B7FF7',
        accent: '#FF6B6B',
        surface: '#FFFFFF',
        background: '#F8F9FA',
        success: '#4ECB71',
        warning: '#FFB84D',
        error: '#FF5757',
        info: '#4D9FFF',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: { 
        sans: ['Inter', 'ui-sans-serif', 'system-ui'], 
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
      borderRadius: {
        'default': '8px',
        'card': '12px'
      },
      boxShadow: {
        'card': '0 4px 8px rgba(0, 0, 0, 0.1)'
      }
    },
  },
  plugins: [],
}