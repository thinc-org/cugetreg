<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'

  import { Checkbox } from './index.js'

  export const meta = {
    title: 'Atom/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
    argTypes: {
      checked: {
        control: 'boolean',
        defaultValue: false,
      },
      label: {
        control: 'text',
        defaultValue: '',
      },
      onClick: {
        action: 'onClick',
      },
    },
  } satisfies Meta<Checkbox>
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'
</script>

<!--👇 We create a “template” of how args map to rendering -->

<Template let:args>
  <Checkbox {...args} />
</Template>

<!-- 👇 Each story then reuses that template -->
<Story name="Unchecked" args="{{ checked: false, label: 'Accept Terms' }}" />

<Story name="Checked" args="{{ checked: true, label: 'Accept Terms' }}" />

<Story name="Unchecked Without Label" args="{{ checked: false }}" />

<Story name="Checked Without Label" args="{{ checked: true }}" />

<Story
  name="Disabled Checkbox"
  args="{{ checked: false, label: 'Disabled Checkbox', disabled: true }}"
/>
