export { default as Label } from './label.svelte'

import { tv, type VariantProps } from 'tailwind-variants'

const labelVariants = tv({
  base: 'text-button2',
  variants: {
    state: {
      default: 'text-neutral-400',
      error: 'text-error',
      success: 'text-success',
      disable: 'text-neutral-300',
    },
  },
  defaultVariants: {
    color: 'primary',
    state: 'default',
  },
})

type State = VariantProps<typeof labelVariants>['state']

type Props = {
  state?: State
}

export { labelVariants, type Props }
