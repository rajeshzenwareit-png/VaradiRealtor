module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f6fbff',
          100: '#e6f2ff',
          500: '#0b6cff', // main brand blue hint from Framer demo
          700: '#0456d6'
        }
      },
      fontFamily: {
        // default: swap with real font name after you export from Framer
        sans: ['InterVar', 'Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Poppins', 'InterVar'],
      },
      container: {
        center: true,
        padding: '1rem'
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem'
      },
      maxWidth: {
        '8xl': '90rem'
      }
    }
  },
  plugins: []
};


