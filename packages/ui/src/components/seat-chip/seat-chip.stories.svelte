<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'

  import { SeatChip } from './index.js'

  export const meta = {
    title: 'Atom/SeatChip',
    component: SeatChip,
    tags: ['autodocs'],
    argTypes: {
      status: {
        control: {
          type: 'select',
        },
        options: ['full', 'avaliable', 'close'],
        defaultValue: 'full',
      },
      class: {
        control: false,
      },
    },
  } satisfies Meta<SeatChip>
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'
</script>

<!--👇 We create a “template” of how args map to rendering -->

<Template let:args>
  <SeatChip {...args}>28/28</SeatChip>
</Template>

<!-- 👇 Each story then reuses that template -->

<Story name="full" args="{{ status: 'full', closable: false }}" />

<Story name="avaliable" args="{{ status: 'avaliable', closable: false }}" />

<Story name="close" args="{{ status: 'close', closable: false }}" />
