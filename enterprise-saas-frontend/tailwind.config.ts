import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          foreground: 'rgb(var(--color-primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
          foreground: 'rgb(var(--color-secondary-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          foreground: 'rgb(var(--color-accent-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--color-muted) / <alpha-value>)',
          foreground: 'rgb(var(--color-muted-foreground) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'rgb(var(--color-success) / <alpha-value>)',
          foreground: 'rgb(var(--color-success-foreground) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'rgb(var(--color-warning) / <alpha-value>)',
          foreground: 'rgb(var(--color-warning-foreground) / <alpha-value>)',
        },
        error: {
          DEFAULT: 'rgb(var(--color-error) / <alpha-value>)',
          foreground: 'rgb(var(--color-error-foreground) / <alpha-value>)',
        },
        info: {
          DEFAULT: 'rgb(var(--color-info) / <alpha-value>)',
          foreground: 'rgb(var(--color-info-foreground) / <alpha-value>)',
        },
        border: 'rgb(var(--color-border) / <alpha-value>)',
        ring: 'rgb(var(--color-ring) / <alpha-value>)',
      },
      spacing: {
        'token-1': 'var(--spacing-1)',
        'token-2': 'var(--spacing-2)',
        'token-3': 'var(--spacing-3)',
        'token-4': 'var(--spacing-4)',
        'token-5': 'var(--spacing-5)',
        'token-6': 'var(--spacing-6)',
        'token-8': 'var(--spacing-8)',
        'token-10': 'var(--spacing-10)',
        'token-12': 'var(--spacing-12)',
        'token-16': 'var(--spacing-16)',
      },
      fontSize: {
        'token-xs': 'var(--text-xs)',
        'token-sm': 'var(--text-sm)',
        'token-base': 'var(--text-base)',
        'token-lg': 'var(--text-lg)',
        'token-xl': 'var(--text-xl)',
        'token-2xl': 'var(--text-2xl)',
        'token-3xl': 'var(--text-3xl)',
        'token-4xl': 'var(--text-4xl)',
        'token-5xl': 'var(--text-5xl)',
      },
      borderRadius: {
        'token-sm': 'var(--radius-sm)',
        'token-md': 'var(--radius-md)',
        'token-lg': 'var(--radius-lg)',
        'token-xl': 'var(--radius-xl)',
        'token-2xl': 'var(--radius-2xl)',
      },
      fontFamily: {
        sans: ['var(--font-family-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-family-mono)', 'monospace'],
      },
      boxShadow: {
        'token-sm': 'var(--shadow-sm)',
        'token-md': 'var(--shadow-md)',
        'token-lg': 'var(--shadow-lg)',
        'token-xl': 'var(--shadow-xl)',
      },
      transitionDuration: {
        'token-fast': 'var(--duration-fast)',
        'token-normal': 'var(--duration-normal)',
        'token-slow': 'var(--duration-slow)',
      },
      transitionTimingFunction: {
        'default': 'var(--easing-default)',
        'in': 'var(--easing-in)',
        'out': 'var(--easing-out)',
        'in-out': 'var(--easing-in-out)',
      },
      animation: {
        'fade-in': 'fadeIn var(--duration-normal) var(--easing-out)',
        'fade-out': 'fadeOut var(--duration-normal) var(--easing-in)',
        'slide-in': 'slideIn var(--duration-normal) var(--easing-out)',
        'slide-out': 'slideOut var(--duration-normal) var(--easing-in)',
        'scale-in': 'scaleIn var(--duration-fast) var(--easing-out)',
        'scale-out': 'scaleOut var(--duration-fast) var(--easing-in)',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(10px)', opacity: '0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;