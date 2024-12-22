<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'

  import { Select } from './index.js'

  export const meta = {
    title: 'Atom/Select',
    component: Select,
    tags: ['autodocs'],
    argTypes: {
      state: {
        control: {
          type: 'select',
        },
        options: ['default', 'error', 'success', 'disable'],
        defaultValue: 'default',
      },
      placeholder: {
        control: {
          type: 'text',
        },
        defaultValue: 'โปรดเลือกตัวเลือก',
      },
      items: {
        control: false,
        defaultValue: ['option1', 'option2'],
      },
      class: {
        control: false,
      },
    },
  } satisfies Meta<Select>
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'
</script>

<!--👇 We create a “template” of how args map to rendering -->
<Template let:args>
  <Select {...args} />
</Template>

<!-- 👇 Each story then reuses that template -->
<Story
  name="Default"
  args="{{
    state: 'default',
    placeholder: 'Select',
    items: ['option1', 'option2'],
  }}"
/>

<Story
  name="Error"
  args="{{
    state: 'error',
    placeholder: 'Select',
    items: ['option1', 'option2'],
  }}"
/>

<Story
  name="Success"
  args="{{
    state: 'success',
    placeholder: 'Select',
    items: ['option1', 'option2'],
  }}"
/>

<Story
  name="Disable"
  args="{{
    state: 'disable',
    placeholder: 'Select',
    items: ['option1', 'option2'],
  }}"
/>
