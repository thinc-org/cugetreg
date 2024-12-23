<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import { cn } from '../../utils'

  type $$Props = HTMLAttributes<HTMLTableRowElement> & {
    'data-state'?: unknown
  }

  let className: $$Props['class'] = undefined
  export { className as class }
</script>

<tr
  class={cn(
    'hover:bg-muted/50 data-[state=selected]:bg-muted border-b border-b-surface-container-low transition-colors ',
    className,
  )}
  {...$$restProps}
  on:click
  on:keydown
>
  <slot />
</tr>
