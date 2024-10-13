<script lang="ts">
  import { Label, RadioGroup as RadioGroupPrimitive } from 'bits-ui'
  import Circle from 'lucide-svelte/icons/circle'

  import { cn } from '../../utils'

  type $$Props = RadioGroupPrimitive.ItemProps & {
    label: string
  }
  type $$Events = RadioGroupPrimitive.ItemEvents

  let className: $$Props['class'] = undefined
  export let value: $$Props['value']
  export let id: $$Props['id']
  export let label: $$Props['label'] = 'label'
  export { className as class }
</script>

<div class="flex items-center space-x-2">
  <RadioGroupPrimitive.Item
    {value}
    class="{cn(
      'peer border-on-surface-placeholder data-[state=checked]:border-primary  text-primary ring-offset-background focus-visible:ring-ring aspect-square h-5 w-5 rounded-full border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}"
    {...$$restProps}
    on:click
  >
    <div class="flex items-center justify-center">
      <RadioGroupPrimitive.ItemIndicator>
        <Circle class="h-2.5 w-2.5 fill-primary text-current" />
      </RadioGroupPrimitive.ItemIndicator>
    </div>
  </RadioGroupPrimitive.Item>
  <Label.Root
    for="{id}"
    class="text-button2 font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >{label}</Label.Root
  >
</div>
