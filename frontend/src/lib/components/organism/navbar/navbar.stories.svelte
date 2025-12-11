<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { Navbar } from './index.js'

  const { Story } = defineMeta<typeof Navbar>({
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
  name="Mobile"
  parameters={{ viewport: { defaultViewport: 'iphone13' } }}
  args={{
    isLoggedIn: false,
  }}
/>

<Story
  name="Mobile & Loggin In"
  parameters={{ viewport: { defaultViewport: 'iphone13' } }}
  args={{
    isLoggedIn: true,
    name: 'Firstname Lastname',
    id: '6XXXXXXXXX',
  }}
/>

<Story
  name="Desktop"
  parameters={{ viewport: { defaultViewport: 'ipad12p' } }}
  args={{
    isLoggedIn: false,
  }}
/>

<Story
  name="Desktop & Logged In"
  parameters={{ viewport: { defaultViewport: 'ipad12p' } }}
  args={{
    isLoggedIn: true,
    name: 'Firstname Lastname',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
    id: '6XXXXXXXXX',
  }}
/>
