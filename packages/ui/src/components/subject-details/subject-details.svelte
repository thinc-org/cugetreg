<script lang="ts">
  import { setContext } from 'svelte'
  export let variant: 'left' | 'center' | 'right' | 'mobile' = 'center'
  export let className: string = '' // Additional classes can be passed
  setContext('subject-details-variant', variant)
</script>

<div class="{`subject-details ${className}`}">
  <slot></slot>
  <!-- This will allow nesting of Label and Description -->
</div>

<style lang="postcss">
  /* Base styles for the component */
  .subject-details {
    @layer p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800;
  }
</style>
