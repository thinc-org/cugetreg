<script lang="ts">
  import { Select as SelectPrimitive, type WithoutChild } from 'bits-ui'
  import { ChevronDown } from 'lucide-svelte'

  import { cn } from '@repo/utils'

  let {
    ref = $bindable(null),
    class: className,
    children,
    arrow = false,
    ...restProps
  }: WithoutChild<SelectPrimitive.TriggerProps & { arrow?: boolean }> = $props()
</script>

<SelectPrimitive.Trigger
  bind:ref
  class={cn(
    'bg-surface border-[1px] border-neutral-200 ring-offset-background data-[placeholder]:text-muted-foreground gap-2.5 focus:ring-ring flex h-10 w-full items-center justify-between rounded-[11px] p-2  text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
    className,
  )}
  {...restProps}
>
  <div
    class="w-full h-full overflow-hidden flex items-center text-left truncate"
  >
    {@render children?.()}
  </div>
  {#if arrow}
    <ChevronDown class="size-4 text-on-surface-placeholder stroke-[4px]" />
  {/if}
  <ChevronDown class="size-4 text-on-surface-placeholder stroke-[4px]" />
</SelectPrimitive.Trigger>
