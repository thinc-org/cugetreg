import { tv, type VariantProps } from 'tailwind-variants'
export { default as DayChip } from './day-chip.svelte'

export const chipVariants = tv({
  variants: {
    day: {
      MO: 'bg-monday text-on-monday',
      TU: 'bg-tuesday text-on-tuesday',
      WE: 'bg-wednesday text-on-wednesday',
      TH: 'bg-thursday text-on-thursday',
      FR: 'bg-friday text-on-friday',
      SA: 'bg-saturday text-on-saturday',
      SU: 'bg-sunday text-on-sunday',
    },
  },
})

export type Day = VariantProps<typeof chipVariants>['day']
