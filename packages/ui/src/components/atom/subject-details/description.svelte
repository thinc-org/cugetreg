<script lang="ts">
  import { getContext, type Snippet } from 'svelte'

  const variant = getContext<'left' | 'center' | 'right' | 'mobile'>(
    'subject-details-variant',
  )

  const textStyle = variant === 'mobile' ? 'p-2' : 'p-4'
  interface Props {
    className?: string // Additional classes
    text?: string // Optional text prop, can be overridden by slot
    children?: Snippet
  }

  let { className = '', text = '', children }: Props = $props()
</script>

<div class={`text-on-surface font-normal text-body1 ${textStyle} ${className}`}>
  {#if children}
    {@render children()}
  {:else}
    {text}
  {/if}
</div>
