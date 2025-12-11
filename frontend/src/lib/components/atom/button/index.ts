import type { Button as ButtonPrimitive } from 'bits-ui'
import { tv, type VariantProps } from 'tailwind-variants'

import Root from './button.svelte'

const buttonVariants = tv({
  base: 'inline-flex items-center justify-center  whitespace-nowrap rounded-button text-button2 font-medium font-sans ring-offset-surface transition-all focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      solid: 'hover:outline-none hover:ring-1.5 hover:ring-offset-2',
      outlined: 'ring-1.5 hover:ring-0',
    },
    size: {
      sm: 'h-8 px-2',
      default: 'h-9 px-4',
      lg: 'h-10 px-5',
    },
    color: {
      primary: 'focus-visible:ring-primary-container',
      neutral: 'text-on-surface focus-visible:ring-surface-container-low',
      error: 'text-on-error-container focus-visible:ring-error-container',
      secondary:
        'text-on-secondary-container focus-visible:ring-secondary-container',
    },
  },
  compoundVariants: [
    {
      variant: 'solid',
      color: 'primary',
      class:
        'bg-primary-container hover:ring-primary-container text-on-primary-container ',
    },
    {
      variant: 'solid',
      color: 'neutral',
      class: 'bg-surface-container-low hover:ring-surface-container-low',
    },
    {
      variant: 'solid',
      color: 'error',
      class: 'bg-error-container hover:ring-error-container',
    },
    {
      variant: 'solid',
      color: 'secondary',
      class: 'bg-secondary-container hover:ring-secondary-container',
    },
    {
      variant: 'outlined',
      color: 'primary',
      class:
        'ring-primary hover:bg-primary-container text-primary hover:text-on-primary-container',
    },
    {
      variant: 'outlined',
      color: 'neutral',
      class: 'ring-surface-container-low hover:bg-surface-container-low',
    },
    {
      variant: 'outlined',
      color: 'error',
      class: 'ring-error-container hover:bg-error-container',
    },
    {
      variant: 'outlined',
      color: 'secondary',
      class: 'ring-secondary-container hover:bg-secondary-container',
    },
  ],
  defaultVariants: {
    variant: 'solid',
    size: 'default',
    color: 'primary',
  },
})

type Variant = VariantProps<typeof buttonVariants>['variant']
type Size = VariantProps<typeof buttonVariants>['size']
type Color = VariantProps<typeof buttonVariants>['color']

type Props = ButtonPrimitive.Props & {
  variant?: Variant
  size?: Size
  color?: Color
}

type Events = ButtonPrimitive.Events

export { Root as Button, buttonVariants, type Events, type Props }
