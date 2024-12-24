<script lang="ts">
  import { Button as ButtonPrimitive } from 'bits-ui'
  import type { Snippet } from 'svelte'

  import { cn } from '@repo/utils'

  import { buttonVariants, type Events, type Props } from './index.js'
  type $$Props = Props
  type $$Events = Events

  interface IconButtonProps {
    class?: $$Props['class']
    variant?: $$Props['variant']
    size?: $$Props['size']
    color?: $$Props['color']
    builders?: $$Props['builders']
    children?: Snippet
    [key: string]: unknown
  }

  let {
    class: className = undefined,
    variant = 'solid',
    size = 'default',
    color = 'primary',
    builders = [],
    children,
    ...rest
  }: IconButtonProps = $props()
</script>

<ButtonPrimitive.Root
  {builders}
  class={cn(buttonVariants({ variant, size, color, className }))}
  type="button"
  {...rest}
  on:click
  on:keydown
>
  {@render children?.()}
</ButtonPrimitive.Root>
