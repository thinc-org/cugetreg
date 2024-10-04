import { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{html,js,svelte,ts,mdx}',
    '../../packages/ui/src/**/*.{html,js,svelte,ts,mdx}',
  ],
  safelist: ['dark'],
  theme: {
    colors: {
      neutral: {
        white: 'hsl(var(--neutral-white) / <alpha-value>)',
        50: 'hsl(var(--neutral-50) / <alpha-value>)',
        100: 'hsl(var(--neutral-100) / <alpha-value>)',
        200: 'hsl(var(--neutral-200) / <alpha-value>)',
        300: 'hsl(var(--neutral-300) / <alpha-value>)',
        400: 'hsl(var(--neutral-400) / <alpha-value>)',
        500: 'hsl(var(--neutral-500) / <alpha-value>)',
        600: 'hsl(var(--neutral-600) / <alpha-value>)',
        700: 'hsl(var(--neutral-700) / <alpha-value>)',
        800: 'hsl(var(--neutral-800) / <alpha-value>)',
        900: 'hsl(var(--neutral-900) / <alpha-value>)',
      },
      blue: {
        300: 'hsl(var(--blue-300) / <alpha-value>)',
        500: 'hsl(var(--blue-500) / <alpha-value>)',
        700: 'hsl(var(--blue-700) / <alpha-value>)',
      },
      tangerine: {
        300: 'hsl(var(--tangerine-300) / <alpha-value>)',
        500: 'hsl(var(--tangerine-500) / <alpha-value>)',
        700: 'hsl(var(--tangerine-700) / <alpha-value>)',
      },
      yellow: {
        300: 'hsl(var(--yellow-300) / <alpha-value>)',
        500: 'hsl(var(--yellow-500) / <alpha-value>)',
        700: 'hsl(var(--yellow-700) / <alpha-value>)',
      },
      pink: {
        300: 'hsl(var(--pink-300) / <alpha-value>)',
        500: 'hsl(var(--pink-500) / <alpha-value>)',
        700: 'hsl(var(--pink-700) / <alpha-value>)',
      },
      red: {
        300: 'hsl(var(--red-300) / <alpha-value>)',
        500: 'hsl(var(--red-500) / <alpha-value>)',
        700: 'hsl(var(--red-700) / <alpha-value>)',
      },
      orange: {
        300: 'hsl(var(--orange-300) / <alpha-value>)',
        500: 'hsl(var(--orange-500) / <alpha-value>)',
        700: 'hsl(var(--orange-700) / <alpha-value>)',
      },
      green: {
        300: 'hsl(var(--green-300) / <alpha-value>)',
        500: 'hsl(var(--green-500) / <alpha-value>)',
        700: 'hsl(var(--green-700) / <alpha-value>)',
      },
      teal: {
        300: 'hsl(var(--teal-300) / <alpha-value>)',
        500: 'hsl(var(--teal-500) / <alpha-value>)',
        700: 'hsl(var(--teal-700) / <alpha-value>)',
      },
      sky: {
        300: 'hsl(var(--sky-300) / <alpha-value>)',
        500: 'hsl(var(--sky-500) / <alpha-value>)',
        700: 'hsl(var(--sky-700) / <alpha-value>)',
      },
      purple: {
        300: 'hsl(var(--purple-300) / <alpha-value>)',
        500: 'hsl(var(--purple-500) / <alpha-value>)',
        700: 'hsl(var(--purple-700) / <alpha-value>)',
      },
      indigo: {
        300: 'hsl(var(--indigo-300) / <alpha-value>)',
        500: 'hsl(var(--indigo-500) / <alpha-value>)',
        700: 'hsl(var(--indigo-700) / <alpha-value>)',
      },
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
      sc: 'hsl(var(--sc) / <alpha-value>)',
      so: 'hsl(var(--so) / <alpha-value>)',
      in: 'hsl(var(--in) / <alpha-value>)',
      hu: 'hsl(var(--hu) / <alpha-value>)',
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
        sc: 'hsl(var(--on-sc) / <alpha-value>)',
        so: 'hsl(var(--on-so) / <alpha-value>)',
        in: 'hsl(var(--on-in) / <alpha-value>)',
        hu: 'hsl(var(--on-hu) / <alpha-value>)',
      },
    },
    fontSize: {
      h1: ['var(--h1-font-size)', { lineHeight: 'var(--h1-line-height)' }],
      h2: ['var(--h2-font-size)', { lineHeight: 'var(--h2-line-height)' }],
      h3: ['var(--h3-font-size)', { lineHeight: 'var(--h3-line-height)' }],
      'table-header': [
        'var(--table-header-font-size)',
        { lineHeight: 'var(--table-header-line-height)' },
      ],
      subtitle: [
        'var(--subtitle-font-size)',
        { lineHeight: 'var(--subtitle-line-height)' },
      ],
      body1: [
        'var(--body1-font-size)',
        { lineHeight: 'var(--body1-line-height)' },
      ],
      body2: [
        'var(--body2-font-size)',
        { lineHeight: 'var(--body2-line-height)' },
      ],
      button1: [
        'var(--button1-font-size)',
        { lineHeight: 'var(--button1-line-height)' },
      ],
      button2: [
        'var(--button2-font-size)',
        { lineHeight: 'var(--button2-line-height)' },
      ],
      caption: [
        'var(--caption-font-size)',
        { lineHeight: 'var(--caption-line-height)' },
      ],
    },
    extend: {
      ringWidth: {
        1.5: '1.5px',
      },
      borderRadius: {
        button: '0.625rem',
      },
      fontFamily: {
        sans: ['"FC Orbit"', ...fontFamily.sans],
        sarabun: ['Sarabun', ...fontFamily.sans],
      },
    },
  },
} satisfies Config

export default config
