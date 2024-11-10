<script lang="ts">
  import { cn } from '../../utils'
  import { Chip } from '../chip'
  import { chipVariants, type Status } from './index.js'

  let className: string | undefined | null = undefined
  export let status: Status
  export let closable: boolean = false
  export let onClose: () => void = () => {}
  export { className as class }
</script>

<Chip class="{cn(chipVariants({ status, className }))}" {closable} {onClose}>
  {#if status == 'close'}
    ปิด
  {:else}
    <slot />
  {/if}
</Chip>
