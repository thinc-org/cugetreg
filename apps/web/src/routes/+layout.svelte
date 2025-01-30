<script lang="ts">
  import '@repo/ui/css'

  import type { Snippet } from 'svelte'

  interface Props {
    children: Snippet
  }

  let { children }: Props = $props()
</script>

<svelte:head>
  <title>CU Get Reg (v2 alpha)</title>
</svelte:head>

{@render children()}
