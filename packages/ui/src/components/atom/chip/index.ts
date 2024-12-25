import { tv } from 'tailwind-variants'
export { default as Chip } from './chip.svelte'

export const chipVariants = tv({
  base: 'inline-flex select-none items-center justify-between gap-1 rounded-full px-2 py-1 text-caption transition-colors bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-offset-2',
})
