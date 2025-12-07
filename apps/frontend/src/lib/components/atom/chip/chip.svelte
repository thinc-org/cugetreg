<script lang="ts">
  import { X } from 'lucide-svelte'
  import type { Snippet } from 'svelte'

  import { cn } from '@repo/utils'

  import { chipVariants } from './index.js'

  interface Props {
    class?: string | undefined | null
    closable?: boolean
    onClose?: () => void
    children?: Snippet
    [key: string]: unknown
  }

  let {
    class: className = undefined,
    closable = false,
    onClose = () => {},
    children,
    ...rest
  }: Props = $props()
</script>

<span class={cn(chipVariants({ className }))} {...rest}>
  {@render children?.()}
  {#if closable}
    <button type="button" onclick={onClose}>
      <X class="size-3" strokeWidth={4} />
    </button>
  {/if}
</span>
