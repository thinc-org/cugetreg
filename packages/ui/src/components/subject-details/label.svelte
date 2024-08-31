<script lang="ts">
  import { getContext } from 'svelte'
  const variant = getContext<'left' | 'center' | 'right' | 'mobile'>(
    'subject-details-variant',
  )
  const roundedStyle = {
    left: 'rounded-l-full',
    right: 'rounded-r-full',
    center: '',
    mobile: 'rounded-full',
  }

  export let className: string = '' // Additional classes
  export let text: string = '' // Optional text prop, can be overridden by slot
</script>

<div
  class="{`bg-surface-container-lowest px-4 py-[7px] text-primary text-table-header font-medium ${roundedStyle[variant]} ${className}`} "
>
  <slot>{text}</slot>
</div>
