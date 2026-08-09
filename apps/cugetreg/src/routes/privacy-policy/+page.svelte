<script lang="ts">
  import privacyPolicy from '$lib/markdowns/privacy-policy.md?raw';

  import SvelteMarkdown from 'svelte-markdown';

  import { Footer } from '@cugetreg/ui/organisms/footer';
</script>

<div class="flex flex-col items-center justify-center pt-5">
  <div class="prose w-[90vw] pb-10 md:w-[60vw]">
    <SvelteMarkdown source={privacyPolicy} />
  </div>
  <Footer />
</div>
