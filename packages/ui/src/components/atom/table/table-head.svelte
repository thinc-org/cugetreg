<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLThAttributes } from 'svelte/elements'

  import { cn } from '@repo/utils'

  type $$Props = HTMLThAttributes

  interface Props {
    class?: $$Props['class']
    children?: Snippet
    [key: string]: unknown
  }

  let { class: className = undefined, children, ...rest }: Props = $props()
</script>

<th
  class={cn(
    'text-primary text-table-header h-8 px-4 text-left align-middle font-medium border-x-[1px] border-surface [&:has([role=checkbox])]:pr-0 first:rounded-tl-xl last:rounded-tr-xl',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</th>
