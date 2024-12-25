<script lang="ts">
  import { cn } from '@repo/utils'

  import { Chip } from '../chip/index.js'
  import { chipVariants, type Type } from './index.js'

  interface Props {
    class?: string | undefined | null
    type: Type
    closable?: boolean
    onClose?: () => void
    [key: string]: unknown
  }

  let {
    class: className = undefined,
    type,
    closable = false,
    onClose = () => {},
    ...rest
  }: Props = $props()

  const label = {
    SC: 'วิทย์',
    SO: 'สังคม',
    HU: 'มนุษย์',
    IN: 'สหฯ',
  }
</script>

<Chip
  class={cn(chipVariants({ type, className }))}
  {closable}
  {onClose}
  {...rest}
>
  {#if type}
    {label[type]}
  {/if}
</Chip>
