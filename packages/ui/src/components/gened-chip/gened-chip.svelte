<script lang="ts">
  import { cn } from '../../utils'
  import { Chip } from '../chip'
  import { chipVariants, type Type } from './index.js'

  let className: string | undefined | null = undefined
  export let type: Type
  export let closable: boolean = false
  export let onClose: () => void = () => {}
  export { className as class }

  const label = {
    SC: 'วิทย์',
    SO: 'สังคม',
    HU: 'มนุษย์',
    IN: 'สหฯ',
  }
</script>

<Chip
  class="{cn(chipVariants({ type, className }))}"
  {closable}
  {onClose}
  {...$$restProps}
>
  {#if type}
    {label[type]}
  {/if}
</Chip>
