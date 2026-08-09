<script lang="ts">
  import privacyPolicy from '$lib/markdowns/privacy-policy.md?raw';

  import SvelteMarkdown from 'svelte-markdown';
</script>

<div class="flex justify-center pt-5">
  <div class="prose w-min-[800px] w-[60vw]">
    <SvelteMarkdown source={privacyPolicy} />
  </div>
</div>
