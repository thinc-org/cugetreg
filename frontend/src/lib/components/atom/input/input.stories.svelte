<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { Input } from './index.js'

  const { Story } = defineMeta<typeof Input>({
    title: 'Atom/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
      placeholder: {
        control: 'text',
        defaultValue: 'Input',
      },
      state: {
        control: {
          type: 'select',
        },
        options: ['default', 'error', 'success'],
        defaultValue: 'default',
      },
      class: {
        control: false,
      },
    },
  })
</script>

<!-- 👇 Each story then reuses that template -->

<Story name="Default" args={{ state: 'default', placeholder: 'Input' }} />

<Story name="Error" args={{ state: 'error', placeholder: 'Input' }} />

<Story name="Success" args={{ state: 'success', placeholder: 'Input' }} />
