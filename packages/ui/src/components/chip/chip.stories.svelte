<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'

  import { Chip } from './index.js'

  export const meta = {
    title: 'Atom/Chip',
    component: Chip,
    tags: ['autodocs'],
    argTypes: {
      closable: {
        control: 'boolean',
      },
      onClose: {
        action: 'onClose',
      },
      class: {
        control: false,
      },
    },
  } satisfies Meta<Chip>
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'
</script>

<!--👇 We create a “template” of how args map to rendering -->

<Template let:args>
  <Chip {...args}>Chip</Chip>
</Template>

<!-- 👇 Each story then reuses that template -->

<Story name="Default" args="{{ closable: false }}" />

<Story name="Default Closable" args="{{ closable: true }}" />
