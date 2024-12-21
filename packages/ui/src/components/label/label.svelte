<script lang="ts">
  import { cn } from '../../utils'

  let className: string | undefined | null = undefined

  export let label = ''
  export { className as class }
</script>

<p class="{cn('mb-2 text-button2 text-neutral-400', className)}">
  {label}
</p>
