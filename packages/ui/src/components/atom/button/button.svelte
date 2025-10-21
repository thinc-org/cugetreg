<script lang="ts" module>
  import type {
    HTMLAnchorAttributes,
    HTMLButtonAttributes,
  } from 'svelte/elements';
  import { tv, type VariantProps } from 'tailwind-variants';

  import { cn, type WithElementRef } from '../../../utils';

  export const buttonVariants = tv({
    base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    variants: {
      variant: {
        solid: 'hover:outline-none hover:ring-1.5 hover:ring-offset-2',
        outlined: 'ring-1.5 hover:ring-0',
        ghost: '',
      },
      size: {
        sm: 'h-8 px-2',
        default: 'h-9 px-4',
        lg: 'h-10 px-5',
      },
      color: {
        primary: 'focus-visible:ring-primary-container',
        neutral: 'text-on-surface focus-visible:ring-surface-container-low',
        error: 'text-on-error-container focus-visible:ring-error-container',
        secondary:
          'text-on-secondary-container focus-visible:ring-secondary-container',
      },
    },
    compoundVariants: [
      {
        variant: 'solid',
        color: 'primary',
        class: 'bg-primary-container hover:ring-primary-container',
      },
      {
        variant: 'solid',
        color: 'neutral',
        class: 'bg-surface-container-low hover:ring-surface-container-low',
      },
      {
        variant: 'solid',
        color: 'error',
        class: 'bg-error-container hover:ring-error-container',
      },
      {
        variant: 'solid',
        color: 'secondary',
        class: 'bg-secondary-container hover:ring-secondary-container',
      },
      {
        variant: 'outlined',
        color: 'primary',
        class: 'border-primary-container hover:bg-primary-container',
      },
      {
        variant: 'outlined',
        color: 'neutral',
        class: 'border-surface-container-low hover:bg-surface-container-low',
      },
      {
        variant: 'outlined',
        color: 'error',
        class: 'border-error-container hover:bg-error-container',
      },
      {
        variant: 'outlined',
        color: 'secondary',
        class: 'border-secondary-container hover:bg-secondary-container',
      },
      {
        variant: 'ghost',
        color: 'primary',
        class: 'hover:bg-primary-container',
      },
      {
        variant: 'ghost',
        color: 'neutral',
        class: 'hover:bg-surface-container-low',
      },
      {
        variant: 'ghost',
        color: 'error',
        class: 'hover:bg-error-container',
      },
      {
        variant: 'ghost',
        color: 'secondary',
        class: 'hover:bg-secondary-container',
      },
    ],
    defaultVariants: {
      variant: 'solid',
      size: 'default',
      color: 'primary',
    },
  });

  export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
  export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

  export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
    WithElementRef<HTMLAnchorAttributes> & {
      variant?: ButtonVariant;
      size?: ButtonSize;
    };
</script>

<script lang="ts">
  let {
    class: className,
    variant,
    size,
    ref = $bindable(null),
    href = undefined,
    type = 'button',
    disabled,
    children,
    ...restProps
  }: ButtonProps = $props();
</script>

{#if href}
  <a
    bind:this={ref}
    data-slot="button"
    class={cn(buttonVariants({ variant, size }), className)}
    href={disabled ? undefined : href}
    aria-disabled={disabled}
    role={disabled ? 'link' : undefined}
    tabindex={disabled ? -1 : undefined}
    {...restProps}
  >
    {@render children?.()}
  </a>
{:else}
  <button
    bind:this={ref}
    data-slot="button"
    class={cn(buttonVariants({ variant, size }), className)}
    {type}
    {disabled}
    {...restProps}
  >
    {@render children?.()}
  </button>
{/if}
