import { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

export const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{html,js,svelte,ts}',
    '../../packages/ui/src/**/*.{html,js,svelte,ts}',
  ],
  safelist: ['dark'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          hover: 'hsl(var(--primary-hover) / <alpha-value>)',
          container: 'hsl(var(--primary-container) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          container: 'hsl(var(--secondary-container) / <alpha-value>)',
          hover: 'hsl(var(--secondary-hover) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        error: {
          DEFAULT: 'hsl(var(--error) / <alpha-value>)',
          hover: 'hsl(var(--error-hover) / <alpha-value>)',
          container: 'hsl(var(--error-container) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'hsl(var(--success) / <alpha-value>)',
          hover: 'hsl(var(--success-hover) / <alpha-value>)',
          container: 'hsl(var(--success-container) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning) / <alpha-value>)',
          hover: 'hsl(var(--warning-hover) / <alpha-value>)',
          container: 'hsl(var(--warning-container) / <alpha-value>)',
        },
        surface: {
          dim: 'hsl(var(--surface-dim) / <alpha-value>)',
          bright: 'hsl(var(--surface-bright) / <alpha-value>)',
          container: 'hsl(var(--surface-container) / <alpha-value>)',
          'container-low': 'hsl(var(--surface-container-low) / <alpha-value>)',
          'container-lowest':
            'hsl(var(--surface-container-lowest) / <alpha-value>)',
          'container-high':
            'hsl(var(--surface-container-high) / <alpha-value>)',
          'container-highest':
            'hsl(var(--surface-container-highest) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        on: {
          primary: {
            DEFAULT: 'hsl(var(--on-primary) / <alpha-value>)',
            hover: 'hsl(var(--on-primary-hover) / <alpha-value>)',
            container: 'hsl(var(--on-primary-container) / <alpha-value>)',
          },
          secondary: {
            DEFAULT: 'hsl(var(--on-secondary) / <alpha-value>)',
            hover: 'hsl(var(--on-secondary-hover) / <alpha-value>)',
            container: 'hsl(var(--on-secondary-container) / <alpha-value>)',
          },
          error: {
            DEFAULT: 'hsl(var(--on-error) / <alpha-value>)',
            hover: 'hsl(var(--on-error-hover) / <alpha-value>)',
            container: 'hsl(var(--on-error-container) / <alpha-value>)',
          },
          success: {
            DEFAULT: 'hsl(var(--on-success) / <alpha-value>)',
            hover: 'hsl(var(--on-success-hover) / <alpha-value>)',
            container: 'hsl(var(--on-success-container) / <alpha-value>)',
          },
          warning: {
            DEFAULT: 'hsl(var(--on-warning) / <alpha-value>)',
            hover: 'hsl(var(--on-warning-hover) / <alpha-value>)',
            container: 'hsl(var(--on-warning-container) / <alpha-value>)',
          },
          surface: {
            DEFAULT: 'hsl(var(--on-surface) / <alpha-value>)',
            var: 'hsl(var(--on-surface-var) / <alpha-value>)',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
    },
  },
}
