<script lang="ts">
  import { Label, Switch as SwitchPrimitive } from 'bits-ui'

  import { cn } from '@repo/utils'

  type $$Props = SwitchPrimitive.Props & {
    label?: string | undefined | null
  }
  type $$Events = SwitchPrimitive.Events

  interface Props {
    class?: $$Props['class']
    checked?: $$Props['checked']
    id?: $$Props['id']
    label?: $$Props['label']
    [key: string]: unknown
  }

  let {
    class: className = undefined,
    checked = $bindable(undefined),
    id = null,
    label = 'label',
    ...rest
  }: Props = $props()
</script>

<div class="flex items-center space-x-2">
  <SwitchPrimitive.Root
    bind:checked
    class={cn(
      'focus-visible:ring-ring focus-visible:ring-offset-background data-[state=checked]:border-primary data-[state=checked]:bg-primary-low data-[state=unchecked]:bg-surface-container-lowest peer inline-flex h-[18px] w-[32px] shrink-0 cursor-pointer items-center rounded-full border border-surface-container-high  transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...rest}
    on:click
    on:keydown
    {id}
  >
    <SwitchPrimitive.Thumb
      class={cn(
        'p-1 bg-surface-container-high data-[state=checked]:bg-primary pointer-events-none block h-3.5 w-3.5 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[14.5px] data-[state=unchecked]:translate-x-[1px]',
      )}
    />
  </SwitchPrimitive.Root>
  {#if label}
    <Label.Root
      for={id}
      class="text-button2 font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {label}
    </Label.Root>
  {/if}
</div>
