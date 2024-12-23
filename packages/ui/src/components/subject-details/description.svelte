<script lang="ts">
  import { getContext } from 'svelte'
  const variant = getContext<'left' | 'center' | 'right' | 'mobile'>(
    'subject-details-variant',
  )

  const textStyle = variant === 'mobile' ? 'p-2' : 'p-4'
  export let className: string = '' // Additional classes
  export let text: string = '' // Optional text prop, can be overridden by slot
</script>

<div class={`text-on-surface font-normal text-body1 ${textStyle} ${className}`}>
  <slot>{text}</slot>
</div>
