/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0a0a0a',
          border: '#1a1a1a',
          text: '#e0e0e0',
          green: '#00ff41',
          blue: '#00bfff',
          yellow: '#ffd700',
          red: '#ff4444',
          gray: '#808080',
        },
        chart: {
          bg: '#111111',
          grid: '#2a2a2a',
          line: '#00ff88',
          volume: '#ff6b35',
        },
        accent: {
          primary: '#00ff88',
          secondary: '#00bfff',
          danger: '#ff4444',
          warning: '#ffd700',
        },
        border: "hsl(var(--border))", // 이 줄을 추가!
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
