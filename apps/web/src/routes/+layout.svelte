<script lang="ts">
  import '@repo/ui/css'

  import type { Snippet } from 'svelte'

  interface Props {
    children: Snippet
  }

  let { children }: Props = $props()
</script>

{@render children()}
