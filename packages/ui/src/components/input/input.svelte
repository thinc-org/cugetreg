<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'

  import { cn } from '../../utils'
  import type { InputEvents } from '.'

  type $$Props = HTMLInputAttributes
  type $$Events = InputEvents

  let className: $$Props['class'] = undefined
  export let value: $$Props['value'] = undefined
  export { className as class }

  // Workaround for https://github.com/sveltejs/svelte/issues/9305
  // Fixed in Svelte 5, but not backported to 4.x.
  export let readonly: $$Props['readonly'] = undefined
</script>

<input
  class="{cn(
    'flex w-full h-10 rounded-button bg-surface-container-lowest px-4 text-button2 placeholder:text-on-surface hover:outline-none hover:ring-1 hover:ring-primary focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-primary disabled:cursor-not-allowed placeholder:disabled:text-on-surface-disabled disabled:hover:ring-0',
    className,
  )}"
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
