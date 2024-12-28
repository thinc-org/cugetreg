<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { RatingStar } from './index.js'

  const { Story } = defineMeta<typeof RatingStar>({
    title: 'Atom/RatingStar',
    component: RatingStar,
    tags: ['autodocs'],
    argTypes: {
      rating: {
        control: 'number',
      },
    },
  })
</script>

<Story
  name="Default"
  args={{
    rating: 3.5,
  }}
/>
