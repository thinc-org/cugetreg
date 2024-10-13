<script lang="ts">
  import { Label, Switch as SwitchPrimitive } from 'bits-ui'

  import { cn } from '../../utils'

  type $$Props = SwitchPrimitive.Props & {
    label?: string | undefined | null
  }
  type $$Events = SwitchPrimitive.Events

  let className: $$Props['class'] = undefined
  export let checked: $$Props['checked'] = undefined
  export let id: $$Props['id'] = null
  export let label: $$Props['label'] = 'label'
  export { className as class }
</script>

<div class="flex items-center space-x-2">
  <SwitchPrimitive.Root
    bind:checked
    class="{cn(
      'focus-visible:ring-ring focus-visible:ring-offset-background data-[state=checked]:border-primary data-[state=checked]:bg-primary-low data-[state=unchecked]:bg-surface-container-lowest peer inline-flex h-[18px] w-[32px] shrink-0 cursor-pointer items-center rounded-full border-2 border-surface-container-high  transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}"
    {...$$restProps}
    on:click
    on:keydown
    {id}
  >
    <SwitchPrimitive.Thumb
      class="{cn(
        ' bg-surface-container-high data-[state=checked]:bg-primary pointer-events-none block h-3.5 w-3.5 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[14.5px] data-[state=unchecked]:translate-x-[1px]',
      )}"
    />
  </SwitchPrimitive.Root>
  {#if label}
    <Label.Root for="{id}">{label}</Label.Root>
  {/if}
</div>
