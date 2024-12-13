<script lang="ts">
  import { cn } from '../../utils'
  import { Chip } from '../chip'
  import { chipVariants, type Day } from './index.js'

  let className: string | undefined | null = undefined
  export let day: Day
  export let closable: boolean = false
  export let onClose: () => void = () => {}
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

<Chip
  class="{cn(chipVariants({ day, className }))}"
  {closable}
  {onClose}
  {...$$restProps}
  >{#if day}
    {label[day]}
  {/if}</Chip
>
