<script context="module" lang="ts">
  import { Story } from '@storybook/addon-svelte-csf'
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

<!--👇 We create a “template” of how args map to rendering -->

<!-- 👇 Each story then reuses that template -->

<Story name="full" args={{ status: 'full', closable: false }}>
  {#snippet children(args)}
    <SeatChip {...args}>28/28</SeatChip>
  {/snippet}
</Story>

<Story name="avaliable" args={{ status: 'avaliable', closable: false }}>
  {#snippet children(args)}
    <SeatChip {...args}>10/28</SeatChip>
  {/snippet}
</Story>

<Story name="close" args={{ status: 'close', closable: false }}>
  {#snippet children(args)}
    <SeatChip {...args}>1/28</SeatChip>
  {/snippet}
</Story>
