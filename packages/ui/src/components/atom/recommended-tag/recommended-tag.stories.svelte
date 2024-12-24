<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { RecommendedTag } from './index.js'

  const { Story } = defineMeta<typeof RecommendedTag>({
    title: 'Atom/RecommendedTag',
    component: RecommendedTag,
    tags: ['autodocs'],
    argTypes: {
      class: {
        control: false,
      },
    },
  })
</script>

<!--👇 Each story then reuses that template-->

<Story name="Default" />
