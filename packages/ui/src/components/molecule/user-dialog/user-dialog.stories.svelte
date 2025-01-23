<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { UserDialog } from './index'

  const { Story } = defineMeta<typeof UserDialog>({
    title: 'Molecule/User Dialog',
    component: UserDialog,
    tags: ['autodocs'],
    argTypes: {
      imageUrl: {
        control: 'text',
      },
      name: {
        control: 'text',
      },
      id: {
        control: 'text',
      },
    },
  })
</script>

<Story
  name="Example"
  args={{
    name: 'Wanrudee Kkk',
    id: '6XXXXXXXXX',
  }}
/>
