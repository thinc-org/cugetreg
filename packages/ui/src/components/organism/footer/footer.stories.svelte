<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'

  import { Footer } from './index.js'

  export const meta = {
    title: 'Organism/Footer',
    component: Footer,
    tags: ['autodocs'],
  } satisfies Meta<Footer>
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'
</script>

<Template let:args>
  <Footer {...args} />
</Template>

<Story
  name="Mobile"
  parameters={{ viewport: { defaultViewport: 'mobile2' } }}
/>

<Story
  name="Desktop"
  parameters={{ viewport: { defaultViewport: 'tablet' } }}
/>
