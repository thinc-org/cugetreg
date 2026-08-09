<script lang="ts">
  import termsConditions from '$lib/markdowns/terms-and-conditions.md?raw';

  import SvelteMarkdown from 'svelte-markdown';
</script>

<div class="flex justify-center pt-5">
  <div class="prose w-min-[800px] w-[60vw]">
    <SvelteMarkdown source={termsConditions} />
  </div>
</div>
