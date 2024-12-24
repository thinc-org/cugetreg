<script lang="ts">
  import { RadioGroup as RadioGroupPrimitive } from 'bits-ui'
  import type { Snippet } from 'svelte'

  import { cn } from '@repo/utils'

  type $$Props = RadioGroupPrimitive.Props

  interface Props {
    class?: $$Props['class']
    value?: $$Props['value']
    children?: Snippet
    [key: string]: unknown
  }

  let {
    class: className = undefined,
    value = $bindable(undefined),
    children,
    ...rest
  }: Props = $props()
</script>

<RadioGroupPrimitive.Root
  bind:value
  class={cn('grid gap-2 p-1', className)}
  {...rest}
>
  {@render children?.()}
</RadioGroupPrimitive.Root>
