// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   darkMode: 'class',
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ['Inter', 'sans-serif'],
//         mono: ['JetBrains Mono', 'monospace'],
//       },
//       colors: {
//         primary: {
//           50: '#eff6ff',
//           100: '#dbeafe',
//           200: '#bfdbfe',
//           300: '#93c5fd',
//           400: '#60a5fa',
//           500: '#3b82f6',
//           600: '#2563eb',
//           700: '#1d4ed8',
//           800: '#1e40af',
//           900: '#1e3a8a',
//         },
//       },
//       animation: {
//         'fade-in': 'fadeIn 0.5s ease-out',
//         'slide-up': 'slideUp 0.6s ease-out',
//         'float': 'float 3s ease-in-out infinite',
//         'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
//         'shimmer': 'shimmer 1.5s infinite',
//       },
//       keyframes: {
//         fadeIn: {
//           '0%': { opacity: '0', transform: 'translateY(20px)' },
//           '100%': { opacity: '1', transform: 'translateY(0)' },
//         },
//         slideUp: {
//           '0%': { opacity: '0', transform: 'translateY(30px)' },
//           '100%': { opacity: '1', transform: 'translateY(0)' },
//         },
//         float: {
//           '0%, 100%': { transform: 'translateY(0px)' },
//           '50%': { transform: 'translateY(-10px)' },
//         },
//         shimmer: {
//           '0%': { backgroundPosition: '-200px 0' },
//           '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
//         },
//       },
//     },
//   },
//   plugins: [],
// } 

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      colors: {
        // 🌈 Primary brand colors (for buttons, links)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },

        // 🌙 Custom dark mode color system
        background: {
          light: '#f8fafc', // light mode background
          dark: '#0f172a',  // deep navy background
        },
        surface: {
          light: '#ffffff',  // card/navbar surface in light mode
          dark: '#1e293b',   // card/navbar surface in dark mode
        },
        text: {
          light: '#1e293b',  // default text in light mode
          dark: '#e2e8f0',   // readable text in dark mode
        },
      },

      // ✨ Animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
      },
    },
  },
  plugins: [],
}
