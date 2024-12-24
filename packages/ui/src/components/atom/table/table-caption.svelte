<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import { cn } from '@repo/utils'

  type $$Props = HTMLAttributes<HTMLTableCaptionElement>

  interface Props {
    class?: $$Props['class']
    children?: Snippet
    [key: string]: unknown
  }

  let { class: className = undefined, children, ...rest }: Props = $props()
</script>

<caption class={cn('text-muted-foreground mt-4 text-sm', className)} {...rest}>
  {@render children?.()}
</caption>
