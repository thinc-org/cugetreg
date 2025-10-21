<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import { RecommendedTag } from './index.js';

  const { Story } = defineMeta({
    title: 'Atom/Recommended Tag',
    component: RecommendedTag,
    tags: ['autodocs', 'original'],
    argTypes: {
      class: {
        control: false,
      },
    },
  });
</script>

<!--👇 Each story then reuses that template-->

<Story name="Default" />
