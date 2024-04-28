<script lang="ts">
  import { cn } from '$lib/utils'
  import { QueryClientProvider } from '@tanstack/svelte-query'
  import '../app.css'
  import type { LayoutData } from './$types'

  export let data: LayoutData
</script>

<svelte:head>
  <title>CU Get Reg</title>
  <meta name="description" content="CU Get Reg" />
</svelte:head>

<QueryClientProvider client="{data.queryClient}">
  <div class="{cn(data.darkMode && 'dark', 'bg-background')}" id="root">
    <slot />
  </div>
</QueryClientProvider>
