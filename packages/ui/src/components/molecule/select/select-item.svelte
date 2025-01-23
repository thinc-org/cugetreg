<script lang="ts">
  import { Select as SelectPrimitive, type WithoutChild } from 'bits-ui'
  import { Check } from 'lucide-svelte'

  import { cn } from '@repo/utils'

  let {
    ref = $bindable(null),
    class: className,
    value,
    label,
    children: childrenProp,
    check = false,
    ...restProps
  }: WithoutChild<SelectPrimitive.ItemProps & { check?: boolean }> = $props()
</script>

<SelectPrimitive.Item
  bind:ref
  {value}
  class={cn(
    `data-[highlighted]:bg-surface-container-lowest data-[highlighted]:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-[5px] py-1.5 ${check ? 'pl-2 pr-4' : 'px-2'} text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50`,
    className,
  )}
  {...restProps}
>
  {#snippet children({ selected, highlighted })}
    {#if childrenProp}
      {@render childrenProp({ selected, highlighted })}
    {:else}
      {label || value}
    {/if}
    {#if check}
      <span class="absolute right-2 flex size-3.5 items-center justify-center">
        {#if selected}
          <Check class="size-4" />
        {/if}
      </span>
    {/if}
  {/snippet}
</SelectPrimitive.Item>
