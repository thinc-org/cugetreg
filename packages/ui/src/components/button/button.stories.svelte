<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'

  import { Button } from './index.js'

  export const meta = {
    title: 'Atom/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
      variant: {
        control: {
          type: 'select',
        },
        options: ['solid', 'outline'],
        defaultValue: 'solid',
      },
      size: {
        control: {
          type: 'select',
        },
        options: ['sm', 'default', 'lg'],
        defaultValue: 'default',
      },
      color: {
        control: {
          type: 'select',
        },
        options: ['primary', 'neutral', 'error', 'secondary'],
        defaultValue: 'primary',
      },
      builders: {
        control: false,
      },
      class: {
        control: false,
      },
    },
  } satisfies Meta<Button>
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'
</script>

<!--👇 We create a “template” of how args map to rendering -->

<Template let:args>
  <Button {...args}>Button</Button>
</Template>

<!-- 👇 Each story then reuses that template -->

<Story
  name="PrimarySolid"
  args="{{ variant: 'solid', size: 'default', color: 'primary' }}"
/>

<Story
  name="ErrorSolid"
  args="{{ variant: 'solid', size: 'default', color: 'error' }}"
/>
