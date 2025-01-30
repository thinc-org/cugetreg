<script lang="ts">
  import { getContext, type Snippet } from 'svelte'

  const variant = getContext<'left' | 'center' | 'right' | 'mobile'>(
    'subject-details-variant',
  )
  const roundedStyle = {
    left: 'rounded-l-full',
    right: 'rounded-r-full',
    center: '',
    mobile: 'rounded-full',
  }

  interface Props {
    className?: string // Additional classes
    text?: string // Optional text prop, can be overridden by slot
    children?: Snippet
  }

  let { className = '', text = '', children }: Props = $props()
</script>

<div
  class="{`bg-surface-container-lowest px-4 py-[7px] text-primary text-table-header font-medium ${roundedStyle[variant]} ${className}`} "
>
  {#if children}
    {@render children()}
  {:else}
    {text}
  {/if}
</div>
