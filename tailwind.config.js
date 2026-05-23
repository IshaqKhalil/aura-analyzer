/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          purple: '#8b5cf6',
          pink: '#ec4899',
          cyan: '#06b6d4',
          violet: '#7c3aed',
          gold: '#f59e0b',
        },
      },
      animation: {
        'spin-slow': 'spin 10s linear infinite',
        'spin-reverse': 'spinReverse 8s linear infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 7s ease-in-out 1s infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'scan-line': 'scanLine 2.5s linear infinite',
        'ring-expand': 'ringExpand 2s ease-out infinite',
        'count-up': 'countUp 0.3s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        spinReverse: {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-15px) rotate(2deg)' },
          '66%': { transform: 'translateY(-8px) rotate(-1deg)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(calc(100vh))', opacity: '0' },
        },
        ringExpand: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        countUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139,92,246,0.3), 0 0 40px rgba(139,92,246,0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(139,92,246,0.7), 0 0 80px rgba(236,72,153,0.4), 0 0 120px rgba(6,182,212,0.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      boxShadow: {
        'neon-purple': '0 0 15px rgba(139,92,246,0.5), 0 0 30px rgba(139,92,246,0.3), 0 0 60px rgba(139,92,246,0.1)',
        'neon-pink': '0 0 15px rgba(236,72,153,0.5), 0 0 30px rgba(236,72,153,0.3)',
        'neon-cyan': '0 0 15px rgba(6,182,212,0.5), 0 0 30px rgba(6,182,212,0.3)',
        'neon-gold': '0 0 15px rgba(245,158,11,0.5), 0 0 30px rgba(245,158,11,0.3)',
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        'glass-strong': '0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)',
      },
      backgroundSize: {
        '300%': '300%',
      },
      blur: {
        '4xl': '80px',
        '5xl': '120px',
      },
    },
  },
  plugins: [],
}
