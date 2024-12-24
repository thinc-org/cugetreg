<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { Chip } from './index.js'

  const { Story } = defineMeta<typeof Chip>({
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
  })
</script>

<!-- 👇 Each story then reuses that template -->

<Story name="Default" args={{ closable: false }}>
  {#snippet children(args)}
    <Chip {...args}>Chip</Chip>
  {/snippet}
</Story>

<Story name="Default Closable" args={{ closable: true }}>
  {#snippet children(args)}
    <Chip {...args}>Chip</Chip>
  {/snippet}
</Story>
