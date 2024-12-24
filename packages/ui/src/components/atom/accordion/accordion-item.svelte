<script lang="ts">
  import { Accordion as AccordionPrimitive } from 'bits-ui'
  import type { Snippet } from 'svelte'

  import { cn } from '@repo/utils'

  type $$Props = AccordionPrimitive.ItemProps

  interface Props {
    class?: $$Props['class']
    value: $$Props['value']
    children?: Snippet
    [key: string]: unknown
  }

  let {
    class: className = undefined,
    value,
    children,
    ...rest
  }: Props = $props()
</script>

<AccordionPrimitive.Item {value} class={cn('', className)} {...rest}>
  {@render children?.()}
</AccordionPrimitive.Item>
