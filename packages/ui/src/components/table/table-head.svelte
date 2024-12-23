<script lang="ts">
  import type { HTMLThAttributes } from 'svelte/elements'

  import { cn } from '../../utils'

  type $$Props = HTMLThAttributes

  let className: $$Props['class'] = undefined
  export { className as class }
</script>

<th
  class={cn(
    'text-primary text-table-header h-8 px-4 text-left align-middle font-medium border-x-[1px] border-surface [&:has([role=checkbox])]:pr-0 first:rounded-tl-xl last:rounded-tr-xl',
    className,
  )}
  {...$$restProps}
>
  <slot />
</th>
