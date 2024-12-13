<script lang="ts">
  import { X } from 'lucide-svelte'

  import { cn } from '../../utils.js'
  import { chipVariants } from './index.js'

  let className: string | undefined | null = undefined
  export let closable: boolean = false
  export let onClose: () => void = () => {}
  export { className as class }
</script>

<span class="{cn(chipVariants({ className }))}" {...$$restProps}>
  <slot />
  {#if closable}
    <button type="button" on:click="{onClose}"
      ><X class="size-3" strokeWidth="{4}" /></button
    >
  {/if}
</span>
