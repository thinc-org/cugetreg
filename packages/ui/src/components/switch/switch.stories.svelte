<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'

  import { Switch } from './index.js'

  export const meta = {
    title: 'Atom/Switch',
    component: Switch,
    tags: ['autodocs'],
    argTypes: {
      checked: {
        control: 'boolean',
        description: 'Whether the switch is checked or not.',
        defaultValue: false,
      },
      label: {
        control: 'text',
        description: 'The label associated with the switch.',
        defaultValue: 'Switch Label',
      },
      id: {
        control: 'text',
        description: 'ID for the switch element and its label.',
        defaultValue: 'switch',
      },
      className: {
        control: false,
      },
      onClick: {
        action: 'onClick',
      },
      onKeyDown: {
        action: 'onKeyDown',
      },
    },
  } satisfies Meta<Switch>
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'
</script>

<!-- Define the template for the switch component -->
<Template let:args>
  <Switch {...args} />
</Template>

<!-- Define the stories with different states -->
<Story
  name="Default"
  args="{{ checked: false, label: 'Switch Label', id: 'switch' }}"
/>

<Story
  name="Checked"
  args="{{ checked: true, label: 'Checked Switch', id: 'checked-switch' }}"
/>

<Story
  name="With Custom Label"
  args="{{ checked: false, label: 'Custom Label', id: 'custom-switch' }}"
/>

<Story
  name="Disabled"
  args="{{
    checked: false,
    label: 'Disabled Switch',
    id: 'disabled-switch',
    disabled: true,
  }}"
/>
