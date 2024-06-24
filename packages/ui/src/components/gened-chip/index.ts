import { tv, type VariantProps } from 'tailwind-variants'
export { default as GenedChip } from './gened-chip.svelte'

export const chipVariants = tv({
  base: 'inline-flex select-none items-center rounded-full border w-fit min-w-18 px-2 font-medium transition-colors',
  variants: {
    type: {
      SC: 'border-yellow-700 text-yellow-700',
      SO: 'border-green-700 text-green-700',
      HU: 'border-pink-700 text-pink-700',
      IN: 'border-purple-700 text-purple-700',
    },
    size: {
      sm: 'h-[1.125rem] text-[0.625rem]',
      default: 'h-5 text-xs leading-none',
    },
  },
})

export type Type = VariantProps<typeof chipVariants>['type']
export type Size = VariantProps<typeof chipVariants>['size']
