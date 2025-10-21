<script lang="ts">
  import { Label, Switch as SwitchPrimitive } from 'bits-ui';

  import { cn, type WithoutChildrenOrChild } from '@repo/ui/utils';

  type SwitchProps = WithoutChildrenOrChild<SwitchPrimitive.RootProps> & {
    label?: string;
    id?: string;
  };

  let {
    ref = $bindable(null),
    class: className,
    checked = $bindable(false),
    label,
    id,
    ...restProps
  }: SwitchProps = $props();
</script>

<div class="flex items-center space-x-2">
  <SwitchPrimitive.Root
    bind:ref
    bind:checked
    data-slot="switch"
    class={cn(
      'data-[state=checked]:border-primary data-[state=checked]:bg-primary-low [state=unchecked]:bg-surface-container-lowest focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 shadow-xs peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-surface-container-high outline-none transition-all focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {id}
    {...restProps}
  >
    <SwitchPrimitive.Thumb
      data-slot="switch-thumb"
      class={cn(
        'bg-surface-container-high data-[state=checked]:bg-primary dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0',
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
