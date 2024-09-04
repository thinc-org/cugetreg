<script lang="ts">
  import { Button as ButtonPrimitive } from 'bits-ui'

  import { cn } from '../../utils'
  import { buttonVariants, type Events, type Props } from './index.js'

  type $$Props = Props
  type $$Events = Events

  let className: $$Props['class'] = undefined
  export let variant: $$Props['variant'] = 'solid'
  export let size: $$Props['size'] = 'default'
  export let color: $$Props['color'] = 'primary'
  export let builders: $$Props['builders'] = []
  export { className as class }
</script>

<ButtonPrimitive.Root
  {builders}
  class="{cn(buttonVariants({ variant, size, color, className }))}"
  type="button"
  {...$$restProps}
  on:click
  on:keydown
>
  <slot />
</ButtonPrimitive.Root>
