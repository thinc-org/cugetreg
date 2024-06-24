import type { Button as ButtonPrimitive } from 'bits-ui'
import { tv, type VariantProps } from 'tailwind-variants'

import Root from './button.svelte'

const buttonVariants = tv({
  base: 'inline-flex items-center justify-center whitespace-nowrap rounded-button text-sm font-medium ring-offset-surface transition-colors hover:outline-none hover:ring-2 hover:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      primary:
        'bg-primary-low hover:ring-primary-low focus-visible:ring-primary-low',
      secondary:
        'bg-surface-container-low hover:ring-surface-container-low focus-visible:ring-surface-container-low',
      outlined:
        'border-2 hover:ring-surface-container focus-visible:ring-surface-container',
    },
    size: {
      sm: 'h-8 px-2',
      default: 'h-9 px-4',
      lg: 'h-10 px-5',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
})

type Variant = VariantProps<typeof buttonVariants>['variant']
type Size = VariantProps<typeof buttonVariants>['size']

type Props = ButtonPrimitive.Props & {
  variant?: Variant
  size?: Size
}

type Events = ButtonPrimitive.Events

export { Root as Button, buttonVariants, type Events, type Props }
