<script lang="ts">
  import { cn } from '../../utils'
  import { chipVariants, type Day } from './index.js'

  let className: string | undefined | null = undefined
  export let href: string | undefined = undefined
  export let day: Day
  export { className as class }

  const label = {
    MO: 'จันทร์',
    TU: 'อังคาร',
    WE: 'พุธ',
    TH: 'พฤหัส',
    FR: 'ศุกร์',
    SA: 'เสาร์',
    SU: 'อาทิตย์',
  }
</script>

<svelte:element
  this="{href ? 'a' : 'span'}"
  {href}
  class="{cn(chipVariants({ day, className }))}"
  {...$$restProps}
>
  {#if day}
    {label[day]}
  {/if}
</svelte:element>
