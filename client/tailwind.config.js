/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mercury: {
          navy: '#102A43',
          'navy-dark': '#0a1d30',
          'navy-light': '#1c3e60',
          blue: '#2563EB',
          'blue-hover': '#1d4ed8',
          'soft-blue': '#EAF3FF',
          'ice-blue': '#F0F6FF',
          charcoal: '#263238',
          'light-grey': '#F5F7FA',
          'border-grey': '#E2E8F0',
          accent: '#0284C7',
          gold: '#D97706'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 20px 40px -15px rgba(16, 42, 67, 0.1)',
        'premium-hover': '0 25px 50px -12px rgba(16, 42, 67, 0.18)',
        'card': '0 4px 20px -2px rgba(16, 42, 67, 0.05)',
        'glow': '0 0 25px rgba(37, 99, 235, 0.25)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2.5s infinite',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
