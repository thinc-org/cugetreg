<script lang="ts">
  import { goto } from '$app/navigation';
  import { homeStore } from '$lib/homeStore.svelte';

  import { onMount } from 'svelte';
  onMount(() => {
    if (homeStore.currentUrl) {
      goto(homeStore.currentUrl, { replaceState: true });
    } else {
      goto('/S/courses?term=2568%2F1', { replaceState: true });
    }
  });
</script>

<div></div>
