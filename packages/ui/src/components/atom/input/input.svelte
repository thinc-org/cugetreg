<script lang="ts" module>
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { tv, type VariantProps } from 'tailwind-variants';

  import { cn, type WithElementRef } from '@repo/ui/utils';

  export const inputVariants = tv({
    base: 'border-input bg-background selection:bg-primary dark:bg-input/30 selection:text-primary-foreground ring-offset-background placeholder:text-on-surface shadow-xs flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-button2 outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-container-lowest disabled:border-none disabled:ring-0 disabled:placeholder:text-on-surface-disabled',
    variants: {
      state: {
        default:
          'bg-surface-container-lowest hover:ring-primary hover:ring-1 focus-visible:ring-1.5 focus-visible:ring-primary',
        error: 'ring-error ring-1.5',
        success: 'ring-success ring-1.5',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  });

  export type InputState = VariantProps<typeof inputVariants>['state'];

  // todo support file or create another ui component that support file

  export type InputProps = WithElementRef<HTMLInputAttributes> & {
    state?: InputState;
  };
</script>

<script lang="ts">
  let {
    ref = $bindable(null),
    value = $bindable(),
    type,
    state,
    class: className,
    'data-slot': dataSlot = 'input',
    ...restProps
  }: InputProps = $props();
</script>

<input
  bind:this={ref}
  data-slot={dataSlot}
  class={cn(inputVariants({ state }), className)}
  {type}
  bind:value
  {...restProps}
/>
