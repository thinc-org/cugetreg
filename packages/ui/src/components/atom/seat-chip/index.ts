import { tv, type VariantProps } from 'tailwind-variants'
export { default as SeatChip } from './seat-chip.svelte'

export const chipVariants = tv({
  variants: {
    status: {
      full: 'bg-sunday text-on-sunday px-4',
      avaliable: 'bg-wednesday text-on-wednesday px-4',
      close: 'bg-surface-container-low text-neutral-500 px-4',
    },
  },
})

export type Status = VariantProps<typeof chipVariants>['status']
