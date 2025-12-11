<script lang="ts">
  import type { Snippet } from 'svelte'
  import { createBubbler } from 'svelte/legacy'

  const bubble = createBubbler()
  import type { HTMLAttributes } from 'svelte/elements'

  import { cn } from '@repo/utils'

  type $$Props = HTMLAttributes<HTMLTableSectionElement>

  interface Props {
    class?: $$Props['class']
    children?: Snippet
    [key: string]: unknown
  }

  let { class: className = undefined, children, ...rest }: Props = $props()
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<thead
  class={cn('[&_tr]:border-b-0  bg-surface-container-lowest ', className)}
  {...rest}
  onclick={bubble('click')}
  onkeydown={bubble('keydown')}
>
  {@render children?.()}
</thead>
