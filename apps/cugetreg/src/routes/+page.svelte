<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    goto('/S/courses?term=2568%2F1', { replaceState: true });
  });
</script>

<div></div>

