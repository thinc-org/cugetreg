<script lang="ts">
  import { cn } from '../../utils'
  import { chipVariants, type Size, type Type } from './index.js'

  let className: string | undefined | null = undefined
  export let type: Type
  export let size: Size = 'default'
  export { className as class }

  const label = {
    SC: 'หมวดวิทย์',
    SO: 'หมวดสังคม',
    HU: 'หมวดมนุษย์',
    IN: 'หมวดสหฯ',
  }
</script>

<span class="{cn(chipVariants({ type, size, className }))}" {...$$restProps}>
  {#if type}
    {label[type]}
  {/if}
</span>
