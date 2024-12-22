<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'

  import { Label } from './index.js'

  export const meta = {
    title: 'Atom/Label',
    component: Label,
    tags: ['autodocs'],
    argTypes: {
      state: {
        control: {
          type: 'select',
        },
        options: ['default', 'error', 'success', 'disable'],
        defaultValue: 'default',
      },
      label: {
        control: {
          type: 'text',
        },
        defaultValue: 'SelectLabel',
      },
      class: {
        control: false,
      },
    },
  } satisfies Meta<Label>
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'
</script>

<!--👇 We create a “template” of how args map to rendering -->
<Template let:args>
  <Label {...args} />
</Template>

<!-- 👇 Each story then reuses that template -->
<Story name="Default" args="{{ label: 'SelectLabel', state: 'default' }}" />

<Story name="Error" args="{{ label: 'SelectLabel', state: 'error' }}" />

<Story name="Success" args="{{ label: 'SelectLabel', state: 'success' }}" />

<Story name="Disable" args="{{ label: 'SelectLabel', state: 'disable' }}" />
