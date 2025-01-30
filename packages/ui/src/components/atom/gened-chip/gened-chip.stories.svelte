<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { GenedChip } from './index.js'

  const { Story } = defineMeta<typeof GenedChip>({
    title: 'Atom/Gened Chip',
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
  })
</script>

<!-- 👇 Each story then reuses that template -->

<Story name="SC" args={{ type: 'SC', closable: false }} />

<Story name="SC Closable" args={{ type: 'SC', closable: true }} />

<Story name="SO" args={{ type: 'SO', closable: false }} />

<Story name="SO Closable" args={{ type: 'SO', closable: true }} />

<Story name="HU" args={{ type: 'HU', closable: false }} />

<Story name="HU Closable" args={{ type: 'HU', closable: true }} />

<Story name="IN" args={{ type: 'IN', closable: false }} />

<Story name="IN Closable" args={{ type: 'IN', closable: true }} />
