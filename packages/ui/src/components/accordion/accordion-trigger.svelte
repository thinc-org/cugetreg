<script lang="ts">
  import { Accordion as AccordionPrimitive } from 'bits-ui'
  import { ChevronDown } from 'lucide-svelte'
  import { cn } from '../../utils'

  type $$Props = AccordionPrimitive.TriggerProps
  type $$Events = AccordionPrimitive.TriggerEvents

  let className: $$Props['class'] = undefined
  export let level: AccordionPrimitive.HeaderProps['level'] = 3
  export { className as class }
</script>

<AccordionPrimitive.Header {level} class="flex">
  <AccordionPrimitive.Trigger
    class="{cn(
      'flex flex-1 items-center justify-between py-4 font-medium transition-all [&[data-state=open]>svg]:rotate-180 px-2',
      className,
    )}"
    {...$$restProps}
    on:click
  >
    <slot />
    <ChevronDown class="h-6 w-6 transition-transform duration-200" />
  </AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
