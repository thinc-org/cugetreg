<script lang="ts">
  import type { Snippet } from 'svelte'
  import { createBubbler } from 'svelte/legacy'

  const bubble = createBubbler()
  import type { HTMLAttributes } from 'svelte/elements'

  import { cn } from '@repo/utils'

  type $$Props = HTMLAttributes<HTMLTableRowElement> & {
    'data-state'?: unknown
  }

  interface Props {
    class?: $$Props['class']
    children?: Snippet
    [key: string]: unknown
  }

  let { class: className = undefined, children, ...rest }: Props = $props()
</script>

<tr
  class={cn(
    'hover:bg-muted/50 data-[state=selected]:bg-muted border-b border-b-surface-container-low transition-colors ',
    className,
  )}
  {...rest}
  onclick={bubble('click')}
  onkeydown={bubble('keydown')}
>
  {@render children?.()}
</tr>
