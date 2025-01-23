<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { Footer } from './index.js'

  const { Story } = defineMeta<typeof Footer>({
    title: 'Organism/Footer',
    component: Footer,
    tags: ['autodocs'],
  })
</script>

<Story
  name="Mobile"
  parameters={{ viewport: { defaultViewport: 'iphone13' } }}
/>

<Story
  name="Desktop"
  parameters={{ viewport: { defaultViewport: 'ipad12p' } }}
/>
