<script lang="ts">
  import type { HTMLTdAttributes } from 'svelte/elements'

  import { cn } from '../../utils'

  type $$Props = HTMLTdAttributes

  let className: $$Props['class'] = undefined
  export { className as class }
</script>

<td
  class="{cn(
    'p-4 align-middle [&:has([role=checkbox])]:pr-0 text-on-surface font-normal text-body1',
    className,
  )}"
  {...$$restProps}
  on:click
  on:keydown
>
  <slot />
</td>
