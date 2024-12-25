<script lang="ts">
  import { Accordion as AccordionPrimitive } from 'bits-ui'
  import { ChevronDown } from 'lucide-svelte'
  import type { Snippet } from 'svelte'

  import { cn } from '@repo/utils'

  type $$Props = AccordionPrimitive.TriggerProps
  type $$Events = AccordionPrimitive.TriggerEvents

  interface Props {
    class?: $$Props['class']
    level?: AccordionPrimitive.HeaderProps['level']
    children?: Snippet
    [key: string]: unknown
  }

  let {
    class: className = undefined,
    level = 3,
    children,
    ...rest
  }: Props = $props()
</script>

<AccordionPrimitive.Header {level} class="flex">
  <AccordionPrimitive.Trigger
    class={cn(
      'flex flex-1 items-center justify-between py-4 font-medium transition-all [&[data-state=open]>svg]:rotate-180 px-2',
      className,
    )}
    {...rest}
    on:click
  >
    {@render children?.()}
    <ChevronDown class="h-6 w-6 transition-transform duration-200" />
  </AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
