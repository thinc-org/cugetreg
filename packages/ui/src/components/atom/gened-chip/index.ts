import { tv, type VariantProps } from 'tailwind-variants'
export { default as GenedChip } from './gened-chip.svelte'

export const chipVariants = tv({
  base: 'border',
  variants: {
    type: {
      SC: 'border-on-sc text-on-sc bg-sc',
      SO: 'border-on-so text-on-so bg-so',
      HU: 'border-on-hu text-on-hu bg-hu',
      IN: 'border-on-in text-on-in bg-in',
    },
  },
})

export type Type = VariantProps<typeof chipVariants>['type']
