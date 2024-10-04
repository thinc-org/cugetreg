<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'

  import { GenedChip } from './index.js'

  export const meta = {
    title: 'Atom/GenedChip',
    component: GenedChip,
    tags: ['autodocs'],
    argTypes: {
      type: {
        control: {
          type: 'select',
        },
        options: ['SC', 'SO', 'HU', 'IN'],
        defaultValue: 'SC',
      },
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
  } satisfies Meta<GenedChip>
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'
</script>

<!--👇 We create a “template” of how args map to rendering -->

<Template let:args>
  <GenedChip {...args}>GenedChip</GenedChip>
</Template>

<!-- 👇 Each story then reuses that template -->

<Story name="SC" args="{{ type: 'SC', closable: false }}" />

<Story name="SC Closable" args="{{ type: 'SC', closable: true }}" />

<Story name="SO" args="{{ type: 'SO', closable: false }}" />

<Story name="SO Closable" args="{{ type: 'SO', closable: true }}" />

<Story name="HU" args="{{ type: 'HU', closable: false }}" />

<Story name="HU Closable" args="{{ type: 'HU', closable: true }}" />

<Story name="IN" args="{{ type: 'IN', closable: false }}" />

<Story name="IN Closable" args="{{ type: 'IN', closable: true }}" />
