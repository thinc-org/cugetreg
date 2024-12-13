<script lang="ts">
  import { cn } from '../../utils'
  import { type Events, inputVariants, type Props } from './index.js'

  type $$Props = Props
  type $$Events = Events

  let className: $$Props['class'] = undefined
  export let value: $$Props['value'] = undefined
  export let state: $$Props['state'] = 'default'
  export { className as class }

  // Workaround for https://github.com/sveltejs/svelte/issues/9305
  // Fixed in Svelte 5, but not backported to 4.x.
  export let readonly: $$Props['readonly'] = undefined
</script>

<input
  class="{cn(className, inputVariants({ state }))}"
  bind:value
  {readonly}
  on:blur
  on:change
  on:click
  on:focus
  on:focusin
  on:focusout
  on:keydown
  on:keypress
  on:keyup
  on:mouseover
  on:mouseenter
  on:mouseleave
  on:mousemove
  on:paste
  on:input
  on:wheel|passive
  {...$$restProps}
/>
