<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { DayChip } from './index.js'

  const { Story } = defineMeta<typeof DayChip>({
    title: 'Atom/Day Chip',
    component: DayChip,
    tags: ['autodocs'],
    argTypes: {
      day: {
        control: {
          type: 'select',
        },
        options: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'],
        defaultValue: 'MO',
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

<Story name="Monday" args={{ day: 'MO', closable: false }} />

<Story name="Monday Closable" args={{ day: 'MO', closable: true }} />

<Story name="Tuesday" args={{ day: 'TU', closable: false }} />

<Story name="Tuesday Closable" args={{ day: 'TU', closable: true }} />

<Story name="Wednesday" args={{ day: 'WE', closable: false }} />

<Story name="Wednesday Closable" args={{ day: 'WE', closable: true }} />

<Story name="Thursday" args={{ day: 'TH', closable: false }} />

<Story name="Thursday Closable" args={{ day: 'TH', closable: true }} />

<Story name="Friday" args={{ day: 'FR', closable: false }} />

<Story name="Friday Closable" args={{ day: 'FR', closable: true }} />

<Story name="Saturday" args={{ day: 'SA', closable: false }} />

<Story name="Saturday Closable" args={{ day: 'SA', closable: true }} />

<Story name="Sunday" args={{ day: 'SU', closable: false }} />

<Story name="Sunday Closable" args={{ day: 'SU', closable: true }} />
