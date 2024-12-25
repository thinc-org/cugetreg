<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { Switch } from './index.js'

  const { Story } = defineMeta<typeof Switch>({
    title: 'Atom/Switch',
    component: Switch,
    tags: ['autodocs'],
    argTypes: {
      'aria-label': {
        control: 'text',
        description: 'string value that labels an interactive element',
      },
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
      class: {
        control: false,
      },
      onclick: {
        action: 'onClick',
      },
      onkeydown: {
        action: 'onKeyDown',
      },
    },
  })
</script>

<!-- Define the stories with different states -->

<Story
  name="Default"
  args={{
    checked: false,
    label: 'Switch Label',
    id: 'switch',
    'aria-label': 'for example of default switch',
  }}
/>

<Story
  name="Checked"
  args={{
    checked: true,
    label: 'Checked Switch',
    id: 'checked-switch',
    'aria-label': 'for example of checked switch ',
  }}
/>

<Story
  name="With Custom Label"
  args={{
    checked: false,
    label: 'Custom Label',
    id: 'custom-switch',
    'aria-label': 'for example of custom label switch ',
  }}
/>

<Story
  name="Disabled"
  args={{
    checked: false,
    label: 'Disabled Switch',
    id: 'disabled-switch',
    disabled: true,
    'aria-label': 'for example of disable switch ',
  }}
/>
