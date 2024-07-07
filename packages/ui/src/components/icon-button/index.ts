import type { Button as ButtonPrimitive } from 'bits-ui'
import { tv, type VariantProps } from 'tailwind-variants'

import Root from './icon-button.svelte'

const buttonVariants = tv({
  base: 'inline-flex items-center justify-center whitespace-nowrap rounded-button text-button2 font-medium ring-offset-surface transition-colors focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 *:size-4',
  variants: {
    variant: {
      solid: 'hover:outline-none hover:ring-1.5 hover:ring-offset-2',
      outlined: 'border',
      ghost: '',
    },
    size: {
      sm: 'size-9',
      default: 'size-10',
      lg: 'size-11',
    },
    color: {
      primary: 'text-on-primary-container focus-visible:ring-primary-container',
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
      class: 'bg-primary-container hover:ring-primary-container',
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
      class: 'border-primary-container hover:bg-primary-container',
    },
    {
      variant: 'outlined',
      color: 'neutral',
      class: 'border-surface-container-low hover:bg-surface-container-low',
    },
    {
      variant: 'outlined',
      color: 'error',
      class: 'border-error-container hover:bg-error-container',
    },
    {
      variant: 'outlined',
      color: 'secondary',
      class: 'border-secondary-container hover:bg-secondary-container',
    },
    {
      variant: 'ghost',
      color: 'primary',
      class: 'hover:bg-primary-container',
    },
    {
      variant: 'ghost',
      color: 'neutral',
      class: 'hover:bg-surface-container-low',
    },
    {
      variant: 'ghost',
      color: 'error',
      class: 'hover:bg-error-container',
    },
    {
      variant: 'ghost',
      color: 'secondary',
      class: 'hover:bg-secondary-container',
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

export { buttonVariants, type Events, Root as IconButton, type Props }
