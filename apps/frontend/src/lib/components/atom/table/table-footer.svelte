<script lang="ts">
  import type { Snippet } from 'svelte'
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

<tfoot
  class={cn('bg-primary text-primary-foreground font-medium', className)}
  {...rest}
>
  {@render children?.()}
</tfoot>
