<script lang="ts">
  import type { Separator as SeparatorPrimitive } from 'bits-ui'

  import { cn } from '@repo/utils'

  import { Separator } from '../../atom/separator'

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: SeparatorPrimitive.RootProps = $props()
</script>

<Separator
  bind:ref
  class={cn('bg-muted -mx-1 my-1 h-px', className)}
  {...restProps}
/>
