<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'

  import { Navbar } from './index.js'

  export const meta = {
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
  } satisfies Meta<Navbar>
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'
</script>

<Template let:args>
  <Navbar {...args} />
</Template>

<Story
  name="Desktop"
  parameters="{{ viewport: { defaultViewport: 'tablet' } }}"
/>

<Story
  name="Mobile"
  parameters="{{ viewport: { defaultViewport: 'mobile2' } }}"
/>

<Story
  name="Desktop & Logged In"
  parameters="{{ viewport: { defaultViewport: 'tablet' } }}"
  args="{{ isLoggedIn: true, name: 'test name' }}"
/>

<Story
  name="Mobile & Loggin In"
  parameters="{{ viewport: { defaultViewport: 'mobile2' } }}"
  args="{{ isLoggedIn: true, name: 'test name' }}"
/>
