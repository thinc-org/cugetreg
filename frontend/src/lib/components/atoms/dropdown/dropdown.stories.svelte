<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import Dropdown from './dropdown.svelte'

  const { Story } = defineMeta({
    title: 'Atom/Dropdown',
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component: `The **Dropdown** component lets users select one option from a list.`,
        },
      },
    },
    argTypes: {
      value: { control: 'text' },
      state: {
        control: { type: 'select' },
        options: ['default', 'error', 'success'],
      },
      options: { control: 'object' },
      className: { control: 'text' },
    },
  })
</script>

<script lang="ts">
  export let args: any = {
    value: 'ทวิภาค', // default selected value
    options: [
      { value: 'ทวิภาค', label: 'ทวิภาค' },
      { value: 'ตรีภาค', label: 'ตรีภาค' },
      { value: 'นานาชาติ', label: 'นานาชาติ' },
    ],
    state: 'default',
    className: 'w-full',
  }
</script>

<Story name="Default">
  <Dropdown {...args} bind:value={args.value} />
</Story>

<Story name="Error">
  <Dropdown {...args} bind:value={args.value} state="error" />
</Story>

<Story name="Success">
  <Dropdown {...args} bind:value={args.value} state="success" />
</Story>
