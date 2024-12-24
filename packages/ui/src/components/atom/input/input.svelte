<script lang="ts">
  import { createBubbler, passive } from 'svelte/legacy'

  const bubble = createBubbler()
  import type { HTMLInputAttributes } from 'svelte/elements'

  import { cn } from '@repo/utils'

  import type { InputEvents } from './index.js'

  type $$Props = HTMLInputAttributes
  type $$Events = InputEvents

  // Workaround for https://github.com/sveltejs/svelte/issues/9305

  interface Props {
    class?: $$Props['class']
    value?: $$Props['value']
    // Fixed in Svelte 5, but not backported to 4.x.
    readonly?: $$Props['readonly']
    [key: string]: unknown
  }

  let {
    class: className = undefined,
    value = $bindable(undefined),
    readonly = undefined,
    ...rest
  }: Props = $props()
</script>

<input
  class={cn(
    'flex w-full h-10 rounded-button bg-surface-container-lowest px-4 text-button2 placeholder:text-on-surface hover:outline-none hover:ring-1 hover:ring-primary focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-primary disabled:cursor-not-allowed placeholder:disabled:text-on-surface-disabled disabled:hover:ring-0',
    className,
  )}
  bind:value
  {readonly}
  onblur={bubble('blur')}
  onchange={bubble('change')}
  onclick={bubble('click')}
  onfocus={bubble('focus')}
  onfocusin={bubble('focusin')}
  onfocusout={bubble('focusout')}
  onkeydown={bubble('keydown')}
  onkeypress={bubble('keypress')}
  onkeyup={bubble('keyup')}
  onmouseover={bubble('mouseover')}
  onmouseenter={bubble('mouseenter')}
  onmouseleave={bubble('mouseleave')}
  onmousemove={bubble('mousemove')}
  onpaste={bubble('paste')}
  oninput={bubble('input')}
  use:passive={['wheel', () => bubble('wheel')]}
  {...rest}
/>
