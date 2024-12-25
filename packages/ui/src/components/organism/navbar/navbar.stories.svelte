<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { Navbar } from './index.js'

  const { Story } = defineMeta<Navbar>({
    title: 'Organism/Navbar',
    component: Navbar,
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
  args={{ isLoggedIn: true, name: 'testname testname' }}
/>

<Story
  name="Mobile"
  parameters={{ viewport: { defaultViewport: 'mobile2' } }}
/>

<Story
  name="Mobile & Loggin In"
  parameters={{ viewport: { defaultViewport: 'mobile2' } }}
  args={{ isLoggedIn: true, name: 'testname testname' }}
/>
