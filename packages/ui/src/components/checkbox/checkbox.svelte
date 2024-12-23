<script lang="ts">
  import { Checkbox as CheckboxPrimitive, Label } from 'bits-ui'
  import Check from 'lucide-svelte/icons/check'

  import { cn } from '../../utils'

  type $$Props = CheckboxPrimitive.Props & {
    label?: string | undefined | null
  }
  type $$Events = CheckboxPrimitive.Events

  let className: $$Props['class'] = undefined
  export let checked: $$Props['checked'] = false
  export let label: $$Props['label'] = undefined
  export { className as class }
</script>

<div class="flex items-center space-x-2 p-1">
  <CheckboxPrimitive.Root
    class={cn(
      'border-on-surface-placeholder ring-offset-background focus-visible:ring-ring data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-neutral-white peer box-content h-4 w-4 shrink-0 rounded-sm border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
      className,
    )}
    bind:checked
    {...$$restProps}
    on:click
  >
    <CheckboxPrimitive.Indicator
      class={cn('flex h-4 w-4 items-center justify-center text-current')}
      let:isChecked
    >
      {#if isChecked}
        <Check class="h-4 w-4" />
      {/if}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
  {#if label}
    <Label.Root
      id="terms-label"
      for="terms"
      class="text-button2 font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {label}
    </Label.Root>
  {/if}
</div>
