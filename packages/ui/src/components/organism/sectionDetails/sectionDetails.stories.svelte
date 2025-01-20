<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { sectionDetails } from './index.js'

  const { Story } = defineMeta<typeof sectionDetails>({
    title: 'Organism/sectionDetails',
    component: sectionDetails,
    tags: ['autodocs'],
    argTypes: {
      isLoggedIn: {
        control: 'boolean',
      },
      name: {
        control: 'text',
      },
    },
  })
</script>

<Story
  name="Desktop"
  parameters={{ viewport: { defaultViewport: 'tablet' } }}
/>

<Story
  name="Desktop & Logged In"
  parameters={{ viewport: { defaultViewport: 'tablet' } }}
  args={{ isLoggedIn: true, name: 'Testname testname' }}
/>

<Story
  name="Mobile"
  parameters={{ viewport: { defaultViewport: 'mobile2' } }}
/>

<Story
  name="Mobile & Loggin In"
  parameters={{ viewport: { defaultViewport: 'mobile2' } }}
  args={{ isLoggedIn: true, name: 'Testname testname' }}
/>
