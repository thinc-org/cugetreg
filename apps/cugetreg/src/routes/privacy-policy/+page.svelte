<script lang="ts">
  import privacyPolicy from '$lib/markdowns/privacy-policy.md?raw';
  import { Footer } from '@cugetreg/ui/organisms/footer';
  import SvelteMarkdown from 'svelte-markdown';
</script>

<div class="flex flex-col items-center justify-center pt-5">
  <div class="prose w-[90vw] md:w-[60vw] pb-10">
    <SvelteMarkdown source={privacyPolicy} />
  </div>
  <Footer />
</div>
