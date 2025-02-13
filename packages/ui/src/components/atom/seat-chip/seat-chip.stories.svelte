<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { SeatChip } from './index.js'

  const { Story } = defineMeta<typeof SeatChip>({
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
  })
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
