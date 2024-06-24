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
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          hover: 'hsl(var(--primary-hover) / <alpha-value>)',
          low: {
            DEFAULT: 'hsl(var(--primary-low) / <alpha-value>)',
            hover: 'hsl(var(--primary-low-hover) / <alpha-value>)',
          },
          container: 'hsl(var(--primary-container) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          hover: 'hsl(var(--secondary-hover) / <alpha-value>)',
          container: 'hsl(var(--secondary-container) / <alpha-value>)',
        },
        error: {
          DEFAULT: 'hsl(var(--error) / <alpha-value>)',
          hover: 'hsl(var(--error-hover) / <alpha-value>)',
          container: 'hsl(var(--error-container) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning) / <alpha-value>)',
          hover: 'hsl(var(--warning-hover) / <alpha-value>)',
          container: 'hsl(var(--warning-container) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'hsl(var(--success) / <alpha-value>)',
          hover: 'hsl(var(--success-hover) / <alpha-value>)',
          container: 'hsl(var(--success-container) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'hsl(var(--surface) / <alpha-value>)',
          dim: 'hsl(var(--surface-dim) / <alpha-value>)',
          bright: 'hsl(var(--surface-bright) / <alpha-value>)',
          container: {
            DEFAULT: 'hsl(var(--surface-container) / <alpha-value>)',
            low: 'hsl(var(--surface-container-low) / <alpha-value>)',
            lowest: 'hsl(var(--surface-container-lowest) / <alpha-value>)',
            high: 'hsl(var(--surface-container-high) / <alpha-value>)',
            highest: 'hsl(var(--surface-container-highest) / <alpha-value>)',
          },
        },
        monday: 'hsl(var(--monday) / <alpha-value>)',
        tuesday: 'hsl(var(--tuesday) / <alpha-value>)',
        wednesday: 'hsl(var(--wednesday) / <alpha-value>)',
        thursday: 'hsl(var(--thursday) / <alpha-value>)',
        friday: 'hsl(var(--friday) / <alpha-value>)',
        saturday: 'hsl(var(--saturday) / <alpha-value>)',
        sunday: 'hsl(var(--sunday) / <alpha-value>)',
        on: {
          primary: {
            DEFAULT: 'hsl(var(--on-primary) / <alpha-value>)',
            hover: 'hsl(var(--on-primary-hover) / <alpha-value>)',
            low: 'hsl(var(--on-primary-low) / <alpha-value>)',
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
          warning: {
            DEFAULT: 'hsl(var(--on-warning) / <alpha-value>)',
            hover: 'hsl(var(--on-warning-hover) / <alpha-value>)',
            container: 'hsl(var(--on-warning-container) / <alpha-value>)',
          },
          success: {
            DEFAULT: 'hsl(var(--on-success) / <alpha-value>)',
            hover: 'hsl(var(--on-success-hover) / <alpha-value>)',
            container: 'hsl(var(--on-success-container) / <alpha-value>)',
          },
          surface: {
            DEFAULT: 'hsl(var(--on-surface) / <alpha-value>)',
            var: 'hsl(var(--on-surface-var) / <alpha-value>)',
            disabled: 'hsl(var(--on-surface-disabled) / <alpha-value>)',
            placeholder: 'hsl(var(--on-surface-placeholder) / <alpha-value>)',
          },
          monday: 'hsl(var(--on-monday) / <alpha-value>)',
          tuesday: 'hsl(var(--on-tuesday) / <alpha-value>)',
          wednesday: 'hsl(var(--on-wednesday) / <alpha-value>)',
          thursday: 'hsl(var(--on-thursday) / <alpha-value>)',
          friday: 'hsl(var(--on-friday) / <alpha-value>)',
          saturday: 'hsl(var(--on-saturday) / <alpha-value>)',
          sunday: 'hsl(var(--on-sunday) / <alpha-value>)',
        },
      },
      borderRadius: {
        button: '0.625rem',
      },
      fontFamily: {
        sans: ['"FC Orbit"', ...fontFamily.sans],
      },
    },
  },
}
