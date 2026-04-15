import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        terminal: {
          bg: '#0a0a0a',
          text: '#00ff00',
          border: '#1a1a1a',
          thought: '#60a5fa',
          action: '#fbbf24',
          observation: '#d1d5db',
          decision: '#34d399',
        },
        chart: {
          grid: '#1f2937',
          line: '#3b82f6',
          volume: '#6b7280',
          sma20: '#f59e0b',
          sma60: '#ef4444',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scroll': 'scroll 20s linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
