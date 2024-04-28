<script lang="ts">
  import { cn } from '$lib/utils'
  import '../app.css'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<!-- TODO: Setup SEO -->
<svelte:head>
  <title>CU Get Reg</title>
  <meta name="description" content="CU Get Reg" />
</svelte:head>

<div class={cn(data.darkMode && 'dark', 'bg-background')} id="root">
  <slot />
</div>
