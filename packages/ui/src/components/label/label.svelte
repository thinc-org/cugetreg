<script lang="ts">
  import { cn } from '../../utils'
  import { labelVariants, type Props } from './index.js'

  let className: string | undefined | null = undefined

  export let state: Props['state'] = 'default'
  export let label: string = ''
  export { className as class }
</script>

<p class="{cn(labelVariants({ state, className }))}">
  {label}
</p>
