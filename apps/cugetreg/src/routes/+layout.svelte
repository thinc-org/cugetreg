<script lang="ts">
  import '$lib/styles/app.css'
  import { Navbar } from '@cugetreg/ui/organisms/navbar'
  import type { LayoutData } from './$types'
  import type { Snippet } from 'svelte'
    import { getUserCartStore, initUserCartStore } from '$lib/stores/user-cart'

  let { data, children }: {
    data: LayoutData,
    children?: Snippet
  } = $props();

  initUserCartStore((() => data)());

  const userCart = getUserCartStore();

  console.log($userCart);
</script>

<Navbar />

{@render children?.()}

