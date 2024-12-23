<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'

  import { RecommendedTag } from './index.js'

  export const meta = {
    title: 'Atom/RecommendedTag',
    component: RecommendedTag,
    tags: ['autodocs'],
    argTypes: {
      class: {
        control: false,
      },
    },
  } satisfies Meta<RecommendedTag>
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'
</script>

<!--👇 We create a “template” of how args map to rendering-->
<Template let:args>
  <RecommendedTag {...args} />
</Template>

<!--👇 Each story then reuses that template-->
<Story name="Default" />
