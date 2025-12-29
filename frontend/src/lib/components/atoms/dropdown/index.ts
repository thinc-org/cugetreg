import type { HTMLSelectAttributes } from 'svelte/elements'
import { tv, type VariantProps } from 'tailwind-variants'
import Root from './dropdown.svelte'

const dropdownVariants = tv({
  base: 'flex w-full h-10 rounded-button border-none px-4 pr-10 text-button2 placeholder:text-on-surface hover:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-container-lowest disabled:border-none disabled:ring-0 disabled:placeholder:text-on-surface-disabled appearance-none',
  variants: {
    state: {
      default:
        'bg-surface-container-lowest hover:ring-primary hover:ring-1 focus-visible:ring-1.5 focus-visible:ring-primary',
      error: 'ring-error ring-[1.5px]',
      success: 'ring-success ring-[1.5px]',
    },
  },
  defaultVariants: {
    state: 'default',
  },
})

export type Props = HTMLSelectAttributes & VariantProps<typeof dropdownVariants>

export { Root as Dropdown, dropdownVariants }
