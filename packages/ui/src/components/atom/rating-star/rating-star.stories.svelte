<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { RatingStar } from './index.js'

  const { Story } = defineMeta<typeof RatingStar>({
    title: 'Atom/Rating Star',
    component: RatingStar,
    tags: ['autodocs'],
    argTypes: {
      rating: {
        control: {
          type: 'range',
          min: 0,
          max: 5,
          step: 0.5,
        },
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
